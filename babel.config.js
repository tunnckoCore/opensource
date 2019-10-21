module.exports =
  process.env.NODE_ENV === 'test'
    ? {
        presets: [
          [
            '@tunnckocore/babel-preset',
            {
              modules: 'commonjs',
              react: true,
              typescript: true,
              node: '8.11',
            },
          ],
        ],
      }
    : {};
