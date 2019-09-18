const utils = require('./@tunnckocore/utils/src');

const { alias, exts } = utils.createAliases();

module.exports = {
  displayName: 'lint',
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/packages/*/src/**/*',
    '<rootDir>/@tunnckocore/*/src/**/*',
  ],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /.+\/fixtures?\/.+/.toString(),
    /.+\/__fixtures?__\/.+/.toString(),
    /.+\/support\/.+/.toString(),
    /.+\/__support__\/.+/.toString(),
  ],
  moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: './@tunnckocore/jest-runner-eslint/dist/main/index.js',
};
