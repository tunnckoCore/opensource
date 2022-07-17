/* eslint-disable */

import fs, { promises as fsp } from 'node:fs';
import { pipeline } from 'node:stream';
import process from 'node:process';
import crypto from 'node:crypto';
import path from 'node:path';
import ssri from 'ssri';

function toHex(val, digest = 'hex') {
  return Buffer.from(val).toString(digest);
}

function makeData(val, { algorithms = ['sha512'] } = {}) {
  const sri = ssri.fromData(val, { algorithms });
  const integrity = sri.toString();
  const hex = Buffer.from(integrity.slice(7), 'base64').toString('hex');
  return { sri, hex, integrity };
}

class Cache {
  constructor(name, options) {
    this.name = name || makeData(String(Date.now())).hex;
    this.options = { cwd: process.cwd(), dir: '.cache', ...options };
    this.cache = path.resolve(this.options.cwd, this.options.dir, this.name);
    this.contentsDir = path.join(this.cache, 'contents-v1');
    this.index = path.join(this.cache, 'index');

    fs.mkdirSync(this.contentsDir, { recursive: true });
  }

  async put(data, metadata) {
    const { sri, hex, integrity } = makeData(data);
    const key = `"key":"${hex}"`;
    const value = `{${key},"integrity":"${integrity}","time":${Date.now()}}\n`;

    const indexSource = fs.createReadStream(this.index, {
      highWaterMark: 16 * 1024, // 16kb
      encoding: 'utf8',
    });
    // const indexDestination = fs.createWriteStream('./foobie', { flags: 'a' });

    let shouldWrite = false;
    for await (const chunk of indexSource) {
      if (!chunk.includes(key)) {
        shouldWrite = true;
      }
    }

    console.log('write?', shouldWrite);
    // stream.push('xxxx');

    // await fsp.appendFile(this.index, value);
  }

  async get(key) {}
}

const filename = path.resolve('./colorsx.js');
const contents = await fsp.readFile(filename);
const cache = new Cache('fc06f98f0243e5c69d4795fc');

await cache.put(contents);

// const cacheLocation = './.cache/foobie';
// const filename = path.resolve('./colors.js');
// const contents = await fs.readFile(filename);

// // CASET=1 node caching.js
// // CHANGED=1 node caching
// // or just:
// // CAPUT=1 node caching.js

// if (process.env.CASET !== undefined) {
// 	await set(cacheLocation, filename, contents, {
// 		metadata: {
// 			filename,
// 		},
// 	});
// }

// if (process.env.CAPUT !== undefined) {
// 	await put(cacheLocation, contents, {
// 		metadata: {
// 			filename,
// 		},
// 	});
// }

// let res = await get(cacheLocation, contents, {
// 	checkChanged: process.env.CHANGED,
// });

// // if res === null, no index cache file, so no cache at all
// // if res === false, no cache content file
// if (res === null) {
// 	console.log('No cache for this file, creating automatically...');
// 	await put(cacheLocation, contents, {
// 		metadata: {
// 			filename,
// 		},
// 	});
// 	res = await get(cacheLocation, contents, {
// 		checkChanged: process.env.CHANGED,
// 	});
// }

// console.log('get() result:', res);

// put = key from data (content addressable)
// async function put(cache, data, options) {
// 	const opts = { ...options };
// 	const key = hash(data);
// 	opts.key = key;

// 	return set(cache, key, data, opts);
// }

// // set = put with key
// async function set(cache, key, data, options) {
// 	const opts = { ...options };
// 	const contentBucket = makeBucket(cache, key, {
// 		key: opts.key,
// 		type: 'contents',
// 	});

// 	if (opts.size && typeof opts.size === 'number' && data.length !== opts.size) {
// 		throw sizeError(data.length, opts.size);
// 	}

// 	const sri = ssri.fromData(data, { algorithms: ['sha512'] });

// 	// console.log('contentBucket', contentBucket);
// 	await fs.mkdir(contentBucket.dirname, { recursive: true });
// 	await fs.writeFile(contentBucket.filename, data);

// 	const indexBucket = makeBucket(cache, key, {
// 		key: contentBucket.keyHash, // avoid hitting `crypto` when we have it
// 		type: 'index',
// 	});

// 	// console.log('indexBucket', indexBucket);

// 	await fs.mkdir(indexBucket.dirname, { recursive: true });
// 	await fs.writeFile(
// 		indexBucket.filename,
// 		JSON.stringify({
// 			key: indexBucket.key,
// 			path: contentBucket.filename,
// 			integrity: sri.toString(),
// 			time: Date.now(),
// 			size: data.length,
// 			metadata: { ...opts.metadata },
// 		}),
// 	);
// }

// async function getInfo(cache, key, throws = false) {
// 	const indexBucket = makeBucket(cache, key, { type: 'index' });

// 	return tryCatch(
// 		() => readJSON(indexBucket.filename),
// 		throws && missingCacheIndexError(indexBucket.filename),
// 	);
// }

// async function get(cache, key, options) {
// 	const opts = { ...options };
// 	const index = await getInfo(cache, key, opts.throws);

// 	if (!index) {
// 		return null;
// 	}

// 	const contentCachePath = path.resolve(index.path);
// 	const data = await tryCatch(
// 		() => fs.readFile(contentCachePath),
// 		opts.throws && missingContentError(contentCachePath),
// 	);

// 	if (!data) {
// 		return false;
// 	}

// 	const malformedCache = ssri.checkData(data, index.integrity) === false;

// 	const { metadata: meta } = index;
// 	const result = { ...index, malformedCache };

// 	result.contents = data;

// 	if (malformedCache) {
// 		return result;
// 	}

// 	const { sourceFile, mtime } = await lastModified(meta);

// 	// we don't need to check last modified, or if sourceFile exists,
// 	// so if that's the case `mtime === 0`, thus it will skip that `if`
// 	if (mtime > index.time) {
// 		result.metadata.mtime = mtime;
// 		result.metadata.changed = true;

// 		if (opts.checkChanged) {
// 			const freshContents = await fs.readFile(sourceFile);
// 			const same = ssri.checkData(freshContents, index.integrity) !== false;

// 			result.metadata.changed = same !== true;
// 		}
// 	}

// 	return result;
// }

// async function check(cache, key, data, integrity) {}

// async function tryCatch(fn, throws) {
// 	let res = false;
// 	try {
// 		res = await fn();
// 	} catch (err) {
// 		res = false;
// 		if (throws) {
// 			throw throws;
// 		}
// 	}

// 	return res;
// }

// async function lastModified(meta) {
// 	const res = {};
// 	if (meta.stat) {
// 		res.mtime = meta.stat.mtimeMs;
// 	}
// 	if (meta.mtime || meta.mtimeMs) {
// 		res.mtime = meta.mtime || meta.mtimeMs;
// 	}

// 	const sourceFile = meta.path || meta.filename || meta.filePath;
// 	if (!sourceFile) {
// 		return { mtime: 0 };
// 	}

// 	const stat = await tryCatch(() => fs.stat(sourceFile), false);
// 	if (!stat) {
// 		return { mtime: 0 };
// 	}

// 	res.mtime = stat.mtimeMs;

// 	res.sourceFile = sourceFile;
// 	res.mtime = Math.floor(res.mtime);

// 	return res;
// }

// async function readJSON(fp) {
// 	return JSON.parse(await fs.readFile(path.resolve(fp), 'utf8'));
// }

// function makeBucket(cache, key, options) {
// 	const opts = { ...options };
// 	const keyHash = opts.key || hash(key);
// 	const segments = hashToSegments(keyHash, opts);
// 	const filename = path.join(cache, opts.type + '-v1', ...[].concat(segments));
// 	const dirname = path.dirname(filename);

// 	return {
// 		key: key,
// 		keyHash,
// 		segments,
// 		filename,
// 		dirname,
// 		root: path.join(cache, opts.type + '-v1'),
// 	};
// }

// function hashToSegments(hash, { type } = {}) {
// 	if (type === 'index') {
// 		return hash;
// 	}
// 	return [hash.slice(0, 3), hash.slice(3, 6), hash.slice(6)];
// }

// function missingContentError(key) {
// 	const err = new Error(`Missing content cache file: ${key}`);

// 	err.actual = key;
// 	err.found = key;
// 	err.code = 'ERR_MISSING_CONTENT_CACHE';

// 	return err;
// }

// function missingCacheIndexError(key) {
// 	const err = new Error(`Missing cache index file: ${key}`);

// 	err.actual = key;
// 	err.found = key;
// 	err.code = 'ERR_MISSING_CACHE_INDEX';

// 	return err;
// }

// function sizeError(actual, expected) {
// 	/* eslint-disable-next-line max-len */
// 	const err = new Error(
// 		`Bad data size: expected inserted data to be ${expected} bytes, but got ${actual} instead`,
// 	);
// 	err.expected = expected;
// 	err.actual = actual;
// 	err.found = actual; // `cacache` compat
// 	err.code = 'ER_BAD_SIZE';
// 	return err;
// }

// function checksumError(actual, expected) {
// 	const err = new Error(`Integrity check failed:
//   Wanted: ${expected}
//    Found: ${actual}`);
// 	err.code = 'ERR_INTEGRITY';
// 	err.expected = expected;
// 	err.actual = actual;
// 	err.found = actual; // `cacache` compat
// 	return err;
// }
