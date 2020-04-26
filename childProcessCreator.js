import EventEmitter from 'events';
import { fork } from 'child_process';
import { generate } from 'shortid';

export const parentCreator = link => {
  let process = fork(link);
  let emitter = new EventEmitter();

  let restartFlag = false, taskCount = 0;

  const watch = () => {
    process.on('message', n => emitter.emit('message', n));
    process.on('exit', () => {
      process.fork(link);
      watch();
    });
  };
  watch();

  return {
    send: async payload => {
      return await new Promise(resolve => {
        while (restartFlag);
        taskCount += 1;
        const myId = generate();
        const fn = ({ payload, id }) => {
          if (myId === id) {
            taskCount -= 1;
            resolve(payload);
            emitter.off('message', fn);
          }
        };
        emitter.on('message', fn);
        process.send({ payload, id: myId });
      });
    },
    restart: () => {
      restartFlag = true;
      while (taskCount > 0);
      process.exit();
      process = fork(link);
      watch();
      restartFlag = false;
    }
  };
};

export const childCreator = processor =>
  process.on('message', ({ payload, id }) => process.send({
    payload: processor(payload), id
  }));
