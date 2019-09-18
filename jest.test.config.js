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

    // ! todo remove when fixed
    /koa-better-body/.toString(),
  ],
  // runner: './@tunnckocore/jest-runner-babel/src/index.js',
};
