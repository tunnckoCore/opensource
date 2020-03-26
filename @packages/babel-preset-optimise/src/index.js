'use strict';

/**
 * Be aware that when you use `minifyBuiltins: true` you _MAY_ get a bigger output,
 * but that's not always guaranteed, just try for your case.
 *
 * If you want to use JSX (React) in typescript, pass `options.jsx: true`.
 * If you want to use other JSX library (in typescript or javascript),
 * pass an object to the `options.jsx` for further customization, because
 * it is directly passed to `preset-react` with its defaults.
 *
 *
 * @name  babelPresetOptimize
 * @param {object} options - optionally control what can be included
 * @param {boolean} options.jsx - default `false`, pass `true` if you want `react`; pass an object for more customization (passed to react preset)
 * @param {boolean} options.commonjs - default `false`, pass non-falsey value to transform ESModules to CommonJS
 * @param {boolean} options.typescript - default `false`, includes the TypeScript preset
 * @param {boolean} options.minifyBuiltins - default `false`, includes [babel-plugin-minify-builtins][]
 * @public
 */
module.exports = function babelPresetOptimize(api, options) {
  api.assertVersion(7);

  // NOTE: minifyBuiltins: true might output a bigger output - it depends, try your codebase.
  const {
    jsx = false,
    commonjs = false,
    typescript = false,
    minifyBuiltins = false,
  } = { ...options };

  const hasJsxOptions = jsx && typeof jsx === 'object';
  const pragma = hasJsxOptions ? jsx.pragma : undefined;
  const jsxPreset = hasJsxOptions ? ['@babel/preset-react', jsx] : undefined;

  const react = jsx === true ? '@babel/preset-react' : jsxPreset;

  return {
    presets: [
      typescript && [
        '@babel/preset-typescript',
        { jsxPragma: pragma, isTSX: true, allExtensions: true },
      ],
      '@babel/preset-modules',
      react,
    ].filter(Boolean),
    plugins: [
      commonjs && '@babel/plugin-transform-modules-commonjs',
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
