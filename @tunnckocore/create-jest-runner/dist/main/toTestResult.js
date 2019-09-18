"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const toTestResult = ({
  stats,
  skipped,
  errorMessage,
  tests,
  jestTestPath
}) => ({
  console: null,
  failureMessage: errorMessage,
  numFailingTests: stats.failures,
  numPassingTests: stats.passes,
  numPendingTests: stats.pending,
  numTodoTests: stats.todo,
  perfStats: {
    end: new Date(stats.end).getTime(),
    start: new Date(stats.start).getTime()
  },
  skipped,
  snapshot: {
    added: 0,
    fileDeleted: false,
    matched: 0,
    unchecked: 0,
    unmatched: 0,
    updated: 0
  },
  sourceMaps: {},
  testExecError: null,
  testFilePath: jestTestPath,
  testResults: tests.map(test => ({
    ancestorTitles: [],
    duration: test.duration,
    failureMessages: [test.errorMessage],
    fullName: test.testPath,
    numPassingAsserts: test.errorMessage ? 1 : 0,
    status: test.errorMessage ? 'failed' : 'passed',
    title: test.title || ''
  }))
});

var _default = toTestResult;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;