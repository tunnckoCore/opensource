const path = require('path');
// const rollup = require('rollup');

// rollup
//   .rollup({ input: 'foo.js', output: { file: 'foo-cjs.js', format: 'cjs' } })
//   .then((bundle) => {
//     console.log(bundle);
//   });

const rootDir = '/home/charlike/monorepo';
const testPath = '/home/charlike/monorepo/packages/foo/src/index';

const options = { srcDir: 'src' };

const relativeTestPath = path.relative(rootDir, testPath);

let pkgRoot = null;
if (relativeTestPath.includes(options.srcDir)) {
  const parts = relativeTestPath.split('/');
  const foundIndex = parts.indexOf(options.srcDir);
  pkgRoot = parts.slice(0, foundIndex).join('/');
} else {
  // pkgRoot = path.dirname(pkgRoot);
}

console.log(pkgRoot);
console.log(relativeTestPath);
