'use strict';

/**
 * Be aware that when you use `minifyBuiltins: true` you _MAY_ get a bigger output,
 * but that's not always guaranteed, just try for your case.
 *
 * If you want to use JSX (React) pass `options.jsx: true`.
 * If you want to use JSX (React) + TypeScript pass both `{ jsx: true, typescript: true }`.
 * If you wan to use Preact + TypeScript, `{ jsx: { pragma: 'h' }, typescript: true }`,
 * if `options.jsx` is an object, it is directly passed to `preset-react`.
 *
 *
 * @name  babelPresetOptimize
 * @param {object} options - optionally control what can be included
 * @param {boolean} options.jsx - default `false`, pass `true` if you want `react`; pass an object for more customization (passed to react preset)
 * @param {boolean} options.commonjs - default `false`, pass non-falsey value to transform ESModules to CommonJS
 * @param {boolean} options.typescript - default `false`, includes the TypeScript preset
 * @param {boolean} options.development - default `false`, disables few plugins; when it is `true` and `options.jsx` is enabled (true or object) we add `options.jsx.development: true` too
 * @param {boolean} options.minifyBuiltins - default `false`, includes [babel-plugin-minify-builtins][]
 * @public
 */
module.exports = function babelPresetOptimize(api, options) {
  api.assertVersion(7);

  // NOTE: minifyBuiltins: true might output a bigger output - it depends, try your codebase.
  const opts = {
    jsx: false,
    commonjs: false,
    typescript: false,
    development: false,
    minifyBuiltins: false,
    ...options,
  };

  if (opts.development === true && opts.jsx) {
    opts.jsx =
      opts.jsx === true
        ? { development: true }
        : { ...opts.jsx, development: true };
  }

  const hasJsxOptions = opts.jsx && typeof opts.jsx === 'object';
  const pragma = hasJsxOptions ? opts.jsx.pragma : undefined;
  const jsxPreset = hasJsxOptions
    ? ['@babel/preset-react', opts.jsx]
    : undefined;

  const react = opts.jsx === true ? '@babel/preset-react' : jsxPreset;

  return {
    presets: [
      opts.typescript && [
        '@babel/preset-typescript',
        { jsxPragma: pragma, isTSX: true, allExtensions: true },
      ],
      '@babel/preset-modules',
      react,
    ].filter(Boolean),
    plugins: [
      opts.commonjs && '@babel/plugin-transform-modules-commonjs',
      'babel-plugin-annotate-pure-calls',
      'babel-plugin-dev-expression',
      opts.minifyBuiltins && 'babel-plugin-minify-builtins',
      'babel-plugin-minify-constant-folding',
      'babel-plugin-transform-node-env-inline',
      'babel-plugin-transform-inline-environment-variables',

      'babel-plugin-transform-regexp-constructors',
      ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
      'babel-plugin-transform-remove-undefined',
      'babel-plugin-transform-undefined-to-void',
      opts.development !== true && 'babel-plugin-unassert',

      // ! enable when fix https://github.com/babel/minify/issues/973
      // ! use `terser` instead! through rollup for example.
      // When unused variable, it doesn't removes the value of the var
      // 'babel-plugin-minify-dead-code-elimination',

      react && 'babel-plugin-transform-react-constant-elements',
      react && 'babel-plugin-transform-react-pure-class-to-function',
      opts.development !== true &&
        react && [
          'babel-plugin-transform-react-remove-prop-types',
          { removeImport: true },
        ],
    ].filter(Boolean),
  };
};
