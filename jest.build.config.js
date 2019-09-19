const utils = require('./@tunnckocore/utils/src');

const { exts } = utils.getWorkspacesAndExtensions(__dirname);

module.exports = {
  displayName: 'build',
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
    /.+\/__shared__\/.+/.toString(),
    /.+\/@tunnckocore\/utils\/.+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: '@tunnckocore/jest-runner-babel',
};
