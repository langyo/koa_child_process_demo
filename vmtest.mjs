import {
  Script,
  createContext
} from 'vm';

let testVar = 1;

const context = createContext({
  func: () => testVar += 1
});

const script = new Script(`
func()
`);

console.log('Before:', testVar);

script.runInContext(context);

console.log('After:', testVar);
