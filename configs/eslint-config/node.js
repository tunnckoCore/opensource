'use strict';

// These are the same as in XO CLI, but they are not in the eslint-config-xo.
// They are also Airbnb and mine preferences.
module.exports = {
  plugins: ['node'],
  rules: {
    'node/no-deprecated-api': 'error',
    'node/no-exports-assign': 'error',
    'node/no-unpublished-bin': 'error',

    // Redundant with import/no-extraneous-dependencies
    // 'node/no-extraneous-import': 'error',
    // 'node/no-extraneous-require': 'error',

    // Redundant with import/no-unresolved
    // 'node/no-missing-import': 'error',
    // 'node/no-missing-require': 'error',

    'node/no-unsupported-features/es-builtins': 'error',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-unsupported-features/node-builtins': 'error',
    'no-process-exit': 'off',
    'node/process-exit-as-throw': 'error',
    'node/shebang': 'error',

    'node/exports-style': 'off',
    'node/file-extension-in-import': [
      'error',
      'never',
      {
        '.css': 'always',
        '.scss': 'always',
        '.sass': 'always',
        '.less': 'always',
        '.json': 'always',
      },
    ],
    'node/prefer-global/buffer': 'error',
    'node/prefer-global/console': 'error',
    'node/prefer-global/process': 'error',

    // These below will be enabled in XO when it targets Node.js 10
    'node/prefer-global/text-decoder': 'error',
    'node/prefer-global/text-encoder': 'error',
    'node/prefer-global/url-search-params': 'error',
    'node/prefer-global/url': 'error',
    'node/prefer-promises/dns': 'error',
    'node/prefer-promises/fs': 'error',
  },
};
