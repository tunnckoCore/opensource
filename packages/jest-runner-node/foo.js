'use strict';

const assert = require('assert');
const test = require('asia');

test('foo bar qux', () => {
  assert.strictEqual(1, 44444, 'failing');
});

test('passing ok', () => {
  assert.strictEqual(1, 1, 'should not fail');
});
