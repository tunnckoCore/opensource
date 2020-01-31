'use strict';

module.exports = {
  overrides: [
    {
      files: ['**/*.*js', '**/*.jsx', '**/*.ts*'],
      extends: ['airbnb', 'airbnb/hooks'],
      rules: {
        'react/jsx-filename-extension': [
          'error',
          {
            extensions: ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.jsx', '.mdx'],
          },
        ],
        strict: 'off',
      },
    },
  ],
};
