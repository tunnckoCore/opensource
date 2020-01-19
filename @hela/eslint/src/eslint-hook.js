'use strict';

const crypto = require('crypto');
const { CLIEngine } = require('eslint');
const { lint } = require('./index');

function doHeavyStuff(item) {
  return crypto
    .createHmac('sha512', `secret-${Date.now()}`)
    .update(new Array(10000).fill(item).join('.'))
    .digest('hex');
}

module.exports = async (ctx, argv) => {
  // const arr = new Array(2000).fill(`something-${Date.now() + Math.random()}`);
  // console.log('heavy stuff for');
  // const res = arr.map((item) => doHeavyStuff(item));
  // console.log('res');
  const report = await lint('files')(
    ctx.file.path,
    // ctx.file.contents.toString(),
    // ctx.file.path,
  );
  // console.log('report', report);
  // if (
  //   report.results.length > 0 &&
  //   report.errorCount === 0 &&
  //   report.warningCount > 0 &&
  //   !argv.warnings
  // ) {
  //   // console.log(
  //   //   `No linting errors found, but there are ${report.warningCount} warnings!`,
  //   // );
  // }
  // const output = argv.warnings
  //   ? report.format(report.results)
  //   : report.format(CLIEngine.getErrorResults(report.results));
  // if (report.errorCount) {
  //   console.error(output);
  //   // proc.exit(1);
  // }
};
