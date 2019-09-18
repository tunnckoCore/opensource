import toTestResult from './toTestResult';

const todo = ({ start, end, test }) =>
  toTestResult({
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

export default todo;
