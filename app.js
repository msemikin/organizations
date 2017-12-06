const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const router = require('./routes')
const db = require('./db')

const app = new Koa();

app.use(bodyParser());
app
  .use(router.routes())
  .use(router.allowedMethods());


async function start() {
  console.log('initializing db...');
  await db.init();
  app.listen(3000);
  console.log('Listening on port 3000')
}

start()
