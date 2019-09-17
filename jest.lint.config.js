module.exports = {
  displayName: 'lint',
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/packages/*/src/**/*',
    '<rootDir>/@tunnckocore/*/src/**/*',
  ],
  testPathIgnorePatterns: [
    /node_modules/.toString(),
    /.+\/fixtures\/.+/.toString(),
  ],
  runner: './@tunnckocore/jest-runner-eslint/src/index.js',
};
