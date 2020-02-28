'use strict';

module.exports = (api, options) => {
  api.assertVersion(7);

  return {
    presets: ['babel-preset-optimise', { ...options }],
  };
};
