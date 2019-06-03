# create-jest-runner

[![Build Status](https://travis-ci.org/jest-community/create-jest-runner.svg?branch=master)](https://travis-ci.org/jest-community/create-jest-runner)

A highly opinionated way for creating Jest Runners

## Install

```bash
yarn add create-jest-runner
```

## Usage

create-jest-runner takes care of handling the appropriate parallelization and creating a worker farm for your runner.

You simply need two files:

* Entry file: Used by Jest as an entrypoint to your runner.
* Run file: Runs once per test file, and it encapsulates the logic of your runner

### 1) Create your entry file

```js
// index.js
const { createJestRunner } = require('create-jest-runner');
module.exports = createJestRunner(require.resolve('./run'));
```

#### createJestRunner(pathToRunFile, config?: { getExtraOptions })

* `pathToRunFile`: path to your run file.
* `config`: Optional argument for configuring the runner.
  * `getExtraOptions`: `() => object` used for passing extra options to the runner. It needs to be a serializable object because it will be send to a different Node process.

### 2) Create your run file

```js
module.exports = options => {};
```

### Run File API

This file should export a function that receives one parameter with the options

#### `options: { testPath, config, globalConfig }`

* `testPath`: Path of the file that is going to be tests
* `config`: Jest Project config used by this file
* `globalConfig`: Jest global config
* `extraOptions`: The return value of the `{ getExtraOptions }` argument of `createJestRunner(...)` the entry file.

You can return one of the following values:

* `testResult`: Needs to be an object of type https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-test-result/src/types.ts#L103-L135
* `Promise<testResult|Error>`: needs to be of above type.
* `Error`: good for reporting system error, not failed tests.

## Example of a runner

This runner "blade-runner" makes sure that these two emojis `⚔️ 🏃` are present in every file

```js
// index.js
const { createJestRunner } = require('create-jest-runner');
module.exports = createJestRunner(require.resolve('./run'));
```

```js
// run.js
const fs = require('fs');
const { pass, fail } = require('create-jest-runner');

module.exports = ({ testPath }) => {
  const start = Date.now();
  const contents = fs.readFileSync(testPath, 'utf8');
  const end = Date.now();

  if (contents.includes('⚔️🏃')) {
    return pass({ start, end, test: { path: testPath } });
  }
  const errorMessage = 'Company policies require ⚔️ 🏃 in every file';
  return fail({
    start,
    end,
    test: { path: testPath, errorMessage, title: 'Check for ⚔️ 🏃' },
  });
};
```

## Create runner from binary

```shell
yarn create jest-runner my-runner

# Or with npm
npm init jest-runner my-runner
```

**Note:** You will have to update the package name in `package.json` of the
generated runner

## Add your runner to Jest config

Once you have your Jest runner you can add it to your Jest config.

In your `package.json`

```json
{
  "jest": {
    "runner": "/path/to/my-runner"
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  runner: '/path/to/my-runner',
};
```

### Run Jest

```bash
yarn jest
```
