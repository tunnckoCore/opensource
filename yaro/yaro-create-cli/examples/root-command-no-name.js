import process from 'node:process';
import { yaroParse } from 'yaro-parser';
import { yaroCommand } from 'yaro-command';
import ipFilter from 'ip-filter';

import { yaroCreateCli } from '../src/index.js';

// const xaxa = yaroCommand('qux <foo> [...bars]', 'sasass sasa').action(
//   (options, foo, bars) => {
//     console.log('xaxa linting', { options, foo, bars });
//   },
// );

const bar = yaroCommand('<abc> [...qux]', 'sasass sasa').action(
  (options, abc, qux) => {
    console.log('bar linting', { options, abc, qux });
    // trying external error
    ipFilter('sasasasa');
  },
);

// const sasa = yaroCommand('gaga [...files]', async (options, files) => {
//   console.log('gaga: formatting and linting files', { options, files });
// });

// const simple = yaroCommand((options, arg) => {
//   console.log('simple cmd', { options });
// });

await yaroCreateCli(process.argv.slice(2), {
  commands: {},
  rootCommand: bar,
  // rootCommand: yaroCommand('hela', 'Software dev & management')
  //   .option('--cwd', 'Current working directory', process.cwd())
  //   .option('-c, --config', 'Path to configuration file', 'hela.config.js')
  //   .action((globalOptions) => {
  //     console.log('some root!');
  //     // return false;
  //   }),
  name: 'root-command-no-name',
  version: '0.1.0',
  exit: process.exit,
  yaroParse,
  yaroCommand,
});
