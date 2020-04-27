import { parentCreator as creator } from './childProcessCreator';
import Koa from 'koa';

const { send, restart } = creator('./child.js');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log('[Parent] Get new request.', ctx.req.url);
  ctx.response.body = await send(ctx.req.url);
  ctx.response.type = 'text/html';
});

app.listen(3000);
console.log('[Parent] Listening on the port 3000.');
