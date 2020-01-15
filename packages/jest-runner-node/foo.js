'use strict';

const assert = require('assert');
const test = require('asia');

test('foo bar qux', () => {
  assert.strictEqual(1, 123, 'should NOT be okay');
});

test('two failing tests qux', () => {
  assert.strictEqual(444441, 33333, 'should NOT be okay');
});

test('passing ok', () => {
  assert.strictEqual(typeof test, 'function', 'should not fail');
});
