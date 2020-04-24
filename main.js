import { fork } from 'child_process';
import EventEmitter from 'events';

let emitter = new EventEmitter();
let child = fork('./child.js');

child.on('message', n => emitter.emit('message', n));

let listener1 = n => {
  console.log('Parent 1', n);
  emitter.off('message', listener1);
  child.send(2);
};

emitter.on('message', listener1);

let listener2 = n => {
  console.log('Parent 2', n);
  emitter.off('message', listener2);
};
emitter.on('message', listener2);

child.send(1);
