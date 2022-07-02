'use strict';

const toPath = require('../src/index');

test('should always return string', () => {
	expect(typeof toPath(true)).toStrictEqual('string');
	expect(typeof toPath(null)).toStrictEqual('string');
	expect(typeof toPath(123)).toStrictEqual('string');
	expect(typeof toPath(true, true)).toStrictEqual('string');
	expect(typeof toPath(null, true)).toStrictEqual('string');
	expect(typeof toPath('a', 'b', 'c')).toStrictEqual('string');
	expect(typeof toPath(1, 2, 3)).toStrictEqual('string');
	expect(typeof toPath(1, 'b', 3)).toStrictEqual('string');
	expect(typeof toPath({ a: 'b' }, 'c')).toStrictEqual('string');
	expect(typeof toPath(function a(_) {}, 'c')).toStrictEqual('string');
});

test('should JSON.stringify object values', () => {
	expect(toPath('a', { b: 'c' }, 'd')).toStrictEqual('a/{"b":"c"}/d');
	expect(toPath('a', { b: { foo: 'bar' } }, 'd')).toStrictEqual(
		'a/{"b":{"foo":"bar"}}/d',
	);
});

test('should create filepath from string with dot notation', () => {
	expect(toPath('foo.bar.baz')).toStrictEqual('foo/bar/baz');
	expect(toPath('foo.bar/baz.qux')).toStrictEqual('foo/bar/baz/qux');
	expect(toPath('123.12.111.224')).toStrictEqual('123/12/111/224');
});

test('should create filepath from list of arguments', () => {
	expect(toPath('12.35', '224', '150', '78')).toStrictEqual('12/35/224/150/78');
	expect(toPath('12.35', '224.150')).toStrictEqual('12/35/224/150');
	expect(toPath('12', 78, 242, '356')).toStrictEqual('12/78/242/356');
	expect(toPath(123.22)).toStrictEqual('123/22');
	expect(toPath(122)).toStrictEqual('122');
	expect(toPath(122, 255)).toStrictEqual('122/255');
});

test('should create filepath from mixed type of arguments', () => {
	const actual = toPath(
		123,
		'foo.bar',
		['baz', 11, 'qux', 'aaa.bbb', 555],
		true,
		'ddd',
	);

	expect(actual).toStrictEqual('123/foo/bar/baz/11/qux/aaa/bbb/555/true/ddd');
});

test('should create filepath from Arguments object', () => {
	// eslint-disable-next-line unicorn/consistent-function-scoping
	function fixture() {
		// eslint-disable-next-line prefer-rest-params
		return toPath(arguments);
	}
	const actual = fixture(1, 2, 3, 'foo', 'bar.baz', ['qux', 4, 'aaa.bb', 5], 6);
	expect(actual).toStrictEqual('1/2/3/foo/bar/baz/qux/4/aaa/bb/5/6');
});
