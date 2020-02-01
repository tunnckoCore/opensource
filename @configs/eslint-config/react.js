'use strict';

module.exports = {
  overrides: [
    {
      files: ['**/*.*js', '**/*.jsx', '**/*.mdx', '**/*.ts', '**/*.tsx'],
      extends: ['airbnb', 'airbnb/hooks'],
      rules: {
        'react/jsx-filename-extension': [
          'error',
          {
            extensions: ['.js', '.mjs', '.cjs', '.jsx', '.mdx', '.ts', '.tsx'],
          },
        ],
        strict: 'off',
      },
    },
  ],
};
