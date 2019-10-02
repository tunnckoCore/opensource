const utils = require('./@tunnckocore/utils/src');

const { alias } = utils.createAliases(__dirname, 'src');

module.exports = {
  displayName: 'test',
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/packages/*/test/**/*',
    '<rootDir>/@tunnckocore/*/test/**/*',
  ],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /(?:__)?(?:fixtures?|supports?|shared)(?:__)?/.toString(),

    // ! todo remove when fixed
    /koa-better-body/.toString(),
    /jest-runner-rollup/.toString(),
  ],
  moduleNameMapper: alias,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // runner: './@tunnckocore/jest-runner-babel/src/index.js',
};
