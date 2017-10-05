require('babel-polyfill');
const throat = require('throat');
const pify = require('pify');
const workerFarm = require('worker-farm');
const path = require('path');

const runPath = path.resolve(__dirname, 'run.js');

class CancelRun extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRun';
  }
}

const createRunner = (fn, { extraOptions } = {}) => {
  class BaseTestRunner {
    constructor(globalConfig) {
      this._globalConfig = globalConfig;
    }

    // eslint-disable-next-line
    async runTests(tests, watcher, onStart, onResult, onFailure, options) {
      const farm = workerFarm(
        {
          autoStart: true,
          maxConcurrentCallsPerWorker: 1,
          maxConcurrentWorkers: this._globalConfig.maxWorkers,
          maxRetries: 2, // Allow for a couple of transient errors.
        },
        runPath,
      );

      const mutex = throat(this._globalConfig.maxWorkers);
      const worker = pify(farm);

      const runTestInWorker = test =>
        mutex(async () => {
          if (watcher.isInterrupted()) {
            throw new CancelRun();
          }
          await onStart(test);
          const baseOptions = {
            config: test.context.config,
            globalConfig: this._globalConfig,
            testPath: test.path,
            rawModuleMap: watcher.isWatchMode()
              ? test.context.moduleMap.getRawModuleMap()
              : null,
            options,
          };

          if (extraOptions) {
            return Object.assign(
              {},
              baseOptions,
              extraOptions(baseOptions, tests),
            );
          }

          return worker(baseOptions);
        });

      const onError = async (err, test) => {
        await onFailure(test, err);
        if (err.type === 'ProcessTerminatedError') {
          // eslint-disable-next-line no-console
          console.error(
            'A worker process has quit unexpectedly! ' +
              'Most likely this is an initialization error.',
          );
          process.exit(1);
        }
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

      const cleanup = () => workerFarm.end(farm);

      return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
    }
  }

  return BaseTestRunner;
};

module.exports = createRunner;
