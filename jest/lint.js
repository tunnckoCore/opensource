const path = require('path');
const utils = require('../@tunnckocore/utils/src');

const ROOT = path.dirname(__dirname);
const { alias, exts } = utils.createAliases(ROOT, 'src');

module.exports = {
  rootDir: ROOT,
  displayName: 'lint',
  testMatch: [
    '<rootDir>/packages/*/src/**/*',
    '<rootDir>/@tunnckocore/*/src/**/*',
  ],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
  ],
  moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: '@tunnckocore/jest-runner-eslint',
};
