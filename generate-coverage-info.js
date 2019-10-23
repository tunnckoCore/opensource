/* eslint-disable no-param-reassign */
const fs = require('fs');
const cheerio = require('cheerio');
const pkg = require('./package.json');

const LOCV_REPORT = './coverage/lcov-report/index.html';

if (!fs.existsSync(LOCV_REPORT)) {
  console.error('Run tests with coverage. Missing coverage report');
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

const lcovInfo = fs.readFileSync('./coverage/lcov-report/index.html', 'utf8');
const $ = cheerio.load(lcovInfo);

const files = {};

$('tr').each(function sasa(i, item) {
  const filepath = $('.file', item).text();
  const [statements, branches, functions, lines] = $('.pct', item)
    .text()
    .split('%');

  if (filepath === 'File') {
    return;
  }

  files[filepath] = {
    statements: Number(statements),
    branches: Number(branches),
    functions: Number(functions),
    lines: Number(lines),
  };
});

const jestCov = Object.keys(files).reduce((acc, file) => {
  let value = files[file];
  const [ws, folderName] = file.split('/');
  const pkgRoot = `${ws}/${folderName}`;

  const res = Object.keys(files)
    .filter((key) => key.startsWith(pkgRoot))
    .map((filename) => files[filename]);

  if (res.length > 1) {
    value = res.reduce(
      (accumulator, item) => {
        accumulator.statements += item.statements / res.length;
        accumulator.branches += item.branches / res.length;
        accumulator.functions += item.functions / res.length;
        accumulator.lines += item.lines / res.length;

        return accumulator;
      },
      { statements: 0, branches: 0, functions: 0, lines: 0 },
    );
  }

  const cov = Object.keys(value).reduce(
    (accum, typeName) => accum + value[typeName],
    0,
  );

  acc[pkgRoot] = Number((cov / 4).toFixed(2));
  return acc;
}, {});

fs.writeFileSync(
  './package.json',
  JSON.stringify({ ...pkg, jestCov }, null, 2),
);
