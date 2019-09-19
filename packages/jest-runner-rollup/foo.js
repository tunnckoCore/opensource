const path = require('path');
// const rollup = require('rollup');

// let ROLLUP_CACHE = null;

// const options = {
//   cache: ROLLUP_CACHE,
//   input: path.join(__dirname, 'src', 'runner.js'),
//   output: [
//     { file: path.join(__dirname, 'qux/za/ok/foo.cjs.js'), format: 'cjs' },
//     { file: path.join(__dirname, 'qux/za/ok/foo.esm.js'), format: 'esm' },
//   ],
// };

// rollup.rollup(options).then(async (bundle) => {
//   ROLLUP_CACHE = bundle.cache;

//   await Promise.all(
//     options.output.map(async (outputOptions) => {
//       console.log(await bundle.write(outputOptions));
//     }),
//   );
// });

const rootDir = '/home/charlike/monorepo';
const pkgRootPath = '/home/charlike/monorepo/packages/foo';
const testPath = '/home/charlike/monorepo/packages/foo/src/app/index';

const options = { srcDir: 'src' };

// ! todo: split and replace src with dist
// console.log(path.relative(testPath, path.join(pkgRootPath, 'dist')));

const relativeTestPathToRoot = path.relative(pkgRootPath, testPath);

const outFile = relativeTestPathToRoot
  .split('/')
  .reduce((acc, part) => acc.concat(part === options.srcDir ? null : part), [])
  .filter(Boolean);

const foo = ['a', 'b'];

foo.push('c', 'd');

console.log(outFile);
console.log(foo);

// const parts = relativeTestPath.split('/');
// const foundIndex = parts.indexOf(options.srcDir);

// const outFile = foundIndex < 0;

// if (foundIndex < 0) {
// }

// // pkgRoot = parts.slice(0, foundIndex).join('/');

// console.log(path.join(pkgRootPath, 'dist'));
// console.log(relativeTestPathToRoot);
// console.log(foundIndex, parts);
// console.log(path.relative(pkgRootPath, relativeTestPath));
