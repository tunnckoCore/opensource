// SPDX-License-Identifier: MPL-2.0

import proc from 'node:process';
import { yaroCreateCli as yaroCreate } from 'yaro-create-cli';
import { yaroParse } from 'yaro-parser';
import { yaroCommand } from 'yaro-command';
// import yaroBuildOutput from 'yaro-build-output'

export * from 'yaro-parser';
export * from 'yaro-plugins';
export * from 'yaro-command';
export * from 'yaro-create-cli';

export async function createCli(config) {
  if (Array.isArray(config)) {
    throw new TypeError(
      'yaro: You are trying to use `createCli` which accepts a `config` object. The `yaroCreateCli` accepts an array as the first argument.',
    );
  }
  return yaroCreate(proc.argv.slice(2), {
    ...config,
    exit: proc.exit,
    yaroParse,
    yaroCommand,
    // buildOutput: yaroBuildOutput,
  });
}
