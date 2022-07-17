// SPDX-License-Identifier: MPL-2.0

import yargsParser from 'https://esm.sh/yargs-parser@21';
import { Yaro } from './core.js';

const processExit = Deno.exit;
const platformInfo = `${Deno.build.os}-${Deno.build.arch} deno-${Deno.version.deno}`;

export const yaro = (name, settings) =>
  new Yaro(name, {
    ...settings,

    parser: yargsParser.detailed,
    argv: Deno.args,
    exit: Deno.exit,
    platformInfo,
  });

export { utils, Yaro } from './core.js';
