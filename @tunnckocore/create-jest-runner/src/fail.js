import toTestResult from './toTestResult';

const fail = ({ start, end, test, errorMessage }) =>
  toTestResult({
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

export default fail;
