'use strict';

module.exports = {
  overrides: [
    {
      files: ['*.mdx'],
      extends: ['plugin:mdx/overrides'],
      rules: {
        'mdx/no-jsx-html-comments': 'error',
        'mdx/no-unescaped-entities': 'warn',
        'mdx/no-unused-expressions': 'error',
        'mdx/remark': 'off',
        'no-unused-expressions': 'off',
        'react/no-unescaped-entities': 'off',
      },
    },
  ],
};
