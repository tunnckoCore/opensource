/* eslint-disable no-restricted-syntax */
/* eslint-disable max-statements */

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const fastGlob = require('fast-glob');
const cacache = require('cacache');
const memoizeFs = require('memoize-fs');

const readFile = util.promisify(fs.readFile);

/**
 * A mirror of `globCache.stream` and so an "async generator" function,
 * returning an AsyncIterable. This mirror exists because it's
 * a common practice to have a `(globPatterns, options)` signature.
 *
 * @example
 * const globCache = require('glob-cache');
 *
 * const iterable = globCache(['src/*.js', 'test/*.{js,ts}'], {
 *   cwd: './foo/bar'
 * });
 *
 * // equivalent to
 *
 * const iter = globCache.stream({
 *   include: ['src/*.js', 'test/*.{js,ts}'],
 *   cwd: './foo/bar'
 * });
 *
 * @name  globCache
 * @param {string|Array} patterns - string or array of glob patterns
 * @param {object} options - see `globCache.stream` options
 * @public
 */
async function* globCache(patterns, options) {
  yield* globCache.stream({ ...options, patterns });
}

/**
 * Match files and folders with glob patterns, by default using [fast-glob's `.stream()`](https://ghub.now.sh/fast-glob).
 * This function is [async generator](https://javascript.info/async-iterators-generators)
 * and returns "async iterable", so you can use the `for await ... of` loop. Note that this loop
 * should be used inside an `async function`.
 * Each item is a [Context](#context-and-how-it-works) object, which is also passed to each hook.
 *
 * @example
 * const globCache = require('glob-cache');
 *
 * (async () => {
 *   // Using the Stream API
 *   const iterable = globCache.stream({
 *     include: 'src/*.js',
 *     cacheLocation: './foo-cache'
 *   });
 *
 *   for await (const ctx of iterable) {
 *     console.log(ctx);
 *   }
 * })();
 *
 * @name  globCache.stream
 * @param {string} options.cwd - working directory, defaults to `process.cwd()`
 * @param {string|Array} options.include - string or array of string glob patterns
 * @param {string|Array} options.patterns - alias of `options.include`
 * @param {string|Array} options.exclude - ignore glob patterns, passed to `options.globOptions.ignore`
 * @param {string|Array} options.ignore - alias of `options.exclude`
 * @param {object} options.hooks - an object with hooks functions, each hook passed with [Context](#context-and-how-it-works)
 * @param {Function} options.hooks.found - called when a cache for a file is found
 * @param {Function} options.hooks.notFound - called when file is not found in cache (usually the first hit)
 * @param {Function} options.hooks.changed - called always when source file differs the cache file
 * @param {Function} options.hooks.notChanged - called when both source file and cache file are "the same"
 * @param {Function} options.hooks.always - called always, no matter of the state
 * @param {Function} options.glob - a function `(patterns, options) => {}` or globbing library like [glob][], [globby][], [fast-glob][]
 * @param {object} options.globOptions - options passed to the `options.glob` library
 * @param {string} options.cacheLocation - a filepath location of the cache, defaults to `.cache/glob-cache` in `options.cwd`
 * @returns {AsyncIterable}
 * @public
 */
globCache.stream = async function* globCacheStream(options) {
  const settings = { ...options };
  const opts = {
    buffered: false,
    cwd: process.cwd(),
    exclude: ['**/node_modules/**'],
    ...settings,
    hooks: {
      always() {},
      changed() {},
      notChanged() {},
      found() {},
      ...settings.hooks,
    },
  };

  opts.cacheLocation =
    opts.cacheLocation && typeof opts.cacheLocation === 'string'
      ? opts.cacheLocation
      : path.join(opts.cwd, '.cache', 'glob-cache');

  const { glob = fastGlob.stream, globOptions, hooks } = opts;

  Object.keys(hooks).forEach((name) => {
    const hook = hooks[name];
    if (typeof hook !== 'function') {
      throw new TypeError(`glob-cache: expect hook "${name}" to be function`);
    }
  });

  hooks.notFound =
    hooks.notFound ||
    (async ({ file }) => {
      await cacache.put(opts.cacheLocation, file.path, file.contents);
    });

  const memoizer = memoizeFs({
    cachePath: path.join(opts.cwd, '.cache', 'glob-meta-cache'),
  });

  const globConfig = {
    ignore: arrayify(opts.ignore || opts.ignores || opts.exclude),
    cwd: opts.cwd,
    ...globOptions,
    unique: true,
    absolute: true,
    objectMode: true,
  };

  const iterable = await glob(opts.patterns || opts.include, globConfig);
  const integrityMemoized = await memoizer.fn(getIntegrityFor);

  for await (let data of iterable) {
    // in case of `globby()` or promisified `node-glob`
    data =
      typeof data === 'string'
        ? { path: data, name: path.basename(data) }
        : data;

    const contents = await readFile(data.path);
    const integrity = await integrityMemoized(contents);
    const info = await cacache.get.info(opts.cacheLocation, data.path);
    const hash = await cacache.get.hasContent(opts.cacheLocation, integrity);

    const file = {
      ...data,
      contents,
      size: contents.length,
      integrity,
    };

    const ctx = {
      file,
      changed: hash === false,
      notFound: info === null,
      cacache,
      cacheLocation: opts.cacheLocation,
    };

    ctx.cacheFile = info;
    if (hash) {
      ctx.cacheFile.stat = hash.stat;
    }

    if (ctx.changed) {
      if (ctx.notFound) {
        await hooks.notFound(ctx, opts);
      } else {
        await hooks.found(ctx, opts);
      }
      await hooks.changed(ctx, opts);
    } else {
      await hooks.found(ctx, opts);
      await hooks.notChanged(ctx, opts);
    }
    await hooks.always(ctx, opts);
    yield ctx;
  }
};

function hasha(value, opts) {
  const { algorithm, digest } = { ...opts };
  return crypto
    .createHash(algorithm)
    .update(value)
    .digest(digest);
}

function getIntegrityFor(contents, hash = 'sha512') {
  const id = hasha(contents, { algorithm: hash, digest: 'base64' });

  return `${hash}-${id}`;
}

function arrayify(val) {
  return [].concat(val).filter(Boolean);
}

/**
 * Using the Promise API allows you to use the Hooks API, and it's actually
 * the recommended way of using the hooks api. By default, if the returned promise
 * resolves, it will be an empty array. That's intentional, because if you are
 * using the hooks api it's unnecessary to pollute the memory putting huge objects
 * to a "result array". So if you want results array to contain the Context objects
 * you can pass `buffered: true` option.
 *
 * @example
 * const globCache = require('glob-cache');
 * const globby = require('globby');
 *
 * (async () => {
 *   // Using the Hooks API and `globby.stream`
 *   const res = await globCache.promise({
 *     include: 'src/*.js',
 *     cacheLocation: './.cache/awesome-cache',
 *     glob: globby.stream,
 *     hooks: {
 *       changed(ctx) {},
 *       always(ctx) {},
 *     }
 *   });
 *   console.log(res); // => []
 *
 *   // Using the Promise API
 *   const results = await globCache.promise({
 *     include: 'src/*.js',
 *     exclude: 'src/bar.js',
 *     buffered: true,
 *   });
 *
 *   console.log(results); // => [Context, Context, ...]
 * })();
 *
 * @name  globCache.promise
 * @param {object} options - see `globCache.stream` options, in addition here we have `options.buffered` too
 * @param {boolean} options.buffered - if `true` returned array will contain [Context]((#context-and-how-it-works)) objects, default `false`
 * @returns {Promise} if `options.buffered: true` resolves to `Array<Context>`, otherwise empty array
 * @public
 */
globCache.promise = async function globCachePromise(options) {
  const stream = globCache.stream(options);
  const results = [];

  for await (const ctx of stream) {
    // do not put on memory if not necessary,
    // because we may want to just use the Hooks API
    if (options.buffered) {
      results.push(ctx);
    }
  }

  return results;
};

module.exports = globCache;
