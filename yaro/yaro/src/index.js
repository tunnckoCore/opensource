// SPDX-License-Identifier: MPL-2.0

import proc from 'node:process';
import { yaroCreateCli as cli } from 'yaro-create-cli';
import { yaroParse } from 'yaro-parser';
import { yaroCommand } from 'yaro-command';
// import yaroBuildOutput from 'yaro-build-output'

export * from 'yaro-parser';
export * from 'yaro-plugins';
export * from 'yaro-command';

export async function createCli(config) {
  return cli(proc.argv.slice(2), {
    ...config,
    exit: proc.exit,
    yaroParse,
    yaroCommand,
    // buildOutput: yaroBuildOutput,
  });
}

export { yaroCreateCli } from 'yaro-create-cli';
