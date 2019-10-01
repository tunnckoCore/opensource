const utils = require('./@tunnckocore/utils/src');

const { exts } = utils.getWorkspacesAndExtensions(__dirname);

module.exports = {
  displayName: 'bundle',
  rootDir: __dirname,
  testMatch: [
    // '<rootDir>/src/index.ts',
    // '<rootDir>/packages/*/src/**/*',
    `<rootDir>/@tunnckocore/execa/src/index.js`,
    // `<rootDir>/src/zzz*`,
  ],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),
    /.+\/@tunnckocore\/utils\/.+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: './packages/jest-runner-rollup/src/index.js',
};
