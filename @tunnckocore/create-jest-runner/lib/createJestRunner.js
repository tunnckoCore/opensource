const throat = require('throat');
const Worker = require('jest-worker').default;

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

    // eslint-disable-next-line
    runTests(tests, watcher, onStart, onResult, onFailure, options) {
      const worker = new Worker(runPath, {
        exposedMethods: ['default'],
        numWorkers: this._globalConfig.maxWorkers,
        forkOptions: { stdio: 'inherit' },
      });

      const mutex = throat(this._globalConfig.maxWorkers);

      const runTestInWorker = test =>
        mutex(async () => {
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

module.exports = createRunner;
