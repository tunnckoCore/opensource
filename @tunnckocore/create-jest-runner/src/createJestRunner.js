/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable max-params */
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
const throat = require('throat');
const JestWorker = require('jest-worker').default;

class CancelRunError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRunError';
  }
}

module.exports = function createRunner(runPath, { getExtraOptions } = {}) {
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
              .then((testResult) => {
                if (Array.isArray(testResult)) {
                  return testResult.map((result) =>
                    result.numFailingTests > 0
                      ? onFailure(test, new Error(result.failureMessage))
                      : onResult(test, result),
                  );
                }

                return onResult(test, testResult);
              })
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
      const worker = new JestWorker(runPath, {
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

      const onError = (test, err) =>
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
                  result.numFailingTests > 0
                    ? onError(test, new Error(result.failureMessage))
                    : onResult(test, result),
                );
                return;
              }

              onResult(test, testResult);
            })
            .catch((err) => {
              onError(err, test);
            }),
        ),
      );

      const cleanup = () => worker.end();

      return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
    }
  }

  return BaseTestRunner;
};
