import { createCli, command, rootWithMultipleCommands } from 'yaro';
import * as exampleCommands from 'yaro-create-cli/examples/commands.js';

const hela = command('', 'Software development and management.')
  .option('--cwd', 'Current working directory')
  .option('-c, --config', 'Path to config file', 'hela.config.js')
  .option('--foo', 'Some random flag here', true)
  .action(rootWithMultipleCommands);

const one = command('one <a> [b]', 'Some command here').action((options) => {
  console.log('command: one!!', options);
});

await createCli({
  commands: { ...exampleCommands, one },
  rootCommand: hela,
  name: 'hela',
  version: '6.0.0',
});
