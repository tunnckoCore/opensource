import process from 'node:process';
import { yaroParse } from 'yaro-parser';
import { yaroCommand } from 'yaro-command';

import { yaroCreateCli } from '../src/index.js';

const xaxa = yaroCommand('qux <foo> [...bars]', 'sasass sasa').action(
  (options, foo, bars) => {
    console.log('xaxa linting', { options, foo, bars });
  },
);

const failingCommand = yaroCommand('hoho [ha]', 'some failing cmd', () => {
  throw new Error("some failure in matching command's action");
});

const bar = yaroCommand('<abc> [...qux]', 'sasass sasa').action(
  (options, abc, qux) => {
    console.log('bar linting', { options, abc, qux });
  },
);

const sasa = yaroCommand('gaga [...files]', async (options, files) => {
  console.log('gaga: formatting and linting files', { options, files });
});

const simple = yaroCommand((options) => {
  console.log('simple cmd', { options });
});

await yaroCreateCli(process.argv.slice(2), {
  commands: { xaxa, bar, sasa, simple, failingCommand },
  // rootCommand: yaroCommand('hela', 'Software dev & management')
  //   .option('--cwd', 'Current working directory', process.cwd())
  //   .option('-c, --config', 'Path to configuration file', 'hela.config.js')
  //   .action((globalOptions) => {
  //     console.log('some root!');
  //     // return false;
  //   }),
  name: 'multiple-commands-no-root',
  version: '0.1.0',
  exit: process.exit,
  yaroParse,
  yaroCommand,
});
