import { childCreator } from './childProcessCreator';

childCreator(async payload => {
  console.log('[Child] Get request!', payload);
  return await new Promise(resolve => setTimeout(() => {
    console.log('[Child] Has waited for 100 ms.');
    resolve('test');
  }, 100));
});