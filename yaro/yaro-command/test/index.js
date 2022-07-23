// SPDX-License-Identifier: MPL-2.0

import { strict as assert } from 'node:assert';
import test from 'asia';
import { command } from '../src/index.js';

test('initial tests for yaro-command package', async () => {
  assert.equal(typeof command, 'function');
});
