const options = {
  modules: 'commonjs',
  react: true,
  typescript: true,
  node: '8',
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
        presets: [['@tunnckocore/babel-preset', options]],
        comments: false,
      },
      outDir: 'dist/main',
    },
    {
      config: {
        presets: [
          ['@tunnckocore/babel-preset', { ...options, modules: false }],
        ],
        comments: false,
      },
      outDir: 'dist/module',
    },
  ],
};
