// SPDX-License-Identifier: Apache-2.0

/* eslint-disable unicorn/prefer-module */

const prettierDefaults = require('./defaults.js');

module.exports = {
  ...prettierDefaults,
  overrides: [
    {
      files: ['**/.all-contributorsrc'],
      options: {
        parser: 'json',
      },
    },
    {
      files: ['**/*.json'],
      options: {
        parser: 'json-stringify',
      },
    },
    {
      files: ['**/package.json'],
      options: {
        parser: 'json-stringify',
        plugins: ['prettier-plugin-pkgjson'],
      },
    },
    {
      files: ['**/*.md'],
      options: {
        parser: 'markdown',
        proseWrap: 'always',
      },
    },
    {
      files: ['**/*.mdx'],
      options: {
        parser: 'mdx',
        proseWrap: 'always',
      },
    },
  ],
};
