#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { prompt } = require('enquirer');

const answers = {
  license: 'MPL-2.0',
  licenseStart: new Date().getFullYear(),
  keywords: [
    'tunnckocorehq',
    'tunnckocore-oss',
    'hela',
    'development',
    'developer-experience',
    'dx',
  ],
};

function onSubmit(name, value) {
  if (name === 'keywords') {
    const kws = typeof value === 'string' ? value.split(',') : [];
    const val = answers.keywords.concat(kws).filter(Boolean);
    answers[name] = val;

    return val;
  }

  answers[name] = value;
  return value;
}

async function main() {
  await prompt([
    {
      message: 'Name of the package?',
      type: 'input',
      name: 'name',
      onSubmit,
    },
    {
      message: 'Desciption the package?',
      type: 'input',
      name: 'description',
      initial: 'WIP',
      onSubmit,
    },
    {
      message: 'Package version',
      type: 'input',
      initial: '0.1.0',
      name: 'version',
      validate(value, state, item) {
        if (item && item.name === 'version' && !semver.valid(value)) {
          return prompt.styles.danger('version should be a valid semver value');
        }
        return true;
      },
      onSubmit,
    },
    {
      message: 'Is it scoped?',
      type: 'toggle',
      name: 'scoped',
      enabled: 'Yes',
      disabled: 'No',
      onSubmit,
    },
    {
      message: 'What is the scope?',
      type: 'autocomplete',
      name: 'scope',
      choices: ['@tunnckocore', '@hela'],
      onSubmit,
      skip() {
        if (!answers.scoped) {
          answers.location = `packages/${answers.name}`;
          return true;
        }

        return false;
      },
      result(value) {
        if (answers.scoped) {
          if (/config|preset/.test(answers.name)) {
            answers.location = `configs/${answers.name}`;
          } else {
            answers.location = `${value}/${answers.name}`;
          }
          answers.name = `${value}/${answers.name}`;
          answers.scope = value;
        }
      },
    },
    {
      type: 'select',
      name: 'publishType',
      message: 'What type of publishing?',
      choices: ['build', 'bundle', 'source'],
      initial: 0,
      onSubmit,
      result(value) {
        answers.publishType = value;
      },
    },
    {
      type: 'input',
      name: 'licenseStart',
      message: 'When the package is first published?',
      initial: answers.licenseStart,
      onSubmit,
    },
    {
      type: 'autocomplete',
      name: 'license',
      message: 'What is the license of the package?',
      initial: 0,
      choices: ['Parity-7.0.0', 'Prosperity-3.0.0', 'MPL-2.0', 'Apache-2.0'],
    },
    {
      type: 'list',
      name: 'keywords',
      initial: answers.keywords,
      message: 'Type comma-separated keywords',
      onSubmit,
    },
  ]);

  const pkg = createPkgJson();
  const monoRoot = path.dirname(__dirname);

  const srcDir = path.join(monoRoot, answers.location, 'src');
  const testDir = path.join(monoRoot, answers.location, 'test');

  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(testDir, { recursive: true });

  const pkgFile = JSON.stringify(pkg, null, 2);
  const srcFile =
    answers.publishType === 'source'
      ? `module.exports = () => {};\n`
      : `export default () => {};\n`;

  const baseLine =
    answers.publishType === 'source'
      ? "const mod = require('../src')"
      : "import mod from '../src'";

  const testFile = `${baseLine};

test('todo tests for ${answers.name} package', async () => {
  expect(typeof mod).toStrictEqual('function');
});
`;

  fs.writeFileSync(path.join(srcDir, 'index.js'), srcFile);
  fs.writeFileSync(path.join(testDir, 'index.js'), testFile);

  const pkgPath = path.join(monoRoot, answers.location, 'package.json');
  fs.writeFileSync(pkgPath, pkgFile);
}

function createPkgJson() {
  const { publishType: type } = answers;

  let mainField = type === 'build' ? 'dist/main/index.js' : null;
  mainField = mainField || (type === 'bundle' ? 'dist/cjs/index.js' : null);
  mainField = mainField || (type === 'source' ? 'src/index.js' : mainField);

  let modField = type === 'build' ? 'dist/module/index.js' : null;
  modField = modField || (type === 'bundle' ? 'dist/esm/index.js' : null);
  modField = modField || (type === 'source' ? 'src/index.js' : modField);

  let typingsField = null;
  if (type === 'build' || type === 'bundle') {
    typingsField = 'dist/typings/index.d.ts';
  }
  if (!typingsField) {
    typingsField = type === 'source' ? 'src/index.d.ts' : typingsField;
  }

  return {
    name: answers.name,
    version: answers.version,
    description: answers.description,
    repository: {
      type: 'git',
      url: 'https://github.com/tunnckoCore/opensource.git',
      directory: answers.location,
    },
    homepage: `https://tunnckocore.com/opensource`,
    author: `Charlike Mike Reagent <opensource@tunnckocore.com> (https://tunnckocore.com)`,
    license: answers.license,
    engines: {
      node: '>=10.13',
    },
    main: mainField,
    module: modField,
    typings: typingsField,
    files: [/build|bundle/.test(answers.publishType) ? 'dist' : 'src'],
    keywords: answers.keywords,
    scripts: {},
    publishConfig: {
      access: 'public',
      tag: 'latest',
    },
    jest: {
      coverageThreshold: {
        'src/**/*.js': {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
    cov: {
      color: 'grey',
    },
    licenseStart: parseInt(answers.licenseStart, 10),
    verb: {
      readme: '../../readme-template.md',
      run: true,
      toc: {
        render: true,
        method: 'preWrite',
        maxdepth: 4,
      },
      layout: 'empty',
      tasks: ['readme'],
      lint: {
        reflinks: true,
      },
      reflinks: [],
      related: {
        list: [],
      },
    },
  };
}

(async () => {
  try {
    await main();
  } catch (err) {
    process.exit(1);
  }
})();
