/* eslint-disable import/no-extraneous-dependencies */
const execa = require('execa');
const path = require('path');
const { stripColor } = require('ansi-colors');

const rootDir = path.dirname(__dirname);

const normalize = (output) =>
  output
    .replace(/\(?\d*\.?\d+m?s\)?/g, '')
    .replace(/, estimated/g, '')
    .replace(new RegExp(rootDir, 'g'), '/mocked-path-to-jest-runner-mocha')
    .replace(new RegExp('.*at .*\\n', 'g'), 'mocked-stack-trace')
    .replace(/.*at .*\\n/g, 'mocked-stack-trace')
    .replace(/(mocked-stack-trace)+/, '      at mocked-stack-trace')
    .replace(/\s+\n/g, '\n');

const runJest = (project, options = []) => {
  // eslint-disable-next-line no-undef
  jest.setTimeout(15000);

  return execa(
    'jest',
    [
      '--useStderr',
      '--no-watchman',
      '--no-cache',
      '--projects',
      path.join(rootDir, '__tests__', '__fixtures__', project),
    ].concat(options),
    {
      env: process.env,
      reject: false,
    },
    // eslint-disable-next-line promise/prefer-await-to-then
  ).then(
    ({ stdout, stderr }) =>
      `${stripColor(normalize(stderr))}\n${stripColor(normalize(stdout))}`,
  );
};

module.exports = runJest;
