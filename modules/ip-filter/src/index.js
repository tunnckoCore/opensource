// SPDX-License-Identifier: MPL-2.0

import ipRegex from 'ip-regex';
import micromatch from 'micromatch';
import toFilePath from 'to-file-path';

/**
 * Filter `ip` against glob `patterns`, using [micromatch][] under the hood,
 * so `options` are passed to it.
 *
 * @example
 * import ipFilter from 'ip-filter';
 *
 * console.log(ipFilter('123.77.34.89', '123.??.34.8*')); // => '123.77.34.89'
 * console.log(ipFilter('123.222.34.88', '123.??.34.8*')); // => null
 * console.log(ipFilter('123.222.33.1', ['123.*.34.*', '*.222.33.*'])); // => '123.222.33.1'
 *
 * // should notice the difference
 * console.log(ipFilter('123.222.34.88', ['123.*.34.*', '!123.222.**']));
 * // => null
 * console.log(ipFilter('123.222.34.88', ['123.*.34.*', '!123.222.*']));
 * // => '123.222.34.88'
 *
 * @example
 * import ipFilter from 'ip-filter';
 * //
 * // NON-STRICT mode
 * //
 *
 * const res = ipFilter('x-koaip', ['*-koaip', '!foo-koa*'], { strict: false });
 * console.log(res); // => 'x-koaip'
 *
 * const res = ipFilter('x-koa.foo', ['*-koa.*', '!foo-koa.*'], { strict: false });
 * console.log(res); // => 'x-koa.foo'
 *
 * @name   ipFilter
 * @param  {string} `ip` Accepts only valid IPs by default
 * @param  {string|array} `patterns` Basically everything that [micromatch][]'s second argument can accept.
 * @param  {object} `options` Pass `strict: false` if want to validate non-ip values,
 *                            options are also passed to [micromatch][].
 * @return {string} a `string` or `null` - If not match returns `null`, otherwise the passed `ip` as string.
 * @api public
 */
export default function ipFilter(ip, patterns, options) {
  if (typeof ip !== 'string') {
    throw new TypeError('ip-filter: expect `ip` to be a string');
  }

  const opts = { ...options };
  opts.strict = typeof opts.strict === 'boolean' ? opts.strict : true;

  if (opts.strict && !ipRegex().test(ip)) {
    throw new Error('ip-filter: expect only valid IPs when `opts.strict` mode');
  }

  const id = opts.strict ? tofp(ip) : ip;
  const globs = opts.strict ? tofp(patterns) : patterns;

  const matches = micromatch(id, globs, opts);

  return matches && matches.length > 0 ? ip : null;
}

function tofp(val) {
  const value = typeof val === 'string' ? toFilePath(val) : val;
  return Array.isArray(value) ? value.flat().map((p) => toFilePath(p)) : value;
}
