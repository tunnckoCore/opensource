module.exports =
  process.env.NODE_ENV === 'test'
    ? {
        presets: [
          [
            '@babel/preset-env',
            {
              modules: 'commonjs',
              targets: {
                node: 'current',
              },
            },
          ],
        ],
      }
    : {};
