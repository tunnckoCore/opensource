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
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    /.+\/@tunnckocore\/utils\/.+/.toString(),
    /.+\/jest-runner-rollup\/.+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: '@tunnckocore/jest-runner-babel',
};
