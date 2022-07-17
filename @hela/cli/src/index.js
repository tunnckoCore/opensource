// SPDX-License-Identifier: MPL-2.0

import process from 'node:process';
import { hela } from '@hela/core';

import { loadConfig, tryLoadFromPackageJson } from './utils.js';

let prog = hela();

prog
  .option('--cwd', 'some global flag', process.cwd())
  .option('--verbose', 'Print more verbose output', false)
  .option('--show-stack', 'Show more detailed info when errors', false)
  .option('-c, --config', 'Path to config file', {
    default: 'hela.config.js',
    type: 'string',
    normalize: true,
  });

const parsedInfo = prog.parseArgv();

export default async function main() {
  const { flags: argv, defaulted } = parsedInfo;
  // console.log('parsedInfo', parsedInfo);

  const helaConfig = defaulted.config ? tryLoadFromPackageJson(argv) : null;
  const resolved = await loadConfig(helaConfig ?? argv.config, argv, prog);

  const { config: cfg /* , filepath */ } = resolved;
  // if local config file is loaded, or a package from `extends`
  // if (cfg.filepath.includes('node_modules') || cfg.filepath.endsWith('.js')) {
  //   prog.extendWith(cfg.config);
  // }

  // if (cfg.cli && cfg.cli.isHela && cfg.cli.isYaro) {
  //   prog = cfg.cli.mergeInto(prog);
  // } else {
  //   const config = Object.fromEntries(Object.entries(cfg).sort());
  //   const cmds = Object.keys(config);

  //   const lastKey = cmds[cmds.length - 1];
  //   const inst = config[lastKey];
  //   prog = inst.mergeInto(prog);
  // }

  // note: usually due to that they are created with new instance
  const alreadyAdded = new Set(prog.commands.map((x) => x.name));
  const missingCommands = Object.keys(cfg).filter(
    (cmdName) => !alreadyAdded.has(cmdName),
  );

  for (const cmdName of missingCommands) {
    const inst = cfg[cmdName];
    const command = inst.commands[0];

    // note: reference hack
    command.rawName = command.rawName.replace(command.parts[0], cmdName);

    // const parts = command.rawName.split(' ')[1]
    // console.log(command);
    prog = inst.mergeInto(prog, cmdName);
  }

  // console.log(missingCommands);

  return prog.run();
}
