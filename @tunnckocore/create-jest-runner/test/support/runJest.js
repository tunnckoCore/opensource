/* eslint-disable import/no-extraneous-dependencies */
const execa = require('execa');
const path = require('path');
const { stripColor } = require('ansi-colors');

const rootDir = path.dirname(path.dirname(__dirname));

function normalize(output) {
  return output
    .replace(/\(?\d*\.?\d+m?s\)?/g, '')
    .replace(/, estimated/g, '')
    .replace(new RegExp(rootDir, 'g'), '/mocked-path-to-jest-runner-mocha')
    .replace(new RegExp('.*at .*\\n', 'g'), 'mocked-stack-trace')
    .replace(/.*at .*\\n/g, 'mocked-stack-trace')
    .replace(/(mocked-stack-trace)+/, '      at mocked-stack-trace')
    .replace(/\s+\n/g, '\n');
}

module.exports = function runJest(project, options = []) {
  // eslint-disable-next-line no-undef
  jest.setTimeout(15000);

  return execa(
    'jest',
    [
      '--useStderr',
      '--no-watchman',
      '--no-cache',
      '--projects',
      path.join(path.dirname(__dirname), 'fixtures', project),
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
