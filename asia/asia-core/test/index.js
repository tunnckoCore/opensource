// SPDX-License-Identifier: MPL-2.0

import assert from 'node:assert/strict';
import test from 'asia';
import mod from '../src/index.js';

// eslint-disable-next-line no-promise-executor-return
const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('todo tests for asia-core package', async () => {
  await delay(2234);
  assert.equal(typeof mod, 'function');
});
