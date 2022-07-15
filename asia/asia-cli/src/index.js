/* eslint-disable no-param-reassign */
// SPDX-License-Identifier: MPL-2.0

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import fastGlob from 'fast-glob';
import { parallel } from 'asia-core';
import { yaro } from 'yaro';

export function readJSON(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

export const DEFAULT_IGNORE = [
  '**/node_modules/**',
  '**/bower_components/**',
  '**/flow-typed/**',
  '**/coverage/**',
  '**/{tmp,temp}/**',
  '**/*.min.js',
  '**/bundle.js',
  '**/.cache/**',
  '**/{fixture,fixtures}/**',
  '**/vendor/**',
  '**/dist/**',
];

export const DEFAULT_PATTERNS = [
  '**/test.js',
  // "**/asia/node-example.js",
  // "**/asia-core/example.js",
  '**/*.spec.js',
  '**/*.test.js',
  '**/test/**/*.js',
  '**/tests/**/*.js',
  '**/__tests__/**/*.js',
].concat(DEFAULT_IGNORE.map((x) => `!${x}`));

export async function command(options, prog) {
  if (options && options.isHela && options.isYaro) {
    prog = options;
    options = {};
  }
  const opts = { cwd: process.cwd(), ...options };

  prog = prog
    ? prog.singleMode('asia [...patterns] [options]')
    : yaro('asia [...patterns] [options]', {
        ...opts,
        helpByDefault: false, // note: we want to run with the default globs patterns
        allowUnknownOptions: true, // todo: does not respect it for some reason
        singleMode: true,
      })
        .option(
          '--cwd',
          'Working directory, defaults to `process.cwd()`.',
          opts.cwd,
        )
        .option('--verbose', 'Print more verbose output.', false);

  return prog
    .describe('Run tests with ASIA test framework.')
    .alias('tst', 'test', 'tests', 'testing', 'tset', 'tste', 'tast', 'asia')

    .option('-f, --force', 'Force running test without cache', false)
    .option('--cache-clean', 'Clear the disk cache', false)
    .option('--only-failed', 'Print only failed tests', false)

    .option('-c, --config', 'Path to config file.', {
      default: 'asia.config.js',
      type: 'string',
      normalize: true,
    })
    .option('--workspace-file', 'File path to write workspaces metadata.', {
      default: 'hela-workspace.json',
      type: 'string',
      normalize: true,
    })
    .action(async ({ flags, patterns }, { globalOptions }) => {
      const testOptions = { ...globalOptions, ...flags };

      if (testOptions.verbose) {
        console.log('[asia]: testing...', patterns, testOptions);
      }
      await runAsia(patterns, testOptions);
    });
}

function arrayifiy(val) {
  if (!val) {
    return [];
  }
  if (Array.isArray(val)) {
    return val.flat();
  }
  return [val];
}

export async function runAsia(patterns, options = {}) {
  const flags = { ...options };
  const globs = arrayifiy(patterns);
  const input = globs.length > 0 ? globs : DEFAULT_PATTERNS;

  process.env.ASIA_NO_CACHE = flags.force === true ? '1' : undefined;
  process.env.ASIA_RELOAD = flags.cacheClean === true ? '1' : undefined;
  // NOTE: not needed, since we can just pass patterns
  // to filter out what we want to test
  // process.env.ASIA_MATCH = flags.filter ?? undefined;
  process.env.ASIA_ONLY_FAILED = flags.onlyFailed === true ? '1' : undefined;

  const testFiles = await fastGlob(input, flags);

  await parallel(testFiles, ({ value: testPath }) =>
    import(path.resolve(testPath)),
  );
}
