const toTestResult = require('./toTestResult');

const fail = ({ start, end, test, errorMessage }) =>
  toTestResult({
    errorMessage: errorMessage || test.errorMessage,
    stats: {
      failures: 1,
      pending: 0,
      passes: 0,
      start,
      end,
    },
    tests: [Object.assign({ duration: end - start }, test)],
    jestTestPath: test.path,
  });

module.exports = fail;
