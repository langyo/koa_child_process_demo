import { fork } from 'child_process';

let child = fork('./child.js');

child.on('message', msg => {
  console.log('[Parent]', msg);
  child.send(msg + 1);
});

child.send(1);
