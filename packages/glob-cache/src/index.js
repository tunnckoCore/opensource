/* eslint-disable no-param-reassign */

'use strict';

const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const cacache = require('cacache');
const fastGlob = require('fast-glob');
const arrayDiff = require('arr-diff');

const readFile = util.promisify(fs.readFile);
const defaultOptions = {
  include: [],
  exclude: ['**/node_modules'],
  hook: () => {},
  always: false,
  glob: fastGlob,
  globOptions: {},
  cacheLocation: './.cache/glob-cache',
};

/**
 * Match files and folders using glob patterns. Returns a resolved Promise containing
 * a `{ results, cacache }` object - where `results` is an array of [Context](#context-and-how-it-works) objects
 * and `cacache` is the [cacache][] package.
 *
 * @example
 * const tinyGlob = require('tiny-glob');
 * const glob = require('glob-cache');
 *
 * glob({ include: 'src/*.js', glob: tinyGlob }).then(({ results }) => {
 *   console.log(results);
 * });
 *
 *
 * @name  globCache
 * @param {string|Array<string>} options.include - string or array of string glob patterns
 * @param {string} options.exclude - ignore patterns
 * @param {boolean} options.always - a boolean that makes `options.hook` to always be called
 * @param {Function} options.hook - a hook function passed with [Context](#context-and-how-it-works)
 * @param {Function} options.glob - a globbing library like [glob][], [fast-glob][], [tiny-glob][], defaults to `fast-glob`
 * @param {object} options.globOptions - options passed to the `options.glob` library
 * @param {string} options.cacheLocation - a filepath location of the cache, defaults to `./.cache/glob-cache`
 * @returns {Promise}
 * @public
 */
module.exports = async function globCache(options) {
  const opts = { ...defaultOptions, ...options };

  /* istanbul ignore next */
  if (typeof opts.glob !== 'function') {
    opts.glob = fastGlob;
  }

  const files = await Promise.all(
    (
      await opts.glob(opts.include, {
        ...options.globOptions,
        unique: true,
        absolute: true,
        objectMode: true,
        ignore: opts.exclude,
      })
    ).map(async (file) => {
      if (typeof file === 'string') {
        file = { path: file };
      }
      file.contents = await readFile(file.path);
      return file;
    }),
  );

  /* istanbul ignore next */
  const hook = typeof opts.hook !== 'function' ? () => {} : opts.hook;
  const cacheLoc = opts.cacheLocation;
  const cached = await cacache.ls(cacheLoc);
  const cacheFiles = Object.keys(cached);
  const results = [];

  const missingFilesInCache = arrayDiff(
    files.map((x) => x.path),
    cacheFiles,
  );

  // source files are missing in cache, add them
  if (missingFilesInCache.length > 0) {
    // console.log('has missing', missingFilesInCache);
    await Promise.all(
      missingFilesInCache
        .reduce(
          (acc, fp) =>
            acc.concat(files.find((x) => x.path === fp)).filter(Boolean),
          [],
        )
        .map(async ({ path: filepath, contents }) => {
          const res = await cacache.put(
            cacheLoc,
            filepath,
            contents.toString(),
          );

          const ctx = {
            file: {
              path: filepath,
              contents,
              size: contents.length,
              integrity: res.sha512[0].source,
            },
            cacheFile: null,
            cacheLocation: cacheLoc,
            cacache,
            valid: true,
            missing: true,
          };

          results.push(ctx);
          if (opts.always === true) {
            await hook(ctx);
          }
        }),
    );
    // console.log('they are written to cache');
  }

  if (cacheFiles.length > 0) {
    // console.log('cacheFiles');
    await Promise.all(
      cacheFiles.map(async (fp) => {
        const cacheFile = cached[fp];
        // most probably the source file was deleted
        /* istanbul ignore next */
        if (!fs.existsSync(fp)) {
          // console.log('delete from cache:', fp);

          // ? should we delete the index too (doesn't seem to work anyway)?
          await cacache.rm.entry(cacheLoc, fp);
          await cacache.rm.content(cacheLoc, cacheFile.integrity);
          await cacache.verify(cacheLoc);
          return;
        }
        const contents = await readFile(fp);
        const integrity = integrityFromContents(contents);
        const hash = await cacache.get.hasContent(cacheLoc, integrity);

        const valid = hash !== false;
        const file = { path: fp, contents, size: contents.length, integrity };
        const ctx = {
          file,
          cacheFile: hash
            ? { ...cacheFile, sri: hash.sri, stat: hash.stat }
            : cacheFile,
          cacheLocation: cacheLoc,
          cacache,
          valid,
          missing: false,
        };

        results.push(ctx);

        if (opts.always === true || valid === false) {
          await hook(ctx);
        }
      }),
    );
  }

  return { results, cacache };
};

function integrityFromContents(contents, hash = 'sha512') {
  const integrity = crypto
    .createHash(hash)
    .update(contents)
    .digest('base64');

  return `${hash}-${integrity}`;
}

// async function hook(context) {
//   console.log('ctx', context);
//   // updateCache(context);;;;;;;;;
// }

// main({
//   include: ['**/*.js', '*.json'],
//   // hook,
// }).then(({ results }) => {
//   // console.log(files);
//   console.log('Done!');
// });
