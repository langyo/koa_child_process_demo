import { childCreator } from './childProcessCreator';

childCreator(payload => {
  console.log('[Child] Get request!', payload);
  return 'test';
});