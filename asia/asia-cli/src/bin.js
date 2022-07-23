#!/usr/bin/env node

// SPDX-License-Identifier: Apache-2.0

import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCli, command, isRequired } from 'yaro';
import { readJSON, runAsia } from './index.js';

const pkgRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = readJSON(path.join(pkgRoot, 'package.json'));
const cwd = process.cwd();

const asia = command('[...patterns]', 'Run tests with ASIA test framework.')
  .option('--cwd', 'Working directory, defaults to `process.cwd()`.', cwd)
  .option('--verbose', 'Print more verbose output.', false)

  .option('-f, --force', 'Force running test without cache', false)
  .option('--cc, --cache-clean, --clean-cache', 'Clear the disk cache', false)
  .option('--only-failed', 'Print only failed tests', false)

  .option('-c, --config', 'Path to config file.', {
    default: 'asia.config.js',
    required: isRequired,
  })
  .option('--workspace-file', 'File path to write workspaces metadata.', {
    default: 'hela-workspace.json',
    required: isRequired,
  })
  .action(async (options, patterns) => {
    await runAsia(patterns, options);
  });

await createCli({
  commands: { asia },
  version: pkg.version,
  name: 'asia',
});
