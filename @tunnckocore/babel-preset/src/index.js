/* eslint max-statements: ["error", 24] */
/* eslint-disable global-require */
const helpers = require('@babel/helper-plugin-utils');

// 1. For nodejs projects, pass `node` option to desired nodejs version
// 2. If you want old browsers, put browserslist config in your project,
//    so Babel automatically will pick it up
// 3. If you want modern browsers (esmodules compatible), pass `browsers: true`

module.exports = helpers.declare((api, options) => {
  api.assertVersion(7);

  const opts = {
    modules: 'commonjs',
    include: [],
    exclude: [
      '@babel/plugin-transform-regenerator',
      '@babel/plugin-transform-async-to-generator',
    ],
    ...options,
  };

  const { modules, include, exclude } = opts;

  let environmentOptions = { modules, include, exclude };

  if (opts.browsers === true) {
    environmentOptions = {
      ...environmentOptions,
      targets: { esmodules: true },
    };
  }
  if (
    (typeof opts.browsers === 'string' || Array.isArray(opts.browsers)) &&
    opts.browsers.length > 0
  ) {
    environmentOptions = {
      ...environmentOptions,
      targets: { browsers: opts.browsers },
    };
  }
  if (typeof opts.node === 'string' && opts.node.length > 0) {
    environmentOptions = {
      ...environmentOptions,
      targets: { node: opts.node },
    };
  }

  const plugins = [
    '@babel/plugin-syntax-import-meta',
    ['babel-plugin-add-module-exports', { addDefaultProperty: true }],
  ];
  const presets = [[require('@babel/preset-env'), environmentOptions]];

  if (opts.typescript) {
    presets.push(require('@babel/preset-typescript'));
  }

  const reactPreset = [
    require('@babel/preset-react'),
    {
      development: api.env('development'),
    },
  ];
  const reactPlugin = api.env('production')
    ? [
        require('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true,
        },
      ]
    : undefined;

  if (opts.react) {
    presets.push(reactPreset);

    if (reactPlugin) {
      plugins.push(reactPlugin);
    }
  }

  return {
    plugins,
    presets,
    overrides: opts.isTSX
      ? undefined
      : [
          {
            test: /\.(js|md|ts)x$/,
            plugins: reactPlugin && [reactPlugin],
            presets: [reactPreset],
          },
        ],
  };
});
