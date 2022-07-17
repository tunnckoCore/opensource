// SPDX-License-Identifier: MPL-2.0

import process from 'node:process';
import dargs from 'dargs';
import { npm, yarn } from 'global-dirs';
import { parallel, serial } from '@tunnckocore/p-all';
import { execaCommand } from 'execa';
import { yaro } from 'yaro';

const processEnv = process.env;
const globalBins = [npm.binaries, yarn.binaries];

const defaultExecaOptions = {
  stdio: 'inherit',
  env: { ...processEnv },
  cwd: process.cwd(),
  concurrency: 1,
};

/**
 *
 * @param {object} argv
 * @param {object} options
 */
function toFlags(argv, options) {
  const opts = { shortFlag: true, ...options };
  return dargs(argv, opts).join(' ');
}

/**
 *
 * @param {string|string[]} cmd
 * @param {object} [options]
 * @public
 */
async function run(cmd, options) {
  const envPATH = `${processEnv.PATH}:${globalBins.join(':')}`;
  const env = { ...defaultExecaOptions.env, PATH: envPATH };
  const opts = { serial: true, ...options };
  const runIn = opts.serial ? serial : parallel;

  return runIn([cmd].flat(), async ({ value: command }) =>
    execaCommand(command, { ...defaultExecaOptions, env, ...options }),
  );
}

function hela(settings) {
  const cli = yaro('hela', {
    ...settings,
    helpByDefault: true,
    allowUnknownOptions: true, // todo: temporary
    singleMode: false,
    cliVersion: '5.0.0',
  });
  cli.isHela = true;

  if (!cli.settings.pupulateEnv) {
    return cli;
  }

  return cli.option(
    '--env',
    'Populates from `process.env` (support multiple times, and dot-notation).',
    { default: { ...processEnv } },
  );
}

export default hela;
export { toFlags, run, hela };
export { utils, Yaro } from 'yaro';
export { serial, parallel } from '@tunnckocore/p-all';
