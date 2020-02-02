'use strict';

const path = require('path');
const assert = require('assert');
const memoizeFS = require('@tunnckocore/memoize-fs');
const { cosmiconfig } = require('cosmiconfig');
const fail = require('./fail');

const jestRunnerConfig = cosmiconfig('jest-runner');

module.exports = function runnerWrapper(runnerName, runnerFn) {
  assert.strictEqual(
    typeof runnerName,
    'string',
    'expect runnerName to be a string',
  );
  assert.strictEqual(
    typeof runnerFn,
    'function',
    'expect runnerFn to be a function',
  );

  const memoizeCachePath = path.join('.cache', `${runnerName}-runner`);

  const memoizer = memoizeFS({ cachePath: memoizeCachePath });

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function memoize(func, opts) {
    return async (...args) => {
      if (process.env.JEST_RUNNER_RELOAD_CACHE) {
        await memoizer.invalidate();
      }
      const memoizedFunc = await memoizer.fn(func, {
        astBody: true,
        salt: runnerName,
        ...opts,
      });
      const res = await memoizedFunc(...args);
      return res;
    };
  }
  memoizer.memoize = memoize;

  return async ({ testPath, config, ...ctxRest }) => {
    const startTime = Date.now();

    const loadConfig = tryLoadConfig({ testPath, startTime });
    const cfgFunc = await memoize(loadConfig, {
      cacheId: 'load-runner-config',
      astBody: true,
      salt: runnerName,
    });
    const runnerConfig = (await cfgFunc()) || {};
    if (runnerConfig.hasError) return runnerConfig.error;

    const result = await runnerFn({
      ...ctxRest,
      testPath,
      config,
      runnerConfig,
      memoizeCachePath,
      memoizer,
    });

    return result;
  };
};

function tryLoadConfig({ testPath, startTime, runnerName }) {
  return () =>
    tryCatch(
      async () => {
        const cfg = await jestRunnerConfig.search();

        if (!cfg || (cfg && !cfg.config)) {
          return {};
        }
        return cfg.config[runnerName];
      },
      { testPath, startTime, runnerName },
    );
}

async function tryCatch(fnc, { testPath, startTime, runnerName, cfg }) {
  try {
    return await fnc();
  } catch (err) {
    if (err.command === 'verb') {
      const errMsg = err.all
        .split('\n')
        .filter((line) => !/\[.+].+/.test(line))
        .join('\n');
      const msg = errMsg.replace(
        /(.*)Error:\s+(.+)/,
        '$1Error: Failure in `verb`, $2',
      );

      return createFailed({ err, testPath, startTime, runnerName, cfg }, msg);
    }

    return createFailed({ err, testPath, startTime, runnerName, cfg });
  }
}

function createFailed({ err, testPath, startTime, runnerName, cfg }, message) {
  const msg =
    cfg && cfg.verbose
      ? message || err.stack || err.message
      : message || 'Some unknown error!';

  return {
    hasError: true,
    error: fail({
      start: startTime,
      end: Date.now(),
      test: {
        path: testPath,
        title: runnerName,
        errorMessage: `${runnerName} runner: ${msg}`,
      },
    }),
  };
}
