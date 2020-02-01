'use strict';

module.exports = {
  overrides: [
    {
      files: ['**/*test*/**', '**/*.{test,spec}.{js,jsx,ts,tsx,mjs,cjs}'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
  ],
};
