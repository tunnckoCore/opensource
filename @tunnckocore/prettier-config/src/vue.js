const baseConfig = require('.');

module.exports = {
  ...baseConfig,
  overrides: baseConfig.overrides.concat([
    {
      files: '*.html',
      options: {
        parser: 'vue',
      },
    },
  ]),
};
