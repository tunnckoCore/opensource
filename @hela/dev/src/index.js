import fs from 'fs';
import path from 'path';

import { hela, exec, toFlags } from '@hela/core';

const prog = hela();

export const build = createCommand('build', 'Build output files, using Babel');
export const bundle = createCommand('bundle', 'Bundle, using Rollup');
export const docs = createCommand('docs', 'Generate API docs, with Docks');
export const lint = createCommand('lint', 'Lint files, using ESLint+Prettier');
export const test = createCommand('test', 'Test files, using Jest');

function createCommand(name, description) {
  return prog
    .command(name, description)
    .option('-a, --all', 'Run on all packages.', true)
    .option('-e, --exclude', 'Ignore pattern string.')
    .option(
      '-m, --testPathPattern',
      'A regexp pattern string that is matched against all tests paths before executing the test.',
    )
    .option(
      '-t, --testNamePattern,',
      'Run only tests with a name that matches the regex pattern',
    )
    .option('-o, --onlyChanged', 'Run only on changed packages', false)
    .action(async (argv) => {
      const opts = { ...argv };
      opts.o = !opts.all;
      opts.onlyChanged = !opts.all;

      const ignores = opts.exclude;

      // remove custom ones, because Jest fails
      delete opts.a;
      delete opts.m;
      delete opts.e;
      delete opts.exclude;

      const flags = toFlags(opts);

      const configDir = path.join(__dirname, 'configs', name);
      const configPath = path.join(configDir, 'config.js');

      // eslint-disable-next-line import/no-dynamic-require, global-require
      const createConfig = require(configDir);

      const config = createConfig({ ...opts, ignores });
      const contents = `module.exports=${JSON.stringify(config)}`;

      fs.writeFileSync(configPath, contents);

      // eslint-disable-next-line global-require
      console.log('Jest', require('jest/package.json').version);

      return exec(`jest -c ${configPath} ${flags}`, {
        stdio: 'inherit',
      });
    });
}
