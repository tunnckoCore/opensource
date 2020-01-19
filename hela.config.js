/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

'use strict';

const fs = require('fs');
const path = require('path');

const { hela, exec } = require('hela');
const dev = require('hela/src/dev');

const config = { ...dev };

config.check = hela()
  .command('check', 'Run lint, test and prettier')
  .action(async (...args) => {
    await dev.lint(...args);
    await dev.test(...args);
    await exec('prettier --write "**/*{.verb,README}.md"');
  });

fs.readdirSync('./commands').forEach((cmdPath) => {
  const inst = require(path.join(__dirname, 'commands', cmdPath));
  exports[inst.currentCommand.rawName] = inst;
});

Object.assign(exports, config);
