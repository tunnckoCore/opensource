import process from 'node:process';
import { yaroParse } from 'yaro-parser';
import { yaroCommand } from 'yaro-command';

import { yaroCreateCli } from '../src/index.js';

const lint = (options) => {
  console.log('some basic cli app', { options });
};

await yaroCreateCli(process.argv.slice(2), {
  commands: { lint },
  name: 'example-basic-cli',
  version: '1.1.0',
  exit: process.exit,
  yaroParse,
  yaroCommand,
});
