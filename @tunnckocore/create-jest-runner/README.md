# create-jest-runner

## Install

```bash
yarn add create-jest-runner
```

## Usage

create-jest-runner takes care of handling the appropriate parallelization and creating a worker farm for your runner.


You simply need two files:
* Entry file: Used by Jest as an entrypoint to your runner.
* Run file: Contains the domain logic of your runner.

### 1) Create your entry file

```js
// index.js
const createRunner = require('create-jest-runner');
module.exports = createRunner('/path/to/run.js')
```

### 2) Create your run file


```js
// run.js
module.exports = (options, workerCallback) => {
 // ... 
}
```

## Run File API

This file should export a function that receives two parameters `(options, workerCallback)`

### `options: { testPath, config, globalConfig }`
  - `testPath`: Path of the file that is going to be tests
  - `config`: Jest Project config used by this file
  - `globalConfig`: Jest global config

### `workerCallback: (error, testResult) => void`
_Use this callback function to report back the results (needs to be called exactly one time)._
  - `error`: Any Javascript error or a string.
  - `testResult`: Needs to be an object of type https://github.com/facebook/jest/blob/master/types/TestResult.js#L131-L157

### Reporting test results

#### Passing test suite
```js
// run.js
module.exports = (options, workerCallback) => {
  if (/* something */) {
    workerCallback(new Error('my message'));
  }
}
```
#### Failing test suite

### Reporting an error
You can report other errors by calling the `workerCallback` with the appropriate error.
```js
// run.js
module.exports = (options, workerCallback) => {
  if (/* something */) {
    workerCallback(new Error('my message'));
  }
}
```




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
}
```

### Run Jest
```bash
yarn jest
```
