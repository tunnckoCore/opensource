"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _throat = _interopRequireDefault(require("throat"));

var _jestWorker = _interopRequireDefault(require("jest-worker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CancelRunError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancelRunError';
  }

}

const createRunner = (runPath, {
  getExtraOptions
} = {}) => {
  class BaseTestRunner {
    constructor(globalConfig) {
      this._globalConfig = globalConfig;
    }

    runTests(tests, watcher, onStart, onResult, onFailure, options) {
      return options.serial ? this._createInBandTestRun(tests, watcher, onStart, onResult, onFailure, options) : this._createParallelTestRun(tests, watcher, onStart, onResult, onFailure, options);
    }

    _createInBandTestRun(tests, watcher, onStart, onResult, onFailure, options) {
      const mutex = (0, _throat.default)(1);
      return tests.reduce((promise, test) => mutex(() => promise.then(() => {
        if (watcher.isInterrupted()) {
          throw new CancelRunError();
        }

        return onStart(test).then(() => {
          const runner = require(runPath);

          const baseOptions = {
            config: test.context.config,
            globalConfig: this._globalConfig,
            testPath: test.path,
            rawModuleMap: watcher.isWatchMode() ? test.context.moduleMap.getRawModuleMap() : null,
            options,
            extraOptions: getExtraOptions ? getExtraOptions() : {}
          };

          if (typeof runner.default === 'function') {
            return runner.default(baseOptions);
          }

          return runner(baseOptions);
        });
      }).then(result => onResult(test, result)).catch(err => onFailure(test, err))), Promise.resolve());
    }

    _createParallelTestRun(tests, watcher, onStart, onResult, onFailure, options) {
      const worker = new _jestWorker.default(runPath, {
        exposedMethods: ['default'],
        numWorkers: this._globalConfig.maxWorkers,
        forkOptions: {
          stdio: 'inherit'
        }
      });
      const mutex = (0, _throat.default)(this._globalConfig.maxWorkers);

      const runTestInWorker = test => mutex(() => {
        if (watcher.isInterrupted()) {
          throw new CancelRunError();
        }

        return onStart(test).then(() => {
          const baseOptions = {
            config: test.context.config,
            globalConfig: this._globalConfig,
            testPath: test.path,
            rawModuleMap: watcher.isWatchMode() ? test.context.moduleMap.getRawModuleMap() : null,
            options,
            extraOptions: getExtraOptions ? getExtraOptions() : {}
          };
          return worker.default(baseOptions);
        });
      });

      const onError = (err, test) => onFailure(test, err).then(() => {
        if (err.type === 'ProcessTerminatedError') {
          console.error('A worker process has quit unexpectedly! ' + 'Most likely this is an initialization error.');
          process.exit(1);
        }
      });

      const onInterrupt = new Promise((resolve, reject) => {
        watcher.on('change', state => {
          if (state.interrupted) {
            reject(new CancelRunError());
          }
        });
      });
      const runAllTests = Promise.all(tests.map(test => runTestInWorker(test).then(testResult => {
        if (Array.isArray(testResult)) {
          testResult.forEach(result => result.errorMessage && result.stats.failures > 0 ? onError(new Error(result.errorMessage), test) : onResult(test, result));
          return;
        }

        onResult(test, testResult);
      }).catch(err => onError(err, test))));

      const cleanup = () => worker.end();

      return Promise.race([runAllTests, onInterrupt]).then(cleanup, cleanup);
    }

  }

  return BaseTestRunner;
};

var _default = createRunner;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;