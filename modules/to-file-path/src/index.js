// SPDX-License-Identifier: MPL-2.0

import arrMap from 'arr-map';
import isArguments from 'is-arguments';

/**
 * Create filepath from different type of arguments.
 *
 * @example
 * const toFilePath = require('to-file-path');
 *
 * console.log(toFilePath('foo.bar.baz')); // => 'foo/bar/baz'
 * console.log(toFilePath('foo.bar', 'qux.baz', 'xxx')); // => 'foo/bar/qux/baz/xxx'
 * console.log(toFilePath('foo', 'qux', 'baz')); // => 'foo/qux/baz'
 * console.log(toFilePath([1, 2, 3], 'foo', 4, 'bar')); // => '1/2/3/foo/4/bar'
 * console.log(toFilePath(null, true)); // => 'null/true'
 * console.log(toFilePath(1, 2, 3)); // => '1/2/3'
 *
 * @param  {string|array|Arguments|number|boolean} `...args` Pass any type and any number of arguments.
 * @return {string} always slash separated filepath
 * @api public
 */
export default function toFilePath(args) {
	if (arguments.length > 1) {
		// eslint-disable-next-line prefer-rest-params
		return toFilePath(arguments);
	}

	if (Array.isArray(args) || isArguments(args)) {
		return arrMap(args, (val) => toFilePath(val)).join('/');
	}

	if (typeof args === 'string') {
		return args.split('.').join('/');
	}

	let val = args;
	if (typeof args === 'object') {
		val = JSON.stringify(args);
	}

	return toFilePath(String(val));
}
