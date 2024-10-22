const { parseHeader } = require('./dist/index.cjs');

const str = 'fix: some commit message';

console.log(str, parseHeader(str));
