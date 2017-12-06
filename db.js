const knex = require('knex');
const fs = require('fs');

if (fs.existsSync('./db.sqlite')) {
  fs.unlinkSync('./db.sqlite');
}

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite"
  },
  useNullAsDefault: true,
});

// https://stackoverflow.com/a/39838385/6123494
const concat = (x,y) =>
  x.concat(y)

const flatMap = (f,xs) =>
  xs.map(f).reduce(concat, [])

// https://stackoverflow.com/a/45355468/6123494
const numberRange = (start, end) =>
  new Array(end - start).fill().map((d, i) => i + start)


async function init() {
  await db.schema.createTableIfNotExists('organizations', (table) => {
    table.increments();
    table.string('org_name');
    table.integer('parent');
    table.foreign('parent').references('organizations.id')
  });
}

async function insertOrganizations(organizations, parent = null) {
  let batch = [{ parent, daughters: [...organizations] }];

  while (batch.length > 0) {
    const rows = flatMap(
      ({ parent, daughters }) =>
          daughters.map(({ org_name }) => ({ parent, org_name })),
      batch,
    );

    const [lastInsertedId] = await db.batchInsert('organizations', rows)
      .returning('id');

    const daughtersIds =
      numberRange(lastInsertedId - rows.length + 1, lastInsertedId + 1);

    const nextBatchDaughters = flatMap(
      ({ daughters }) => daughters.map(d => d.daughters),
      batch,
    );

    batch = daughtersIds.map((id, i) => ({
      parent: id,
      daughters: nextBatchDaughters[i],
    })).filter(({ daughters }) => daughters && daughters.length);
  }
}

async function getRelationships(organization, page, size) {
  const offset = (page - 1) * size
  const rows = await db.raw(`
    with relationships as (
      select o2.org_name, 'parent' as relationship
        from organizations o1 inner join organizations o2 on o1.parent = o2.id
        where o1.org_name == :name
      union
      select o2.org_name, 'daughter' as relationship
        from organizations o1 inner join organizations o2 on o1.id = o2.parent
        where o1.org_name == :name
      union
      select o2.org_name, 'sister' as relationship
        from organizations o1 inner join organizations o2 on o1.parent = o2.parent
        where o1.org_name == :name
    ), total_count as (
      select count(*) as total_count from relationships
    )

    select relationships.*, total_count.*
    from relationships, total_count

    limit :limit
    offset :offset

  `, { name: organization, offset, limit: size });
  return [
    rows.map(({ org_name, relationship }) => ({ org_name, relationship })),
    (rows.length > 0 ? rows[0].total_count : 0)
  ];
}

module.exports = {
  init,
  insertOrganizations,
  getRelationships,
};
