const Router = require('koa-router');

const router = new Router();
const db = require('./db');


router.get('/relationships/:name', async (ctx, next) => {
  await next();
  const { page = 1, size = 100 } = ctx.request.query;
  [relationships, total_count] = await db.getRelationships(ctx.params.name, page, size);
  ctx.body = { relationships, total_count, page, size };
});

router.post('/organizations', async (ctx, next) => {
  await next();
  await db.insertOrganizations(ctx.request.body);
  ctx.body = { success: true };
});

module.exports = router;
