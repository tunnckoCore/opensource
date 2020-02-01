'use strict';

const path = require('path');

module.exports = {
  extends: [
    path.resolve(__dirname, '..', '..', '.eslintrc.js'),
    '@tunnckocore/eslint-config/typescript',
  ],
};
