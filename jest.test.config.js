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
    /__(?:fixtures?|supports?|shared)__/.toString(),
    /(?:fixtures?|supports?|shared)/.toString(),
    /__shared__/.toString(),

    // ! todo remove when fixed
    /koa-better-body/.toString(),
  ],
  moduleNameMapper: alias,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // runner: './@tunnckocore/jest-runner-babel/src/index.js',
};
