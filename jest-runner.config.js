// const builtins = require('builtin-modules');
// const nodeResolve = require('rollup-plugin-node-resolve');
// const commonjs = require('rollup-plugin-commonjs');

const fs = require('fs');
const path = require('path');
const { jestCov } = require('./package.json');

const presetOptions = {
  react: true,
  typescript: true,
  node: '8.11',
};

// eslint-disable-next-line max-params
function coverageColor(value, green = 100, yellow = 85, orange = 70, red = 35) {
  if (!value) {
    return 'grey';
  }
  if (value < red) {
    return 'red';
  }
  if (value < orange) {
    return 'orange';
  }
  if (value < yellow) {
    return 'EEAA22';
  }
  if (value < green) {
    return '99CC09';
  }
  return 'green';
}

module.exports = {
  monorepo: true,
  eslint: {
    // useEslintrc: false,
    // baseConfig: {
    //   extends: '@tunnckocore',
    // },
  },
  docs: {
    outfile: '.verb.md',
    postHook: ({ pkgRoot, jestConfig: { rootDir } }) => {
      const pkgDir = path.relative(rootDir, pkgRoot);
      const pkgJsonPath = path.join(pkgRoot, 'package.json');
      const cov = jestCov[pkgDir];

      // eslint-disable-next-line import/no-dynamic-require, global-require
      const pkgJson = require(pkgJsonPath);
      fs.writeFileSync(
        pkgJsonPath,
        JSON.stringify(
          {
            ...pkgJson,
            jestCov: {
              value: cov || 'unknown',
              color: coverageColor(cov),
            },
          },
          null,
          2,
        ),
      );

      /* eslint-disable-next-line global-require */
      const { exec } = require('@tunnckocore/execa');

      return exec('verb', { cwd: pkgRoot });
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
