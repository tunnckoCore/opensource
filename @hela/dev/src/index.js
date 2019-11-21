import fs from 'fs';
import path from 'path';

import { hela, exec, toFlags } from '@hela/core';

const prog = hela();

export const build = createCommand('build', 'Build output files, using Babel');
export const bundle = createCommand('bundle', 'Bundle, using Rollup');
export const docs = createCommand('docs', 'Generate API docs, with Docks');
export const lint = createCommand('lint', 'Lint files, using ESLint+Prettier', {
  alias: ['l', 'lnt', 'lnit'],
});
export const test = createCommand('test', 'Test files, using Jest', {
  alias: ['t', 'tst', 'tset'],
});

export const format = prog
  .command('format', 'Format running Prettier', { alias: ['fmt'] })
  .option('-I, --input', 'Input patterns for Prettier, default "**/*".', '**/*')
  .action((argv) =>
    exec(`prettier ${argv.input} --write`, { stdio: 'inherit' }),
  );

export const runAll = prog
  .command('runAll', 'Run all commands in series', { alias: ['ra', 'runall'] })
  .option('--bundle', 'Run `bundle` instead of `build`.', false)
  .option('--docs', 'Run `docs` after all.', false)
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
  .action(async (argv) =>
    [lint, test, argv.bundle ? bundle : build, argv.docs ? docs : null]
      .filter(Boolean)
      .reduce(
        // eslint-disable-next-line promise/prefer-await-to-then
        (acc, cmd) => acc.then(() => cmd(argv)),
        Promise.resolve(),
      ),
  );

function createCommand(name, description) {
  return prog
    .command(name, description)
    .option('-a, --all', 'Run on all packages.', true)
    .option('-e, --exclude', 'Ignore pattern string.')
    .option(
      '-I, --input',
      'Input patterns for the "lint" command, defaults to src and testing dirs.',
    )
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
      // switch the env set by default when running Jest. For ensurance.
      process.env.NODE_ENV = name;

      const opts = { ...argv };
      opts.o = !opts.all;
      opts.onlyChanged = !opts.all;

      const ignores = opts.exclude;
      const inputs = opts.input;

      // remove custom ones, because Jest fails
      [
        'a',
        'm',
        'e',
        'o',
        'I',
        'input',
        'exclude',
        'bundle',
        'docs',
        'cwd',
      ].forEach((key) => {
        delete opts[key];
      });

      const flags = toFlags(opts, { allowCamelCase: true });

      const configDir = path.join(__dirname, 'configs', name);
      const configPath = path.join(configDir, 'config.js');

      // const createConfig = require(configDir);
      const { default: createConfig } = await import(configDir);

      const config = createConfig({ ...opts, ignores, input: inputs });
      const contents = `module.exports=${JSON.stringify(config)}`;

      fs.writeFileSync(configPath, contents);

      // eslint-disable-next-line global-require
      console.log('Jest', require('jest/package.json').version);

      console.log(`jest -c ${configPath} ${flags}`);

      return exec(`jest -c ${configPath} ${flags}`, { stdio: 'inherit' });
    });
}
