import EventEmitter from 'events';
import { fork } from 'child_process';
import { generate } from 'shortid';

export const parentCreator = link => {
  let process = fork(link);
  let emitter = new EventEmitter();

  let restartFlag = false, taskCount = 0;

  const watch = () => {
    process.on('message', ({ payload, id, type }) => {
      if (type === 'normal') {
        emitter.emit('message', { payload, id })
      } else if (type === 'init') {
        emitter.emit('init');
      }
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
        process.send({ payload, id: myId, type: 'normal' });
      });
    },
    restart: () => {
      restartFlag = true;
      while (taskCount > 0);
      process.kill();
      const fn = () => {
        restartFlag = false;
        emitter.off('init', fn);
        console.log('[Parent] Restart succeed.')
      };
      emitter.once('init', fn);
      process = fork(link);
      watch();
      process.send({ type: 'init' });
    }
  };
};

export const childCreator = processor =>
  process.on('message', ({ payload, id, type }) => {
    if (type === 'normal') {
      process.send({
        payload: processor(payload), id, type
      });
    } else if (type === 'init') {
      process.send({ type });
    }
  });
