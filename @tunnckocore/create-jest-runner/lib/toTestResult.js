const toTestResult = ({
  stats,
  skipped,
  errorMessage,
  tests,
  jestTestPath,
}) => {
  return {
    console: null,
    failureMessage: errorMessage,
    numFailingTests: stats.failures,
    numPassingTests: stats.passes,
    numPendingTests: stats.pending,
    perfStats: {
      end: +new Date(stats.end),
      start: +new Date(stats.start),
    },
    skipped,
    snapshot: {
      added: 0,
      fileDeleted: false,
      matched: 0,
      unchecked: 0,
      unmatched: 0,
      updated: 0,
    },
    sourceMaps: {},
    testExecError: null,
    testFilePath: jestTestPath,
    testResults: tests.map(test => {
      return {
        ancestorTitles: [],
        duration: test.duration,
        failureMessages: [test.errorMessage],
        fullName: test.testPath,
        numPassingAsserts: test.errorMessage ? 1 : 0,
        status: test.errorMessage ? 'failed' : 'passed',
        title: test.title || '',
      };
    }),
  };
};

export default toTestResult;
