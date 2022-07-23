// SPDX-License-Identifier: MPL-2.0

import { yaroCreateCli as yaroCreate } from 'https://esm.sh/yaro-create-cli@canary?pin=v87';
import { yaroParse } from 'https://esm.sh/yaro-parser@canary?pin=v87';
import { yaroCommand } from 'https://unpkg.com/yaro-command@5.0.0-canary.5/src/mod.ts';
// import yaroBuildOutput from 'yaro-build-output'

export * from 'https://esm.sh/yaro-parser@canary?pin=v87';
export * from 'https://esm.sh/yaro-plugins@canary?pin=v87';
export * from 'https://unpkg.com/yaro-command@5.0.0-canary.5/src/mod.ts';
export * from 'https://esm.sh/yaro-create-cli@canary?pin=v87';

export async function createCli(config) {
  if (Array.isArray(config)) {
    throw new TypeError(
      'yaro: You are trying to use `createCli` which accepts a `config` object. The `yaroCreateCli` accepts an array as the first argument.',
    );
  }
  return yaroCreate(Deno.args, {
    ...config,
    exit: Deno.exit,
    yaroParse,
    yaroCommand,
    // buildOutput: yaroBuildOutput,
  });
}
