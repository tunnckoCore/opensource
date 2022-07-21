import process from 'node:process';
import { yaro as yaroParse } from 'yaro-parser';

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
});
