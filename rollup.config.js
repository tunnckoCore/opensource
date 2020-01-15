'use strict';

/* eslint-XXXdisable import/no-extraneous-dependencies */
const json = require('@rollup/plugin-commonjs');
const babel = require('rollup-plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
// const typescript = require('@wessberg/rollup-plugin-ts');
const { minify } = require('terser');
const { terser: terserPlugin } = require('rollup-plugin-terser');
const { getWorkspacesAndExtensions } = require('@tunnckocore/utils');

const { extensions } = getWorkspacesAndExtensions(__dirname);

const externals = [].concat('@babel/core', '@babel/parser');

const { code: tckInterop } = minify(`
const ___exportsWithoutDefault = Object.keys(exports || {})
  .filter((x) => x !== 'default')
  .reduce((acc, key) => {
    acc[key] = exports[key];
    return acc;
  }, {});

module.exports = Object.assign(exports.default || {}, ___exportsWithoutDefault);
`);

module.exports = {
  hooks: {},
  onwarn: () => {},
  external: externals,
  inlineDynamicImports: true,
  experimentalTopLevelAwait: true,
  plugins: [
    process.env.ROLLUP_RESOLVE &&
      nodeResolve({
        preferBuiltins: true,
        mainFields: ['module', 'main', 'unpkg'],
      }),
    process.env.ROLLUP_RESOLVE &&
      commonjs({
        // extensions,
      }),
    process.env.ROLLUP_RESOLVE &&
      json({
        compact: true,
        preferConst: true,
        // include: 'node_modules/**',
      }),
    process.env.ROLLUP_BABEL &&
      babel({
        extensions,
        presets: [
          [
            '@tunnckocore/babel-preset',
            {
              modules: false,
              react: true,
              typescript: true,
              node: '10.13',
            },
          ],
        ],
        comments: false,
        sourceMaps: true,
      }),
    // typescript({
    //   transpiler: 'babel',
    //   tsconfig: './tsconfig.json',
    //   babelConfig: {
    //     presets: [
    //       [
    //         '@tunnckocore/babel-preset',
    //         {
    //           react: true,
    //           typescript: true,
    //           node: '8.11',
    //         },
    //       ],
    //     ],
    //     comments: false,
    //     sourceMaps: true,
    //   },
    // }),
    process.env.ROLLUP_MIN &&
      terserPlugin({
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
      }),
  ],
  output: [
    {
      exports: 'named',
      outro: tckInterop,
      esModule: true,
      sourcemap: true,
      sourcemapExcludeSources: true,
      preferConst: true,
      format: 'cjs',
      // file: 'dist/cjs/index.min.js',
      // file: 'builds/index.cjs.js',
    },
    {
      sourcemap: true,
      sourcemapExcludeSources: true,
      preferConst: true,
      format: 'esm',
      // file: 'dist/esm/index.min.js',
      // file: 'builds/index.esm.js',
    },
  ],
};
