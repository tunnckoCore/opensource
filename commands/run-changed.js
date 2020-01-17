'use strict';

const fs = require('fs');
const path = require('path');

const { hela, exec } = require('hela');
const chalk = require('chalk');
const yaml = require('yaml');

const { log } = console;

const getDiff = async () => {
  const {
    CIRCLE_BRANCH,
    CIRCLE_SHA1,
    CIRCLE_COMPARE_URL,
    GITHUB_SHA,
    GITHUB_BASE_REF,
  } = process.env;
  let baseRef = 'master';
  let range = 'HEAD';

  if (CIRCLE_SHA1) {
    if (CIRCLE_BRANCH === 'master' && CIRCLE_COMPARE_URL) {
      const reCompare = /compare\/([\da-z]+)\.{3}([\da-z]+)$/;
      const [, from] = CIRCLE_COMPARE_URL.match(reCompare);
      baseRef = from || 'master';
    }
    range = `${baseRef}...${CIRCLE_SHA1}`;
  }

  if (GITHUB_SHA) {
    baseRef = GITHUB_BASE_REF || 'master';
    range = `${baseRef}...${GITHUB_SHA}`;
  }

  log(chalk`{blue Comparing ${range}}`);

  const { stdout } = await exec(`git diff ${range} --name-only`);
  return stdout;
};

module.exports = hela()
  .command(
    'run-changed <task>',
    'Run only on changed packages (works with git & pnpm only)',
  )
  .example('run-changed build')
  .example('run-changed test')
  .example('run-changed lint')
  .action(async (task) => {
    const workspace = fs.readFileSync(
      path.join(path.dirname(__dirname), 'pnpm-workspace.yaml'),
      'utf-8',
    );
    const { packages } = yaml.parse(workspace);
    const roots = packages.map((item) => item.split(path.sep)[0]).join('|');
    const rePkg = new RegExp(`(${roots}/([\\w\\-_]+))/?`);
    const diff = await getDiff();
    const filters = diff
      .split('\n')
      .filter(
        (line) =>
          rePkg.test(line) &&
          fs.existsSync(path.join(path.dirname(__dirname), line)),
      )
      .map((line) => {
        const [, directory] = line.match(rePkg);
        return `--filter ./${directory}`;
      });
    const uniqueFilters =
      filters.length > 0 ? [...new Set(filters)] : ['--filter ./packages'];

    if (filters.length === 0) {
      log(chalk`{yellow No individual package changes detected}`);
    }

    log(
      chalk`{blue Executing \`${task}\`} for:\n  ${uniqueFilters.join(
        '\n  ',
      )}\n`,
    );

    const command = `pnpm run ${task} ${uniqueFilters.join(' ')}`;

    try {
      const res = await exec(command, { stdio: 'inherit' });
      log(res);
    } catch (err) {
      log(err);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(err.exitCode || err.code);
    }
  });
