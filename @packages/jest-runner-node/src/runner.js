'use strict';

const path = require('path');
const execa = require('execa');
const { pass, fail } = require('@tunnckocore/create-jest-runner');

process.env.NODE_ENV = 'node';

module.exports = async function jestRunnerNode({ testPath, config }) {
  const start = new Date();
  const nodeCmd = process.env.JEST_RUNNER_NODE_CMD;

  const proc = execa.command(`${nodeCmd || `node ${testPath}`}`, {
    env: process.env,
    cwd: nodeCmd ? path.dirname(testPath) : config.cwd,
    stdio: 'inherit',
  });

  const testResults = await new Promise((resolve) => {
    proc
      .then(() => {
        resolve(
          pass({
            start,
            end: new Date(),
            test: {
              title: 'Jest Node.js',
              path: testPath,
            },
          }),
        );
      })
      .catch((err) => {
        const lines = err.message.split('\n');
        const message = lines
          .filter((x) => !x.includes('Command failed'))
          .join('\n')
          .trim();

        // const atLines = lines.filter(
        //   (x) => /at:?\s+/gi.test(x) || x.includes('not ok'),
        // );
        // const msg = atLines.length > 0 ? atLines.join('\n') : message;
        // const notOkLines = lines.filter((x) => x.includes('not ok'));

        resolve(
          fail({
            start,
            end: new Date(),
            test: {
              title: 'Jest Node.js',
              path: testPath,
              errorMessage: message,
            },
          }),
        );
      });
  });

  return testResults;
};
