const builtins = require('builtin-modules');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  external: builtins,
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
  ],
  output: { format: 'cjs' },
};
