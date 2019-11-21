#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { testCoverage } = require('@tunnckocore/utils');

function main() {
  let res = null;

  try {
    res = testCoverage(path.dirname(__dirname));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  fs.writeFileSync(res.packageJsonPath, JSON.stringify(res.pkg, null, 2));
  console.log(res.message);
}

main();
