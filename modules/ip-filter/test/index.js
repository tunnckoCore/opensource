import test from 'asia';
import { expect } from 'expect';

import ipFilter from '../src/index.js';

test('should throw TypeError if `ip` not a string', () => {
	expect(() => ipFilter(123)).toThrow(TypeError);
	expect(() => ipFilter(123)).toThrow(/expect `ip` to be a string/);
});

test('should throw Error if not valid IPv4 or IPv6 ip is given', () => {
	// eslint-disable-next-line unicorn/consistent-function-scoping
	function fixture() {
		ipFilter('foo.bar.baz.123', './**/.glob*');
	}
	expect(fixture).toThrow(Error);
	expect(fixture).toThrow(/expect only valid IPs when `opts.strict` mode/);
});

test('should return IP if match string glob pattern', () => {
	const actual1 = ipFilter('123.222.34.88', '123.??.34.8*'); // => null
	const actual2 = ipFilter('123.77.34.89', '123.??.34.8*'); // => '123.77.34.89'

	expect(actual1).toBeNull();
	expect(actual2).toStrictEqual('123.77.34.89');
});

test('should return IP if match one of array glob patterns', () => {
	const actual1 = ipFilter('123.222.34.88', ['123.*.34.*', '!123.222.**']); // => null
	const actual2 = ipFilter('123.222.34.88', ['123.*.34.*', '!123.222.*']); // => '123.222.34.88'
	const actual3 = ipFilter('123.222.33.1', ['123.*.34.*', '*.222.33.*']); // => '123.222.33.1'

	expect(actual1).toBeNull();
	expect(actual2).toStrictEqual('123.222.34.88');
	expect(actual3).toStrictEqual('123.222.33.1');
});

test('should return null if not match', () => {
	const actual = ipFilter('123.222.34.89', ['123.???.34.8*', '!123.222.34.89']);
	const expected = null;

	expect(actual).toStrictEqual(expected);
});

test('should support no strict mode to compare other than IPs', () => {
	const actual1 = ipFilter('x-koaip', ['*-koaip', '!foo-koa'], {
		strict: false,
	});
	const actual2 = ipFilter('foo.bar.baz.123', 'foo.bar.**', { strict: false });
	const expected = 'x-koaip';

	expect(actual1).toStrictEqual(expected);
	expect(actual2).toStrictEqual('foo.bar.baz.123');
});

test('should work in non strict mode', () => {
	const actual = ipFilter('x-koaip.foo', ['*-koaip.*', '!foo-koa.*'], {
		strict: false,
	});
	expect(actual).toStrictEqual('x-koaip.foo');
});
