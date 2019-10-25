const fs = require('fs');
const { testCoverage } = require('@tunnckocore/utils');

let res = null;

try {
  res = testCoverage(__dirname);
} catch (err) {
  console.error(err.message);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

fs.writeFileSync(res.packageJsonPath, JSON.stringify(res.pkg, null, 2));
console.log(res.message);
