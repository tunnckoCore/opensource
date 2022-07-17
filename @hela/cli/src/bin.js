#!/usr/bin/env node

// SPDX-License-Identifier: MPL-2.0
import cli from './index.js';

try {
  await cli();
} catch (err) {
  console.error('[hela] Failure!', err.stack);
}
