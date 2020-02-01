'use strict';

module.exports = {
  plugins: ['unicorn'],
  extends: ['plugin:unicorn/recommended'],
  rules: {
    // It is too much annoyance for me. It's a good thing, but generally
    // after so many years we already name things properly,
    // so please don't mess with me and don't correct me.
    'unicorn/prevent-abbreviations': 'off',

    // These below are intentional & explicit overrides of XO and Unicorn

    // ! needed for `unicorn/no-unreadable-array-destructuring`
    'prefer-destructuring': ['error', { object: true, array: false }],
    'unicorn/no-unreadable-array-destructuring': 'error', // default in recommended

    'unicorn/no-unused-properties': 'error',
    // Disallow unsafe regular expressions.
    // Don't allow potential catastrophic crashes, slow behaving and downtimes.
    // You still can disable that and do whatever you want,
    // but that will be explicit and visible.
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-unsafe-regex.md
    'unicorn/no-unsafe-regex': 'error',

    // Enforce importing index files with `.` instead of `./index`. (fixable)
    // But we should be explicit. We know it is working without that,
    // but at least it is good for newcomers.
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/import-index.md
    'unicorn/import-index': 'off',

    // Enforce proper Error subclassing. (fixable)
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/custom-error-definition.md
    'unicorn/custom-error-definition': 'error',

    // Pretty useful rule, but it depends.
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/filename-case.md
    'unicorn/filename-case': 'off',

    // It is pretty common to name it `err`, and there is almost no reason to be any other.
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/catch-error-name.md
    'unicorn/catch-error-name': ['error', { name: 'err' }],

    // Doesn't work well in node-land. We have `.on/.off` emitters in Nodejs.
    'unicorn/prefer-add-event-listener': 'off',
    'unicorn/no-process-exit': 'error',
  },
};
