#!/usr/bin/env node

// SPDX-License-Identifier: Apache-2.0

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { readJSON, command } from './index.js';

const pkgRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = readJSON(path.join(pkgRoot, 'package.json'));

// you can pass a program (hela) instance as second argument,
// otherwise it automatically creates a program in single command mode
const prog = await command({
  helpByDefault: false, // we want to run with the default globs patterns
  allowUnknownOptions: true,
  cliVersion: pkg.version,
});

// await not needed, but for safety
await prog.parse();
