import process from 'node:process';
import { yaroCreateCli, yaroParse, yaroCommand as command } from 'yaro';
import * as exampleCommands from 'yaro-create-cli/examples/commands.js';

const hela = command('', 'Software development and management.')
  .option('--cwd', 'Current working directory')
  .option('-c, --config', 'Path to config file', 'hela.config.js')
  .action((globalOptions, { matchedCommand }) => {
    // this root command can stay empty;
    // or to merge global and command options, cuz theyare not propagated by default;
    // or if you want to know what command is matched and called;
    console.log('hela root command:', globalOptions);

    // global options always override command options
    return async (opts) => matchedCommand({ ...opts, ...globalOptions });
  });

// console.log(hela);

await yaroCreateCli(process.argv.slice(2), {
  commands: { _: hela, ...exampleCommands },
  name: 'hela',
  version: '6.0.0',
  exit: process.exit,
  yaroParse,
  yaroCommand: command,
});
