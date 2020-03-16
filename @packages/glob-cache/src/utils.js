'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const cacache = require('cacache');

const readFile = util.promisify(fs.readFile);

function isFile(x) {
  return Boolean(x && x.path && x.contents) || false;
}

function isCacheFile(x) {
  return Boolean(x && x.path && x.key && x.integrity && x.time) || false;
}

function isContext(item) {
  return (
    (item &&
      isFile(item.file) &&
      (isCacheFile(item.cacheFile) || item.cacheFile === null)) ||
    false
  );
}

async function toFile(file) {
  if (isFile(file)) {
    return file;
  }

  if ((file && typeof file.path === 'string') || typeof file === 'string') {
    const contents = await readFile(file.path || file);
    return {
      path: file,
      contents,
      size: contents.length,
    };
  }

  throw new Error('glob-cache: unknown type, pass filepath or File object');
}

// const memoizer = memoizeFs({
//   cachePath: path.join(process.cwd(), '.cache', 'glob-meta-cache'),
// });

// function createToContext(options) {
//   const opts = { ...options };

//   return async function toContext(file) {
//     if (isContext(file)) {
//       return file;
//     }
//     let extra = file;

//     if (file && !isFile(file.file)) {
//       extra = file;
//       // eslint-disable-next-line no-param-reassign
//       file = toFile(file.file);
//     }

//     return { ...extra, file };
//   };
// }

module.exports = {
  isFile,
  isCacheFile,
  isContext,
  // createToContext,
  toFile,
  readFile,
};
