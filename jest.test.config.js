const utils = require('./@tunnckocore/utils/src');

const { alias, exts } = utils.createAliases();

module.exports = {
  displayName: 'test',
  rootDir: __dirname,
  // testMatch: [
  //   // '<rootDir>/packages/*/src/**/*',
  //   // '<rootDir>/@tunnckocore/*/**/integrationTests/**/*.js',
  // ],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /.+\/fixtures?\/.+/.toString(),
    /.+\/__fixtures?__\/.+/.toString(),
    /.+\/support\/.+/.toString(),
    /.+\/__support__\/.+/.toString(),
    /.+\/__shared__\/.+/.toString(),

    // ! todo remove when fixed
    // /koa-better-body/.toString(),
  ],
  moduleNameMapper: alias,
  moduleFileExtensions: exts,
  // runner: './@tunnckocore/jest-runner-babel/src/index.js',
};
