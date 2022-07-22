// SPDX-License-Identifier: MPL-2.0

import { strict as assert } from 'node:assert';
import test from 'asia';

import { runAsia } from '../src/index.js';

test('check `runAsia` is a function', async () => {
  // emulate slowness
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  assert.equal(typeof runAsia, 'function');
});
