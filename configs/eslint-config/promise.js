'use strict';

module.exports = {
  plugins: ['promise'],
  extends: ['plugin:promise/recommended'],
  rules: {
    // These below are to ensure not changes
    // inside upstream XO and the plugin:promise/recommended configs
    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',
    'promise/no-native': 'off',
    'promise/no-nesting': 'off',
    'promise/no-promise-in-callback': 'off',
    'promise/no-callback-in-promise': 'off',
    'promise/avoid-new': 'off',
    'promise/prefer-await-to-then': 'error',
    'promise/prefer-await-to-callbacks': 'error',

    // These are the same as in XO CLI, but they are not in the eslint-config-xo
    'promise/no-return-wrap': ['error', { allowReject: true }],
    'promise/param-names': 'error',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'error',
    'promise/valid-params': 'error',
  },
};
