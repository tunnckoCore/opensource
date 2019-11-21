'use strict';

const baseConfig = require('./index.js');

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
