const toTestResult = require('./toTestResult');

const pass = ({ start, end, test }) =>
  toTestResult({
    stats: {
      failures: 0,
      pending: 0,
      passes: 1,
      start,
      end,
    },
    tests: [Object.assign({ duration: end - start }, test)],
    jestTestPath: test.path,
  });

module.exports = pass;
