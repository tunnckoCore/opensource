const utils = require('./@tunnckocore/utils/src');

const { exts } = utils.getWorkspacesAndExtensions(__dirname);

module.exports = {
  displayName: 'bundle',
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/packages/koa-better-body/src/index.js',
    '<rootDir>/@tunnckocore/execa/src/index.js',
  ],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /.+\/fixtures?\/.+/.toString(),
    /.+\/__fixtures?__\/.+/.toString(),
    /.+\/support\/.+/.toString(),
    /.+\/__support__\/.+/.toString(),
    /.+\/__shared__\/.+/.toString(),
    /.+\/@tunnckocore\/utils\/.+/.toString(),
    /.+\/packages\/jest-runner-rollup\/.+/.toString(),
  ],
  // moduleNameMapper: alias,
  moduleFileExtensions: exts,
  runner: './packages/jest-runner-rollup/dist/main/index.js',
};
