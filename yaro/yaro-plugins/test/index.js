// SPDX-License-Identifier: MPL-2.0

import { strict as assert } from 'node:assert';
import test from 'asia';
import { pipeline, alias, defaults, coerce, required } from '../src/index.js';

test('initial tests for yaro-plugins package', async () => {
  assert.equal(typeof pipeline, 'function');
  assert.equal(
    typeof pipeline(
      () => {},
      () => {},
    ),
    'function',
  );
  assert.equal(typeof defaults, 'function');
  assert.equal(typeof defaults({}), 'function');
  assert.equal(typeof required, 'function');
  assert.equal(typeof required({}), 'function');
  assert.equal(typeof coerce, 'function');
  assert.equal(typeof coerce({}), 'function');
  assert.equal(typeof alias, 'function');
  assert.equal(typeof alias({}), 'function');
});
