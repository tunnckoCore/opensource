'use strict';

const path = require('path');
const assert = require('assert');
const memoizeFS = require('memoize-fs');
const { cosmiconfig } = require('cosmiconfig');
const fail = require('./fail');

const jestRunnerConfig = cosmiconfig('jest-runner');

function wrapper(runnerName, runnerFn) {
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

  // eslint-disable-next-line no-param-reassign
  runnerName = String(runnerName);

  const memoizeCachePath = path.join('.cache', `${runnerName}-runner`);

  const memoizer = memoizeFS({ cachePath: memoizeCachePath });

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function memoize(func, opts) {
    return async (...args) => await func(...args);
    // if (process.env.JEST_RUNNER_RELOAD_CACHE) {
    //   await memoizer.invalidate();
    // }
    // const memoizedFunc = await memoizer.fn(func, {
    //   astBody: true,
    //   salt: runnerName,
    //   ...opts,
    // });
    // const res = await memoizedFunc(...args);
    // return res;
  }
  memoizer.memoize = memoize;

  return async ({ testPath, config, ...ctxRest }) => {
    const startTime = new Date();

    const loadConfig = tryLoadConfig({ testPath, startTime, runnerName });
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
      runnerName,
      runnerConfig,
      memoizeCachePath,
      memoizer,
    });

    return result;
  };
}
exports.wrapper = wrapper;

function tryLoadConfig(ctx) {
  return (_fp) =>
    tryCatch(async () => {
      const cfg = await jestRunnerConfig.search();

      if (!cfg || (cfg && !cfg.config)) {
        return {};
      }
      return cfg.config[ctx.runnerName];
    }, ctx);
}
exports.tryLoadConfig = tryLoadConfig;

async function tryCatch(fn, ctx) {
  try {
    // important to be `return await`!
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

      return createFailed({ ...ctx, err }, msg);
    }

    return createFailed({ ...ctx, err });
  }
}
exports.tryCatch = tryCatch;

function createFailed(ctx, message) {
  const { err, testPath, startTime, runnerName } = ctx;
  // const msg =
  //   runnerConfig && runnerConfig.verbose
  //     ? message || err.stack || err.message
  //     : message || 'Some unknown error!';

  return {
    hasError: true,
    error: fail({
      start: startTime,
      end: new Date(),
      test: {
        path: testPath,
        title: runnerName,
        errorMessage: `${runnerName} runZZZZZZZner: ${message || err.stack}`,
      },
    }),
  };
}
exports.createFailed = createFailed;
