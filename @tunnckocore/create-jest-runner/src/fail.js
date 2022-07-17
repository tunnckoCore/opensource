const toTestResult = require('./toTestResult');

module.exports = function fail({ start, end, test, errorMessage }) {
  return toTestResult({
    errorMessage: errorMessage || test.errorMessage,
    stats: {
      failures: 1,
      pending: 0,
      passes: 0,
      todo: 0,
      start,
      end,
    },
    tests: [{ duration: end - start, ...test }],
    jestTestPath: test.path,
  });
};
