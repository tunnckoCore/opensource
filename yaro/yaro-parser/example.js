/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
// import process from 'node:process';
import mri from 'mri';
import nopt from 'nopt';
import minargs from 'minargs';
import minimist from 'minimist';
// import yargsParser from 'yargs-parser';
import { yaro } from './src/index.js';

/*
  node ./example.js git remote add ens \
    --zaz -vvv -wwHw -f -p ho --snake=bar --some-flag --foo-bar ok \
    --no-barry -xyz --no-bars --foo --joo GG HH JJ --bar \
    --koo=AA BB CC -q EE RR WW -k=1 one two too --qux -c xaxa.config.js \
    -a='-b 123' -u '-d12' -l '"-v13"' -o='-r7at' -r 'qux zaz' \
    -e '--roo sa3re' --tar '-v ./some folder/and.js' \
    --includes a.js,boo.js,qux.js --azzy oh --includes sasa.js,ok.js \
    --includes=ab,ce,dd -- cmd --verbose --dry-run --no-show-stack
 */

function parser(argv, config) {
  const res = { _: [] };
  if (!argv) {
    return res;
  }
  if (!Array.isArray(argv)) {
    throw new TypeError('expects `argv` to be an array');
  }
  const opts = { array: {}, autoCount: true, camelCase: false, ...config };
  const camelcase = opts.camelCase ?? opts.camelcase;

  let arg;
  let prev = {};
  let doubleDashIndex;
  let isShort;
  let isLong;
  let isValue;
  let isNo;
  let isNegate;
  let key;
  let idx;

  const firstFlagIndex = argv.findIndex((x) => x[0] === '-');
  let args = [];

  if (firstFlagIndex === 0) {
    args = argv;
  } else if (firstFlagIndex > 0) {
    args = argv.slice(firstFlagIndex);
    res._.push(...argv.slice(0, firstFlagIndex));
  } else if (firstFlagIndex === -1) {
    args = [];
    res._ = argv;
    return res;
  }

  for (idx = 0; idx < args.length; idx++) {
    arg = args[idx];
    const argLen = arg.length;
    doubleDashIndex = arg[0] === '-' && arg[1] === '-';

    if (argLen === 2 && doubleDashIndex) {
      doubleDashIndex = idx;
      break;
    }

    isShort = argLen > 1 && arg[0] === '-' && arg[1] !== '-';
    isLong = argLen > 2 && doubleDashIndex;

    isValue = !isShort && !isLong;
    isNo = arg[2] === 'n' && arg[3] === 'o' && arg[4] === '-';
    isNegate = isLong && isNo;
    key = null;

    if (isNegate) {
      key = arg.slice(5);
    } else if (isLong) {
      key = arg.slice(2);
    } else if (isShort) {
      key = arg.slice(1);
    }

    const equalsIndex = key && key.indexOf('=');
    const usesEquals = equalsIndex > 0; // -f=a, --foo=bar
    const tmp = key;
    key = usesEquals ? key.slice(0, equalsIndex) : key;

    let value = null;

    if (isNegate) {
      value = false;
    } else if ((isShort || isLong) && !isValue) {
      value = usesEquals ? tmp.slice(equalsIndex + 1) : true;
    } else if (isValue) {
      value = arg;
    }

    // key will be null if it's a value,
    // so we should get the previous flag's key
    if (key && key.indexOf(' ') >= 1) {
      value = arg;
      key = prev.key;
      isValue = true;
    } else {
      key = key === null && isValue && prev.isFlag === true ? prev.key : key;
    }

    if (key && !isValue && camelcase && isLong && key.indexOf('-') > 0) {
      key = key.replace(
        /([a-z])-([a-z])/g,
        (_, p1, p2) => p1 + p2.toUpperCase(),
      );
    }

    const shouldAppend =
      (key === null && isValue && prev.isFlag === false) ||
      (isValue && prev.isFlag && prev.value !== true);

    if (shouldAppend) {
      key = prev.key;
      value = `${prev.value} ${value}`;
    }

    prev = { isFlag: !isValue, key, value };

    if (opts.array[key] && !(key in res)) {
      res[key] = value !== true ? [value] : [];
    } else if (opts.array[key] && key in res) {
      res[key] = value !== true ? res[key].concat(value) : res[key];
    } else if (key !== null) {
      if (isShort && key.length > 1 && !isValue && !usesEquals) {
        for (const ch of key) {
          // if it exists we should try to check if it's `true` bare (no value)
          // or if it has value. if it is true, we make it 2 (number) cuz that's the 2nd occurance
          if (opts.autoCount && ch in res) {
            res[ch] = res[ch] === true ? 2 : res[ch] + 1;
          } else {
            res[ch] = true;
          }
        }
      } else {
        res[key] = value;
      }
    }
  }

  if (typeof doubleDashIndex === 'number') {
    res['--'] = args.slice(doubleDashIndex + 1);
  }

  return res;
}

// console.log(parser(process.argv.slice(2), { includes: true }));

const argv = [
  'git',
  'remote',
  'add',
  'ens',
  '--zaz',
  '-f',
  '--foo=bar',
  '-xyz',
  '--qux',
  '--no-bars',
  '-k=1',
  'bar',
  '-c',
  'xaxa.config.js',
  `-a='-b 123'`, // !! proper way for such edge cases, check `--tar` it's bugged
  '--tar',
  '-v ./some folder/and.js',
  '-x',
  '-d12',
  '--includes',
  'a.js,boo.js,qux.js',
  '--includes',
  'sasa.js,ok.js',
  '--includes=ab,ce,dd',
  '--',
  'cmd',
  '--verbose',
  '--dry-run',
  '--no-show-stack',
];
// console.log('argv:', argv);

// console.log(parser(process.argv.slice(2)));

// console.time('old yaro-parser v5');
// yaro(argv);
// console.timeEnd('old yaro-parser v5');

console.time('yaro v5');
const a = parser(process.argv.slice(2), {
  array: { includes: true },
  // autoCamelCase: false,
  // autoCount: false,
  // camelcase: true,
});
// console.log(parser(process.argv.slice(2), { includes: true }));
console.timeEnd('yaro v5');

// console.time('nopt');
// nopt({}, {}, argv);
// console.timeEnd('nopt');

console.time('mri');
const b = mri(process.argv.slice(2));
console.timeEnd('mri');

// console.time('minargs');
// const c = minargs.minargs(process.argv.slice(2));
// console.timeEnd('minargs');

console.log('yaro:', a);
// console.log('mri', b);
// console.log(c);
// console.time('minimist');
// minimist(argv);
// console.timeEnd('minimist');

// console.time('yargs-parser');
// yargsParser(argv);
// console.timeEnd('yargs-parser');
