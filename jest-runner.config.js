'use strict';

// const builtins = require('builtin-modules');
// const nodeResolve = require('rollup-plugin-node-resolve');
// const commonjs = require('rollup-plugin-commonjs');

const fs = require('fs');
const path = require('path');
// const memoizeFS = require('memoize-fs');

const { cov } = require('./package.json');

// const memoizeCachePath = path.join('.cache', 'docs-posthook-memoized');
// const memoizeFN = memoizeFS({ cachePath: memoizeCachePath }).fn;

// function memoize(func) {
//   return async (...args) => {
//     const fn = process.env.FORCE_RELOAD ? await memoizeFN(func) : func;
//     const res = await fn(...args);
//     return res;
//   };
// }

const presetOptions = {
  react: true,
  typescript: true,
  node: '8.11',
};

module.exports = {
  eslint: {
    // useEslintrc: false,
    // baseConfig: {
    //   extends: '@tunnckocore',
    // },
  },
  docks: {
    verbose: true,
    postHook: async ({ pkgRoot, jestConfig: { rootDir } }) => {
      const pkgDir = path.relative(rootDir, pkgRoot);
      const pkgJsonPath = path.join(pkgRoot, 'package.json');
      const covField = cov[pkgDir];

      // eslint-disable-next-line import/no-dynamic-require, global-require
      const pkgJson = require(pkgJsonPath);

      const json = {
        ...pkgJson,
        cov: covField || { color: 'grey' },
      };

      const pkgStr = JSON.stringify(json, null, 2);
      fs.writeFileSync(pkgJsonPath, pkgStr);

      /* eslint-disable-next-line global-require */
      const { exec } = require('@tunnckocore/execa');

      await exec('verb', { cwd: pkgRoot });

      // const writeAndRun = await memoize(async (fp, pkgObj) => {
      //   const json = {
      //     ...pkgObj,
      //     cov: covField || { color: 'grey' },
      //   };

      //   const pkgStr = JSON.stringify(json, null, 2);
      //   fs.writeFileSync(fp, pkgStr);

      //   /* eslint-disable-next-line global-require */
      //   const { exec } = require('@tunnckocore/execa');

      //   await exec('verb', { cwd: pkgRoot });
      //   return pkgStr;
      // });

      // await writeAndRun(pkgJsonPath, pkgJson);
    },
  },

  babel: [
    {
      config: {
        presets: [['@tunnckocore/babel-preset', presetOptions]],
        comments: false,
        sourceMaps: true,
      },
      outDir: 'dist/main',
      monorepo: true,
    },
    {
      config: {
        presets: [
          ['@tunnckocore/babel-preset', { ...presetOptions, modules: false }],
        ],
        comments: false,
        sourceMaps: true,
      },
      outDir: 'dist/module',
      monorepo: true,
    },
  ],

  // rollup: 'fooo',
  // rolldown: {
  //   external: builtins,
  //   inlineDynamicImports: true,
  //   experimentalTopLevelAwait: true,
  //   plugins: [
  //     nodeResolve({
  //       preferBuiltins: true,
  //       mainFields: ['module', 'main'],
  //     }),
  //     commonjs({
  //       // extensions,
  //     }),
  //   ],
  //   output: {
  //     format: 'esm',
  //   },
  // },
};
