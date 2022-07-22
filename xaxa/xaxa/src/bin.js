#!/usr/bin/env node

// SPDX-License-Identifier: Apache-2.0

import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCli, command, isRequired } from 'yaro';
import { readJSON, lint } from './index.js';

const pkgRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = readJSON(path.join(pkgRoot, 'package.json'));
const cwd = process.cwd();

const xaxa = command(
  '[...files]',
  'Lint and format files with ESLint --fix and Prettier.',
)
  .option('--cwd', 'Working directory, defaults to `process.cwd()`.', cwd)
  .option('--log', 'Log per changed file', false)
  .option('-f, --force', 'Force lint, cleaning the cache.', false)
  .option('-c, --config', 'Path to config file.', {
    default: 'xaxa.config.js',
    required: isRequired,
  })
  .option('--workspace-file', 'File path to write workspaces metadata.', {
    default: 'hela-workspace.json',
    required: isRequired,
    // type: 'string',
    // normalize: true,
  })
  .option('--verbose', 'Print more verbose output.', false)
  .action(async (options, files) => {
    await lint(files, options);
  });

await createCli({
  commands: { xaxa },
  version: pkg.version,
  name: pkg.name,
});
