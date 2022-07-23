import process from 'node:process';
import { yaroParse } from 'yaro-parser';
import { yaroCommand } from 'yaro-command';

import { yaroCreateCli } from '../src/index.js';
import * as commands from './commands.js';

const xaxa = yaroCommand('qux <foo> [...bars]', 'sasass sasa').action(
  (options, foo, bars) => {
    console.log('xaxa linting', { options, foo, bars });
  },
);

const sasa = yaroCommand('gaga [...files]', async (options, files) => {
  console.log('gaga: formatting and linting files', { options, files });
});

await yaroCreateCli(process.argv.slice(2), {
  commands: { xaxa, sasa },
  // rootCommand: yaroCommand('hela', 'Software dev & management')
  //   .option('--cwd', 'Current working directory', process.cwd())
  //   .option('-c, --config', 'Path to configuration file', 'hela.config.js')
  //   .action((globalOptions) => {
  //     console.log('some root!');
  //     // return false;
  //   }),
  name: 'example-node-cli',
  version: '1.1.0',
  exit: process.exit,
  yaroParse,
  yaroCommand,
});
