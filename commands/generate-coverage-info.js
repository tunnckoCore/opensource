'use strict';

const fs = require('fs');
const path = require('path');
const { testCoverage } = require('@tunnckocore/utils');

module.exports = function main() {
  let res = null;

  try {
    res = testCoverage(path.dirname(__dirname));
  } catch (err) {
    console.error(err.message);
    throw err;
  }

  fs.writeFileSync(res.packageJsonPath, JSON.stringify(res.pkg, null, 2));
  console.log(res.message);
};
