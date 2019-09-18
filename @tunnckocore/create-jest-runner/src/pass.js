import toTestResult from './toTestResult';

const pass = ({ start, end, test }) =>
  toTestResult({
    stats: {
      failures: 0,
      pending: 0,
      passes: 1,
      todo: 0,
      start,
      end,
    },
    tests: [{ duration: end - start, ...test }],
    jestTestPath: test.path,
  });

export default pass;
