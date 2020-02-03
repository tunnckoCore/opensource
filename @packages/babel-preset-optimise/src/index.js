'use strict';

/**
 * Be aware that when you use `minifyBuiltins: true` you _MAY_ get a bigger output,
 * but that's not always guaranteed, just try for your case.
 *
 * @name  babelPresetOptimize
 * @param {object} options - optionally control what can be included
 * @param {boolean} options.react - default `false`, includes the React preset and 3 react plugins
 * @param {boolean} options.typescript - default `false`, includes the TypeScript preset
 * @param {boolean} options.minifyBuiltins - default `false`, includes [babel-plugin-minify-builtins][]
 * @public
 */
module.exports = function babelPresetOptimize(api, options) {
  api.assertVersion(7);

  // NOTE: minifyBuiltins: true might output a bigger output - it depends, try your codebase.
  const { react = false, typescript = false, minifyBuiltins = false } = {
    ...options,
  };

  return {
    presets: [
      typescript && [
        '@babel/preset-typescript',
        { isTSX: react, allExtensions: true },
      ],
      '@babel/preset-modules',
      react && '@babel/preset-react',
    ].filter(Boolean),
    plugins: [
      'babel-plugin-annotate-pure-calls',
      'babel-plugin-dev-expression',
      minifyBuiltins && 'babel-plugin-minify-builtins',
      'babel-plugin-minify-constant-folding',
      'babel-plugin-transform-node-env-inline',
      'babel-plugin-transform-inline-environment-variables',

      'babel-plugin-transform-regexp-constructors',
      ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
      'babel-plugin-transform-remove-undefined',
      'babel-plugin-transform-undefined-to-void',
      'babel-plugin-unassert',

      // ! enable when fix https://github.com/babel/minify/issues/973
      // ! use `terser` instead! through rollup for example.
      // When unused variable, it doesn't removes the value of the var
      // 'babel-plugin-minify-dead-code-elimination',

      react && 'babel-plugin-transform-react-constant-elements',
      react && 'babel-plugin-transform-react-pure-class-to-function',
      react && [
        'babel-plugin-transform-react-remove-prop-types',
        { removeImport: true },
      ],
    ].filter(Boolean),
  };
};
