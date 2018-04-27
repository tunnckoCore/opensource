import throat from 'throat';
import Worker from 'jest-worker';

class CancelRun extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRun';
  }
}

const createRunner = runPath => {
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
                  throw new CancelRun();
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
                  };

                  if (typeof runner.default === 'function') {
                    return runner.default(baseOptions);
                  }

                  return runner(baseOptions);
                });
              })
              .then(result => onResult(test, result))
              .catch(err => onFailure(test, err)),
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

      const runTestInWorker = test =>
        mutex(() => {
          if (watcher.isInterrupted()) {
            throw new CancelRun();
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
            };

            return worker.default(baseOptions);
          });
        });

      const onError = (err, test) => {
        return onFailure(test, err).then(() => {
          if (err.type === 'ProcessTerminatedError') {
            // eslint-disable-next-line no-console
            console.error(
              'A worker process has quit unexpectedly! ' +
                'Most likely this is an initialization error.',
            );
            process.exit(1);
          }
        });
      };

      const onInterrupt = new Promise((_, reject) => {
        watcher.on('change', state => {
          if (state.interrupted) {
            reject(new CancelRun());
          }
        });
      });

      const runAllTests = Promise.all(
        tests.map(test =>
          runTestInWorker(test)
            .then(testResult => onResult(test, testResult))
            .catch(error => onError(error, test)),
        ),
      );

      const cleanup = () => worker.end();

      return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
    }
  }

  return BaseTestRunner;
};

export default createRunner;
