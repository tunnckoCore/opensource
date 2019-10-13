/* eslint-Xdisable import/no-extraneous-dependencies */
const builtins = require('builtin-modules');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const json = require('rollup-plugin-json');

const fs = require('fs');
const path = require('path');

const externals = builtins.concat(
  '@babel/core',
  'eslint',
  // 'jest-worker',
  // 'cosmiconfig',
  'parse-comments',
  // '@tunnckocore/create-jest-runner',
);

const tunnckocoreInterop = `const ___exportsWithoutDefault = Object.keys(exports)
  .filter((x) => x !== 'default')
  .reduce((acc, key) => {
    acc[key] = exports[key];
    return acc;
  }, {});

module.exports = Object.assign(exports.default, ___exportsWithoutDefault);
`;

module.exports = {
  hooks: {
    onFormat({ pkgRoot, inputFile, ...ctx }) {
      // if jest-runner-*, then we switch output.file to `runner.js` instead of `index.js`
      if (inputFile.includes('jest-runner-')) {
        const { file } = ctx.outputOptions;

        ctx.outputOptions.file = path.join(path.dirname(file), 'runner.js');

        const contentsCJS = `const { join } = require('path');const { createJestRunner } = require('@tunnckocore/create-jest-runner');module.exports = createJestRunner(join(__dirname, 'runner.js'));`;
        const contentsESM = `import { join } from 'path';import { createJestRunner } from '@tunnckocore/create-jest-runner';export default createJestRunner(join(__dirname, 'runner.js'));`;

        const fp = path.join(pkgRoot, ctx.outputOptions.dist, 'index.js');
        fs.mkdirSync(path.dirname(fp), { recursive: true });
        fs.writeFileSync(
          fp,
          ctx.outputOptions.format === 'esm' ? contentsESM : contentsCJS,
        );

        return ctx;
      }
      return ctx;
    },
    onWrite({ outputOptions, inputFile }) {
      if (/cli\..+$/.test(inputFile)) {
        return { ...outputOptions, banner: '#!/usr/bin/env node\n' };
      }
      return { outputOptions };
    },
    // onPkg: ({ pkgRoot, output }) => {
    //   const {
    //     name,
    //     version,
    //     description,
    //     license,
    //     author,
    //     engines,
    //     keywords,
    //     repository,
    //     dependencies,
    //     peerDependencies,
    //   } = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'));

    //   const pkg = {
    //     name,
    //     version,
    //     description,
    //     license,
    //     author,
    //     engines,
    //     keywords,
    //     repository,
    //     dependencies,
    //     peerDependencies,
    //     files: output.map(({ format }) => format),
    //     main: output.find(({ format }) => format === 'cjs').file,
    //     module: output.find(({ format }) => format === 'esm').file,
    //     typings: 'dist/types/index.d.ts',
    //   };

    //   const pkgJson = Object.keys(pkg).reduce((acc, key) => {
    //     if (pkg[key]) {
    //       acc[key] = pkg[key];
    //     }
    //     return acc;
    //   }, {});

    //   fs.writeFileSync(
    //     path.join(pkgRoot, 'dist', 'package.json'),
    //     JSON.stringify(pkgJson, null, 2),
    //   );
    // },
  },

  // skipCached: true,
  // fresh: true,
  onwarn: () => {},
  external: externals,
  inlineDynamicImports: true,
  experimentalTopLevelAwait: true,
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      mainFields: ['module', 'main'],
    }),
    commonjs({
      // extensions,
    }),
    json({
      compact: true,
      preferConst: true,
      // include: 'node_modules/**',
    }),
    terser({
      sourcemap: true,
      output: { comments: false },
      compress: {
        keep_infinity: true,
        pure_getters: true,
        passes: 10,
      },
      ecma: 9,
      toplevel: true,
      warnings: true,
      // exclude: ['**/*.min.js', 'node_modules/**'],
    }),
  ],
  output: [
    {
      exports: 'named',
      outro: tunnckocoreInterop,
      esModule: false,
      sourcemap: true,
      preferConst: true,
      format: 'cjs',
      // file: 'dist/cjs/index.min.js',
      // file: 'builds/index.cjs.js',
    },
    {
      sourcemap: true,
      preferConst: true,
      format: 'esm',
      // file: 'dist/esm/index.min.js',
      // file: 'builds/index.esm.js',
    },
  ],
};
