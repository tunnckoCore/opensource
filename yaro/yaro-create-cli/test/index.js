// SPDX-License-Identifier: MPL-2.0

import { strict as assert } from 'node:assert';
import test from 'asia';
import yaroCreateCli from '../src/index.js';

test('initial tests for yaro-create-cli package', async () => {
  assert.equal(typeof yaroCreateCli, 'function');
});
