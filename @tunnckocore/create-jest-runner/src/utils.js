'use strict';

const path = require('path');
const assert = require('assert');
const memoizeFS = require('memoize-fs');
const { cosmiconfig } = require('cosmiconfig');

const serialize = require('serialize-javascript');
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

  const memoizer = memoizeFS({
    cachePath: memoizeCachePath,
    serialize,
    // eslint-disable-next-line no-eval
    deserialize: (serializedJavascript) => eval(`(${serializedJavascript})`),
    throwError: false,
  });

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
    const start = Date.now();

    const loadConfig = tryLoadConfig({
      ...ctxRest,
      testPath,
      config,
      start,
      runnerName,
    });
    const cfgFunc = await memoize(loadConfig, {
      cacheId: 'load-runner-config',
      astBody: true,
      salt: runnerName,
    });
    const runnerConfig = (await cfgFunc()) || {};
    if (runnerConfig && runnerConfig.hasError) return runnerConfig.error;

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
  return () =>
    tryCatch(async () => {
      const cfg = await jestRunnerConfig.search();

      if (!cfg || (cfg && !cfg.config)) {
        return {};
      }
      return cfg.config[ctx.runnerName];
      // TODO in next release
      // return {
      //   config: cfg.config[ctx.runnerName],
      //   filepath: cfg.filepath,
      // };
    }, ctx);
}
exports.tryLoadConfig = tryLoadConfig;

async function tryCatch(fn, ctx) {
  let res = null;

  try {
    res = await fn();
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

  return res;
}
exports.tryCatch = tryCatch;

function createFailed(ctx, message) {
  const { err, testPath, start, runnerConfig, runnerName } = ctx;
  const msg =
    runnerConfig && runnerConfig.verbose
      ? message || err.stack || err.message
      : message || err.message || 'Some unknown error!';

  return {
    hasError: true,
    error: fail({
      start,
      end: Date.now(),
      test: {
        path: testPath,
        title: runnerName,
        errorMessage: `${runnerName} runner: ${msg}`,
      },
    }),
  };
}
exports.createFailed = createFailed;
