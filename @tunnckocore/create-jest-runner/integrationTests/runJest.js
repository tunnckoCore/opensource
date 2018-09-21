// eslint-disable-next-line import/no-extraneous-dependencies
const execa = require('execa');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const normalize = output =>
  output
    .replace(/\(?\d*\.?\d+m?s\)?/g, '')
    .replace(/, estimated/g, '')
    .replace(new RegExp(rootDir, 'g'), '/mocked-path-to-jest-runner-mocha')
    .replace(new RegExp('.*at .*\\n', 'g'), 'mocked-stack-trace')
    .replace(/.*at .*\\n/g, 'mocked-stack-trace')
    .replace(/(mocked-stack-trace)+/, '      at mocked-stack-trace')
    .replace(/\s+\n/g, '\n');

const runJest = (project, options = []) => {
  // eslint-disable-next-line
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  return execa(
    'jest',
    [
      '--useStderr',
      '--no-watchman',
      '--no-cache',
      '--projects',
      path.join(__dirname, '__fixtures__', project),
    ].concat(options),
    {
      env: process.env,
      reject: false,
    },
  ).then(({ stdout, stderr }) => `${normalize(stderr)}\n${normalize(stdout)}`);
};

module.exports = runJest;
