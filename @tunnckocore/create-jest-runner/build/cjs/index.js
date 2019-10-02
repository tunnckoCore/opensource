'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var throat = _interopDefault(require('throat'));
var Worker = _interopDefault(require('jest-worker'));

/* eslint-disable promise/prefer-await-to-callbacks */

class CancelRunError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRunError';
  }
}

const createRunner = (runPath, { getExtraOptions } = {}) => {
  class BaseTestRunner {
    constructor(globalConfig) {
      this._globalConfig = globalConfig;
    }

    runTests(tests, watcher, onStart, onResult, onFailure, options) {
      return options.serial
        ? this._createInBandTestRun(
            tests,
            watcher,
            onStart,
            onResult,
            onFailure,
            options,
          )
        : this._createParallelTestRun(
            tests,
            watcher,
            onStart,
            onResult,
            onFailure,
            options,
          );
    }

    _createInBandTestRun(
      tests,
      watcher,
      onStart,
      onResult,
      onFailure,
      options,
    ) {
      const mutex = throat(1);
      return tests.reduce(
        (promise, test) =>
          mutex(() =>
            promise
              .then(() => {
                if (watcher.isInterrupted()) {
                  throw new CancelRunError();
                }

                return onStart(test).then(() => {
                  // eslint-disable-next-line import/no-dynamic-require, global-require
                  const runner = require(runPath);
                  const baseOptions = {
                    config: test.context.config,
                    globalConfig: this._globalConfig,
                    testPath: test.path,
                    rawModuleMap: watcher.isWatchMode()
                      ? test.context.moduleMap.getRawModuleMap()
                      : null,
                    options,
                    extraOptions: getExtraOptions ? getExtraOptions() : {},
                  };

                  if (typeof runner.default === 'function') {
                    return runner.default(baseOptions);
                  }

                  return runner(baseOptions);
                });
              })
              .then((result) => onResult(test, result))
              .catch((err) => onFailure(test, err)),
          ),
        Promise.resolve(),
      );
    }

    _createParallelTestRun(
      tests,
      watcher,
      onStart,
      onResult,
      onFailure,
      options,
    ) {
      const worker = new Worker(runPath, {
        exposedMethods: ['default'],
        numWorkers: this._globalConfig.maxWorkers,
        forkOptions: { stdio: 'inherit' },
      });

      const mutex = throat(this._globalConfig.maxWorkers);

      const runTestInWorker = (test) =>
        mutex(() => {
          if (watcher.isInterrupted()) {
            throw new CancelRunError();
          }

          return onStart(test).then(() => {
            const baseOptions = {
              config: test.context.config,
              globalConfig: this._globalConfig,
              testPath: test.path,
              rawModuleMap: watcher.isWatchMode()
                ? test.context.moduleMap.getRawModuleMap()
                : null,
              options,
              extraOptions: getExtraOptions ? getExtraOptions() : {},
            };

            return worker.default(baseOptions);
          });
        });

      const onError = (err, test) =>
        onFailure(test, err).then(() => {
          if (err.type === 'ProcessTerminatedError') {
            // eslint-disable-next-line no-console
            console.error(
              'A worker process has quit unexpectedly! ' +
                'Most likely this is an initialization error.',
            );
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit(1);
          }
        });

      const onInterrupt = new Promise((resolve, reject) => {
        watcher.on('change', (state) => {
          if (state.interrupted) {
            reject(new CancelRunError());
          }
        });
      });

      const runAllTests = Promise.all(
        tests.map((test) =>
          runTestInWorker(test)
            .then((testResult) => {
              if (Array.isArray(testResult)) {
                testResult.forEach((result) =>
                  result.errorMessage && result.stats.failures > 0
                    ? onError(new Error(result.errorMessage), test)
                    : onResult(test, result),
                );
                return;
              }
              onResult(test, testResult);
            })
            .catch((err) => onError(err, test)),
        ),
      );

      const cleanup = () => worker.end();

      return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
    }
  }

  return BaseTestRunner;
};

const toTestResult = ({
  stats,
  skipped,
  errorMessage,
  tests,
  jestTestPath,
}) => ({
  console: null,
  failureMessage: errorMessage,
  numFailingTests: stats.failures,
  numPassingTests: stats.passes,
  numPendingTests: stats.pending,
  numTodoTests: stats.todo,
  perfStats: {
    end: new Date(stats.end).getTime(),
    start: new Date(stats.start).getTime(),
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
  testResults: tests.map((test) => ({
    ancestorTitles: [],
    duration: test.duration,
    failureMessages: [test.errorMessage],
    fullName: test.testPath,
    numPassingAsserts: test.errorMessage ? 1 : 0,
    status: test.errorMessage ? 'failed' : 'passed',
    title: test.title || '',
  })),
});

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

const skip = ({ start, end, test }) =>
  toTestResult({
    stats: {
      failures: 0,
      pending: 1,
      passes: 0,
      todo: 0,
      start,
      end,
    },
    skipped: true,
    tests: [{ duration: end - start, ...test }],
    jestTestPath: test.path,
  });

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

exports.createJestRunner = createRunner;
exports.fail = fail;
exports.pass = pass;
exports.skip = skip;
exports.todo = todo;
