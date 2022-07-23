/**
 * @typedef {import('filenamify').Options} FilenamifyOptions
 * @typedef {import('node:path').ParsedPath} ParsedPath
 *
 * @typedef FormidableFileOptions
 * @property {string} [type] - mime type from header
 * @property {number} [lastModified] - file mtimeMs, default `Date.now()`
 * @property {number} [size] - file size in bytes
 * @property {boolean} [randomName] - generate random filename, default `true` using `cuid`
 * @property {FilenamifyOptions} [filenamify] - options passed to `filenamify`
 * @property {RenamerFn} [rename] - filename renaming function
 * @property {FilePropertyBag & {signal?: AbortSignal}} [signal] - abort controller signal
 * @property {{[key: string]: unknown}} [data] - any additional data or way of storing things
 *
 * @typedef {(filepath: string, contents: unknown, options: FormidableFileOptions) => string} RenamerFn
 * must be synchronous function
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import cuid from 'cuid';
import { filenamifyPath } from 'filenamify';

/**
 * @typedef {{type?: string, name: string, lastModified: number}} File
 * standard Web API File
 */
// @ts-ignore
import { File } from 'fetch-blob/file.js';

export class FormidableFile extends File {
  /**
   *
   * @param {string} filepath - filename from header
   * @param {unknown} contents - any file content value
   * @param {FormidableFileOptions} [options]
   */
  constructor(filepath, contents, options) {
    const { file, opts, fp } = normalize(filepath, contents, options);

    super(contents, file.base, {
      // @ts-ignore
      type: opts.mimetype || opts.mime || opts.type,
      lastModified: opts.lastModified || Date.now(),
    });

    /**
     * @type {string} - full filepath
     */
    // we assign this here, because to not mess with ParsedPath `file`
    this.path = fp;

    this._updateProps(file, contents, opts);
  }

  /**
   *
   * @param {ParsedPath} file - custom file
   * @param {unknown} contents - any file content value
   * @param {FormidableFileOptions} [options]
   */

  _updateProps(file, contents, options) {
    // it's already normalized
    // const opts = normalizeOptions(options);

    this.basename = file.base;
    this.dirname = file.dir;
    this.extname = file.ext;

    this.stem = file.name; // this.stem == this.name == file.name == basename without extname
    this.mime = options.type;

    if (options.size > 0) {
      // @ts-ignore
      this.size = options.size;
    }

    Reflect.defineProperty(this, 'contents', { value: contents });
    Reflect.defineProperty(this, 'options', { value: options });
    Reflect.defineProperty(this, 'base', { value: file.base });
    Reflect.defineProperty(this, 'dir', { value: file.dir });
    Reflect.defineProperty(this, 'ext', { value: file.ext });
    Reflect.defineProperty(this, 'data', { value: options.data });
  }
}

/**
 *
 * @param {string} filepath - filename from header
 * @param {unknown} contents - any file content value
 * @param {FormidableFileOptions} [options]
 *
 */
function normalize(filepath, contents, options) {
  const opts = normalizeOptions(options);

  /**
   * @type {string} fp
   */
  const fp = filenamifyPath(
    // @ts-ignore
    opts.rename(filepath, contents, opts),
    opts.filenamify,
  );

  /**
   *
   * @type {ParsedPath} file
   */
  const file = path.parse(fp);

  return { file, opts, fp };
}

/**
 * @param {{[key: string]: unknown} & FormidableFileOptions} [options]
 * @returns {FormidableFileOptions}
 */
function normalizeOptions(options = {}) {
  const opts = {
    filenamify: { replacement: '-', ...options.filenamify },
    randomName: true,
    data: { ...options.data },
    ...options,
  };

  /**
   * @property {RenamerFn}
   */
  opts.rename =
    typeof opts.rename === 'function'
      ? opts.rename
      : (f) => (opts.randomName ? cuid() : f);

  return opts;
}

export default FormidableFile;

export { File } from 'fetch-blob/file.js';

/**
 * examples
 */

// const file = new FormidableFile(
//   './foo/bar/qu_sas<mail@at.com>zab.gz<script onchange="alert(1)"></script>sax.png',
//   await fs.readFile('./examples/10k.json'),
//   {
//     type: 'application/json',
//     randomName: true,
//     data: { sasa: 1 },
//   },
// );

// file._updateProps('sasa', 'hihi');

// part.on('data', async () => {
//   let file = new FormidableFile(nameFromHeader, dataFromParser, {
//     type: contentTypeFromParser,
//     rename: formidableOptions.rename,
//   });
//   const blob = await createTemporaryBlob(
//     file.contents,
//     file.type,
//     file.options.signal,
//   );

//   file.blob = blob;
//   this.emit('file', file, blob);

//   if (formidableOptions.save) {
//     await fs.writeFile(file.path, file.contents);
//   }
// });
