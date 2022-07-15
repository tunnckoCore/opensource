// SPDX-License-Identifier: MPL-2.0

/* eslint-disable promise/prefer-await-to-then */

import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
import test from 'asia';
import mod from '../src/index.js';

test('todo tests for yaro package', async () => {
  await delay(4000);
  assert.equal(typeof mod, 'function');
});

test("yaro 'cdx' tst", () => delay(1000).then(() => 'cdx')); // 5
test("yaro 'da' tst", () => delay(100).then(() => 'da')); // 1
