const toTestResult = require('./toTestResult');

module.exports = function todo({ start, end, test }) {
  return toTestResult({
    stats: {
      failures: 0,
      pending: 0,
      passes: 0,
      todo: 1,
      start,
      end,
    },
    tests: [{ duration: end - start, ...test }],
    jestTestPath: test.path,
  });
};
