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
        presets: [
          [
            '@tunnckocore/babel-preset',
            {
              modules: 'commonjs',
              react: true,
              typescript: true,
              node: '8',
            },
          ],
        ],
        comments: false,
      },
      outDir: 'dist/main',
    },
    {
      config: {
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
      },
      outDir: 'dist/module',
    },
  ],
};
