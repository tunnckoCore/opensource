const options = {
  modules: 'commonjs',
  react: true,
  typescript: true,
  node: '8.11',
};

const addModuleExports = [
  'babel-plugin-add-module-exports',
  { addDefaultProperty: true },
];

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
        presets: [['@tunnckocore/babel-preset', options]],
        plugins: [addModuleExports],
        comments: false,
      },
      outDir: 'dist/main',
    },
    {
      config: {
        presets: [
          ['@tunnckocore/babel-preset', { ...options, modules: false }],
        ],
        plugins: [addModuleExports],
        comments: false,
      },
      outDir: 'dist/module',
    },
  ],
};

// 1. hash of full versions of all packages
// 2. hash of major versions of all packages
// 3. hash of date timestamp (e.g. Date.now())
// 4. hash of 1, 2 and 3
