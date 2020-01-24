'use strict';

const fs = require('fs');
const path = require('path');
const { testCoverage } = require('@tunnckocore/utils');

module.exports = require('hela')()
  .command(
    'gen:cov',
    'Gen coverage info (see pkg.cov), run nyc/istanbul/jest before that',
  )
  .alias(['cov-info', 'gencov', 'cov'])
  .example('gen:cov')
  .example('cov')
  .action(function main() {
    let res = null;

    try {
      res = testCoverage(path.dirname(__dirname));
    } catch (err) {
      console.error(err.message);
      throw err;
    }

    const jsonStr = JSON.stringify(res.pkg, null, 2);
    fs.writeFileSync(res.packageJsonPath, `${jsonStr}\n`);
    console.log(res.message);
  });
