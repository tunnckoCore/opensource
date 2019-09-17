module.exports = {
  eslint: {
    // useEslintrc: false,
    // baseConfig: {
    //   extends: '@tunnckocore',
    // },
  },
  babel: {
    presets: [
      [
        '@tunnckocore/babel-preset',
        {
          modules: 'commonjs',
          react: true,
          typescript: true,
          node: '10.13',
        },
      ],
    ],
    comments: false,
  },
  monorepo: true,
};
