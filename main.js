import { fork } from 'child_process';
import EventEmitter from 'events';
import Koa from 'koa';

let emitter = new EventEmitter();
let child = fork('./child.js');

child.on('message', n => emitter.emit('message', n));

const app = new Koa();

app.use(async (ctx, next) => {
  console.log('[Parent] Get new request.', ctx.req.query);
  return await (new Promise(resolve => {
    const listener = ret => {
      console.log('[Parent] Get the child\'s message.', ret);
      ctx.response.body = ret;
      ctx.response.type = 'text/html';
      next();
      emitter.off('message', listener);
      resolve();
    }
    emitter.on('message', listener);
    child.send(ctx.req.query || {});
  }));
});

app.listen(3000);
console.log('[Parent] Listening on the port 3000.');
