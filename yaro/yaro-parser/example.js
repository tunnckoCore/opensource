import process from 'node:process';
import mri from 'mri';
// import nopt from 'nopt';
// import minargs from 'minargs';
import minimist from 'minimist';
import { yaro } from './src/index.js';

console.time('yaro v5');
const a = yaro(process.argv.slice(2), {
  array: { includes: true },
  // camelcase: false,
  // autoCount: false,
});
console.timeEnd('yaro v5');

// console.time('nopt');
// nopt({}, {}, argv);
// console.timeEnd('nopt');

console.time('mri');
const b = mri(process.argv.slice(2));
console.timeEnd('mri');

console.time('minimist');
const c = minimist(process.argv.slice(2));
console.timeEnd('minimist');

// console.time('minargs');
// const d = minargs.minargs(process.argv.slice(2));
// console.timeEnd('minargs');

// console.log('yaro:', a);
// console.log('mri', b);
// console.log('minimist', c);
// console.log('minargs', d);
