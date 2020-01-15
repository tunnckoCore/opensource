'use strict';

const path = require('path');

module.exports = {
  rootDir: process.cwd(),
  displayName: 'node',
  testMatch: ['<rootDir>/**/*/foo.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/(?:__)?(?:fixtures?|supports?|shared)(?:__)?/',
  ],
  moduleFileExtensions: ['tsx', 'ts', 'jsx', 'js', 'mjs'],
  runner: path.join(__dirname, 'index.js'),
  moduleDirectories: ['node_modules', 'configs', 'packages', '@tunnckocore'],
  moduleNameMapper: {
    '@tunnckocore/babel-preset':
      '/home/charlike/github/tunnckoCore/opensource/configs/babel-preset/src',
    '@tunnckocore/browserslist-config':
      '/home/charlike/github/tunnckoCore/opensource/configs/browserslist-config',
    '@tunnckocore/eslint-config':
      '/home/charlike/github/tunnckoCore/opensource/configs/eslint-config',
    '@tunnckocore/prettier-config':
      '/home/charlike/github/tunnckoCore/opensource/configs/prettier-config',
    '@tunnckocore/renovate-config':
      '/home/charlike/github/tunnckoCore/opensource/configs/renovate-config',
    '@tunnckocore/typescript-config':
      '/home/charlike/github/tunnckoCore/opensource/configs/typescript-config',
    'all-module-paths':
      '/home/charlike/github/tunnckoCore/opensource/packages/all-module-paths/src',
    'arr-includes':
      '/home/charlike/github/tunnckoCore/opensource/packages/arr-includes/src',
    'gitclone-cli':
      '/home/charlike/github/tunnckoCore/opensource/packages/gitclone-cli/src',
    'gitclone-defaults':
      '/home/charlike/github/tunnckoCore/opensource/packages/gitclone-defaults/src',
    'jest-runner-docs':
      '/home/charlike/github/tunnckoCore/opensource/packages/jest-runner-docs/src',
    'jest-runner-node':
      '/home/charlike/github/tunnckoCore/opensource/packages/jest-runner-node/src',
    'jest-runner-rollup':
      '/home/charlike/github/tunnckoCore/opensource/packages/jest-runner-rollup/src',
    'koa-better-body':
      '/home/charlike/github/tunnckoCore/opensource/packages/koa-better-body/src',
    'parse-function':
      '/home/charlike/github/tunnckoCore/opensource/packages/parse-function/src',
    'stringify-github-short-url':
      '/home/charlike/github/tunnckoCore/opensource/packages/stringify-github-short-url/src',
    '@tunnckocore/create-jest-runner':
      '/home/charlike/github/tunnckoCore/opensource/@tunnckocore/create-jest-runner/src',
    '@tunnckocore/execa':
      '/home/charlike/github/tunnckoCore/opensource/@tunnckocore/execa/src',
    '@tunnckocore/jest-runner-babel':
      '/home/charlike/github/tunnckoCore/opensource/@tunnckocore/jest-runner-babel/src',
    '@tunnckocore/jest-runner-eslint':
      '/home/charlike/github/tunnckoCore/opensource/@tunnckocore/jest-runner-eslint/src',
    '@tunnckocore/pretty-config':
      '/home/charlike/github/tunnckoCore/opensource/@tunnckocore/pretty-config/src',
    '@tunnckocore/utils':
      '/home/charlike/github/tunnckoCore/opensource/@tunnckocore/utils/src',
  },
};
