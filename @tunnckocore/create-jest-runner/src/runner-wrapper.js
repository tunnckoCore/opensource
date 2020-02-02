'use strict';

const path = require('path');
const assert = require('assert');
const memoizeFS = require('@tunnckocore/memoize-fs');
const { cosmiconfig } = require('cosmiconfig');
const fail = require('./fail');

const jestRunnerConfig = cosmiconfig('jest-runner');

module.exports = async function runnerWrapper(runnerName, runnerFn) {
  assert.strictEqual(
    typeof runnerName,
    'string',
    'expect runnerName to be a string',
  );
  assert.strictEqual(
    typeof runnerFn,
    'string',
    'expect runnerFn to be a string',
  );

  const memoizeCachePath = path.join('.cache', `${runnerName}-runner`);

  const mem = memoizeFS({ cachePath: memoizeCachePath });

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function memoize(func, opts) {
    return async (...args) => {
      if (process.env.JEST_RUNNER_RELOAD_CACHE) {
        await mem.invalidate('load-runner-config');
      }
      const fn = await mem.fn(func, opts);
      const res = await fn(...args);
      return res;
    };
  }

  return async ({ testPath, config, ...ctxRest }) => {
    const start = new Date();

    const loadConfig = tryLoadConfig(testPath, start);
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
    });

    return result;
  };
};

function tryLoadConfig({ testPath, start, runnerName }) {
  return () =>
    tryCatch(
      async () => {
        const cfg = await jestRunnerConfig.search();

        if (!cfg || (cfg && !cfg.config)) {
          return {};
        }
        return cfg.config[runnerName];
      },
      { testPath, start, runnerName },
    );
}

async function tryCatch(fn, { testPath, start, runnerName, cfg }) {
  try {
    return await fn();
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

      return createFailed({ err, testPath, start, runnerName, cfg }, msg);
    }

    return createFailed({ err, testPath, start, runnerName, cfg });
  }
}

function createFailed({ err, testPath, start, runnerName, cfg }, message) {
  const msg =
    cfg && cfg.verbose
      ? message || err.stack || err.message
      : message || 'Some unknown error!';

  return {
    hasError: true,
    error: fail({
      start,
      end: new Date(),
      test: {
        path: testPath,
        title: runnerName,
        errorMessage: `${runnerName} runner: ${msg}`,
      },
    }),
  };
}
