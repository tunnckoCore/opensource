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

async function* globCache(options) {
  const settings = { ...options };
  const opts = {
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
      await hooks.notChanged(ctx, opts);
    }
    await hooks.always(ctx, opts);
    yield ctx;
  }
}

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

globCache.stream = globCache;
globCache.promise = async function globCachePromise(options) {
  const stream = globCache(options);
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
