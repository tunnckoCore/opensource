const utils = require('./@tunnckocore/utils/src');

const { alias, exts } = utils.createAliases(__dirname, 'src');

module.exports = {
  displayName: 'lint',
  rootDir: __dirname,
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
