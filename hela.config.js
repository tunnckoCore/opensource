'use strict';

const { hela, exec } = require('hela');
const dev = require('hela/dist/dev');

const createPackage = require('./commands/create-package');
const genCovInfo = require('./commands/generate-coverage-info');
const genReadme = require('./commands/root-readme');

const prog = hela();

const config = { ...dev };

config.check = prog
  .command('check', 'Run lint, test and prettier')
  .action(async (...args) => {
    await dev.lint(...args);
    await dev.test(...args);
    await exec('prettier --write "**/*{.verb,README}.md"');
  });

config.new = prog
  .command('new', 'Create new package')
  .alias(['cr', 'create', 'cretae', 'craete', 'gen:pkg'])
  .example('new')
  .example('gen:pkg')
  .example('create')
  .action(createPackage);

config.cov = prog
  .command(
    'gen:cov',
    'Gen coverage info (see pkg.cov), run nyc/istanbul/jest before that',
  )
  .alias(['cov-info', 'gencov', 'cov'])
  .example('gen:cov')
  .example('cov')
  .action(genCovInfo);

config.readme = prog
  .command(
    'gen:readme',
    'Generate monorepo root readme with useful info about each package',
  )
  .example('readme > README.md')
  .example('gen:readme > README.md')
  .alias(['r', 'root-readme', 'genreadme', 'readme'])
  .action(genReadme);

module.exports = config;
