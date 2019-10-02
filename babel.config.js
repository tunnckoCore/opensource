const path = require('path');

module.exports =
  process.env.NODE_ENV === 'test'
    ? {
        presets: [
          [
            path.join(
              __dirname,
              '@tunnckocore',
              'babel-preset',
              'src',
              'index.js',
            ),
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
