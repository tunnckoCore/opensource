// import { yaro as yaroParse } from 'https://esm.sh/yaro-parser/src/index.js';
// import { command as yaroCommand } from 'https://esm.sh/yaro-command/src/mod.ts';

// replace with above when you create cli apps
import { yaroParse } from 'yaro-parser';
import { yaroCommand } from '../../yaro-command/src/mod.ts';
import { yaroCreateCli } from '../src/index.js';

const lint = command('gaga [...files]', async (options, files) => {
  console.log('formatting and linting files', { options, files });
});

const create = command('<name> [...files]', async (options, name, files) => {
  console.log('create:', { options, namefiles });
});

const fmt = async (options) => {
  console.log('format command, just a simple function style definition');
  console.log('options:', options);
  await lint(options);
};

await yaroCreateCli(Deno.args, {
  commands: { fmt, lint, create },
  name: 'deno-cli-app',
  version: '1.1.0',
  exit: Deno.exit,
  yaroParse,
  yaroCommand,
});
