// SPDX-License-Identifier: MPL-2.0

export default class Cache {
  constructor(options) {
    this.options = {
      // fs: fsp,
      stringify: JSON.stringify,
      parse: JSON.parse,
      // cwd: process.cwd(),
      filenamify,
      ...options,
    };
    if (!this.options.fs) {
      throw new TypeError(
        'Cache requires passing options.fs promised FileSystem API',
      );
    }
    const { join } = this.options.path || { join: pathJoin };

    this.cacheDir = join(this.options.cwd || '.', '.cache', 'asia');

    this.filename = (fp) =>
      join(this.cacheDir, `${this.options.filenamify(fp)}.txt`);
    this.filename.bind(this);

    // if (this.options.env?.ASIA_NO_AUTORUN === undefined) {
    //   this.prepare();
    // }
  }

  async prepare() {
    await this.options.fs.mkdir(this.cacheDir, { recursive: true });
  }

  async set(key, value) {
    await this.options.fs.writeFile(
      this.filename(key),
      this.options.stringify(value),
    );
  }

  async has(key) {
    try {
      await this.options.fs.stat(this.filename(key));
    } catch {
      return false;
    }
    return true;
  }

  async get(key, raw) {
    const value = await this.options.fs.readFile(this.filename(key), 'utf8');

    return raw ? value : this.options.parse(value);
  }

  async delete(key) {
    try {
      await this.options.fs.rm(this.filename(key));
    } catch {}
  }

  async clear() {
    try {
      await this.options.fs.rm(this.cacheDir, { recursive: true });
      this.prepare();
    } catch {}
  }
}

export function filenamify(str) {
  let s = str;
  s = s.trim();
  s = s.normalize('NFD');
  s = s.replace(/["']/g, '');
  s = s.replace(/\s+/g, '-');
  s = s.replace(filenameReservedRegex(), '-');
  s = s.replace(controlCharsRegex(), '-');
  s = s.replace(/\.+/g, '-');
  s = s.replace(/-+/g, '-');

  s = s.endsWith('-') ? s.slice(0, -1) : s;

  return s.length > 80 ? s.slice(0, 80) : s;
}

// note: MIT sindre
function filenameReservedRegex() {
  // eslint-disable-next-line no-control-regex
  return /[\u0000-\u001F"*/:<>?\\|]/g;
}

// note: MIT sindre
function controlCharsRegex() {
  // eslint-disable-next-line no-control-regex
  return /[\u0000-\u001F\u0080-\u009F]/g;
}

// Deno's path.join
function pathJoin(...paths) {
  if (paths.length === 0) return '.';
  let joined;

  // eslint-disable-next-line no-plusplus
  for (let i = 0, len = paths.length; i < len; ++i) {
    const fp = paths[i];
    if (fp.length > 0) {
      if (!joined) joined = fp;
      else joined += `/${fp}`;
    }
  }
  if (!joined) return '.';
  return joined;
}
