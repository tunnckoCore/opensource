'use strict';

const utils = require('@tunnckocore/utils');

const jest = {
  files: [
    '**/__tests__/**',
    '**/tests/**',
    '**/test/**',
    '**/*.{test,spec}.{js,jsx,ts,tsx,mdx}',
  ],
  extends: ['plugin:jest/recommended'],
};

const mdx = {
  // TODO @tunnckoCore [2020-12-12]: eslint errors with "uknown jsx node"
  files: ['**/*.mdx'],
  parser: 'eslint-mdx',
  plugins: ['mdx'],
  rules: {
    'mdx/no-jsx-html-comments': 'error',
    'mdx/no-unescaped-entities': 'warn',
    'mdx/no-unused-expressions': 'error',
    'mdx/remark': 'warn',
    'no-unused-expressions': 'off',
    'react/no-unescaped-entities': 'off',
  },
};

const project = utils.tsconfigResolver();

const ts = {
  files: ['**/*.{ts,tsx}', '**/*.d.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    jsx: true,
    project,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // TODO @tunnckoCore [2020-12-12]: Consider xo-typescript
    // 'xo-typescript',

    // TODO @tunnckoCore [2020-12-12]: Do we need Prettier here too? Check how overrides works!
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  rules: {
    // Enforce both my and Airbnb's preference used for years in gazillion ton of code
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        vars: 'all',
        varsIgnorePattern: '^(?:$$|xx|_|__|[iI]gnor(?:e|ing|ed))',
        args: 'after-used',
        argsIgnorePattern: '^(?:$$|xx|_|__|[iI]gnor(?:e|ing|ed))',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^(?:$$|xx|_|__|[iI]gnor(?:e|ing|ed))',
      },
    ],

    // Inferring is a good thing to some extent.
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        typedefs: true,
      },
    ],

    '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],

    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true, ignoreProperties: true },
    ],

    '@typescript-eslint/promise-function-async': [
      'error',
      {
        allowAny: true,
        checkArrowFunctions: true,
        checkFunctionDeclarations: true,
        checkFunctionExpressions: true,
        checkMethodDeclarations: true,
      },
    ],
    '@typescript-eslint/prefer-regexp-exec': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
  },
};

const dts = {
  files: ['**/*.d.ts'],
  rules: {
    'import/prefer-default-export': 'off',
  },
};

let hasTypeScript = false;

try {
  require.resolve('typescript');
  hasTypeScript = true;
} catch (err) {}

const react = {
  files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
  rules: {
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.ts', '.tsx', '.js', '.jsx', '.mdx'] },
    ],
  },
};

module.exports = {
  jest,
  mdx,
  ts,
  react,
  overrides: [
    jest,
    mdx,
    hasTypeScript && project && ts,
    hasTypeScript && project && dts,
  ].filter(Boolean),
};
