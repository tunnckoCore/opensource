#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { blue, red, green, yellow, magenta } = require('chalk');
const config = require('./config');

const createIfNotExists = folder => {
  if (!fs.existsSync(folder)) {
    console.log(`Creating new jest-runner in ${green(folder)}`);
    fs.mkdirSync(folder);
  } else {
    throw new Error('Folder already exists');
  }
};

const scaffoldRunner = () => {
  try {
    const fixturesPath = path.resolve(__dirname, 'fixtures');
    let outputDirname;
    const projectName = process.argv[2];
    if (projectName) {
      outputDirname = path.resolve('.', projectName);
      createIfNotExists(outputDirname);
    } else {
      throw new Error('Project name not specified');
    }

    config.dirs.forEach(item => {
      console.log(`Creating ${blue('directory')} ${magenta(item)}`);
      fs.mkdirSync(path.resolve(outputDirname, item));
    });

    config.createList.forEach(file => {
      const filePath = path.resolve(outputDirname, file.output);
      const content = fs.readFileSync(path.resolve(fixturesPath, file.input));
      console.log(`Creating ${yellow('file')} ${magenta(file.output)}`);
      fs.writeFileSync(filePath, content);
    });
    console.log(green('Scaffolding successfull'));
    console.log(blue('Run cd npm/yarn install'));
    console.log(red('Update the package name package.json'));
  } catch (e) {
    console.log(`${red('Scaffolding failed')} ${e}`);
  }
};

scaffoldRunner();

module.exports = {
  scaffoldRunner,
};
