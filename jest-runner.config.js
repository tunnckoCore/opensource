// const builtins = require('builtin-modules');
// const nodeResolve = require('rollup-plugin-node-resolve');
// const commonjs = require('rollup-plugin-commonjs');

const presetOptions = {
  react: true,
  typescript: true,
  node: '8.11',
};

module.exports = {
  monorepo: true,
  eslint: {
    // useEslintrc: false,
    // baseConfig: {
    //   extends: '@tunnckocore',
    // },
  },

  babel: [
    {
      config: {
        presets: [['@tunnckocore/babel-preset', presetOptions]],
        comments: false,
        sourceMaps: 'both',
      },
      outDir: 'dist/main',
    },
    {
      config: {
        presets: [
          ['@tunnckocore/babel-preset', { ...presetOptions, modules: false }],
        ],
        comments: false,
        sourceMaps: 'both',
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
