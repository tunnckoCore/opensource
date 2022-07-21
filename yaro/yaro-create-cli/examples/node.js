import process from 'node:process';
import { yaro as yaroParse } from 'yaro-parser';
import { command as yaroCommand } from 'yaro-command';

import { yaroCreateCli } from '../src/index.js';
import * as commands from './commands.js';

await yaroCreateCli(process.argv.slice(2), {
  commands,
  name: 'example-node-cli',
  version: '1.1.0',
  exit: process.exit,
  yaroParse,
  yaroCommand,
});
