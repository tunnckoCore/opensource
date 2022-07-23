// SPDX-License-Identifier: MPL-2.0

import { strict as assert } from 'node:assert';
import test from 'asia';
import * as yaro from '../src/index.js';

test('initial tests for yaro package', async () => {
  assert.equal(typeof yaro.yaro, 'function');
  assert.equal(typeof yaro.parse, 'function');
  assert.equal(typeof yaro.parser, 'function');
  assert.equal(typeof yaro.pipeline, 'function');
});
