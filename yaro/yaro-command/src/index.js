// SPDX-License-Identifier: MPL-2.0

import { yaro as yaroParser } from 'yaro-parser';

export { command };
export default function command(usage, settings) {
  if (typeof usage !== 'string') {
    throw new TypeError('cli requires `usage` to be passed and be a string');
  }

  let action = null;

  if (typeof settings === 'function') {
    action = settings;
    // eslint-disable-next-line no-param-reassign
    settings = {};
  }
  const cfg = { allowUnknown: false, terminate: false, ...settings };
  const cli = { settings: cfg, usage, fn: action, options: [] };

  cli.option = createOptionMethod(cli, cfg);
  cli.action = createActionMethod(cli, cfg);

  return cli;
}

function createOptionMethod(cli /* , settings */) {
  return (rawName, desc, config) => {
    cli.options.push(createOption(rawName, desc, config));

    return cli;
  };
}

function createOption(rawName, desc, config) {
  let cfg = config;
  if (desc && typeof desc === 'object') {
    cfg = desc;
    // eslint-disable-next-line no-param-reassign
    desc = cfg.desc || cfg.description || '';
  }
  if (cfg && typeof cfg !== 'object') {
    cfg = { default: cfg };
  }

  const flag = {
    rawName,
    desc: desc || '',
    negated: false,
  };
  flag.default = cfg?.default;
  flag.type = cfg?.type;

  const names = removeBrackets(rawName)
    .split(',')
    .reduce((acc, v) => {
      let name = v.trim();

      let j;

      for (j = 0; j < name.length; j++) {
        if (name.codePointAt(j) !== 45) break; // "-"
      }

      if (j === 1) {
        name = name.slice(1);
        return acc.concat(name, camelcase(name));
      }

      if (name.slice(j, j + 3) === 'no-') {
        flag.negated = true;
        name = name.slice(j + 3);
      } else {
        name = name.slice(j);
      }

      return acc.concat(name, camelcase(name));
    }, [])
    .sort((a, b) => (a.length > b.length ? 1 : -1)); // Sort names

  // Use the longest name (last one) as actual option name
  flag.name = names[names.length - 1];
  flag.name = flag.name.includes('-') ? names[names.length - 2] : flag.name;
  flag.names = [...new Set(names)];

  if (flag.negated) {
    flag.default = true;
  }

  if (rawName.includes('<')) {
    flag.required = true;
  } else if (rawName.includes('[')) {
    flag.required = false;
  }

  return flag;
}

function removeBrackets(v) {
  return v.replace(/[<[].+/, '').trim();
}

function camelcase(input) {
  return input.replace(
    /([a-z])-([a-z])/g,
    (_, p1, p2) => p1 + p2.toUpperCase(),
  );
}

function findAllBrackets(v) {
  const ANGLED_BRACKET_RE_GLOBAL = /<([^>]+)>/g;
  const SQUARE_BRACKET_RE_GLOBAL = /\[([^\]]+)]/g;

  const res = [];

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const parseMatch = (match) => {
    let variadic = false;
    let value = match[1];
    if (value.startsWith('...')) {
      value = value.slice(3);
      variadic = true;
    }

    return {
      required: match[0].startsWith('<'),
      name: value,
      variadic,
    };
  };

  let angledMatch;
  // eslint-disable-next-line no-cond-assign
  while ((angledMatch = ANGLED_BRACKET_RE_GLOBAL.exec(v))) {
    res.push(parseMatch(angledMatch));
  }

  let squareMatch;
  // eslint-disable-next-line no-cond-assign
  while ((squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v))) {
    res.push(parseMatch(squareMatch));
  }

  return res;
}

function createActionMethod(cli) {
  return (handler) => {
    if (!cli.fn && typeof handler !== 'function') {
      throw new TypeError('cli do not have action handler function');
    }

    return async (parsedFlags) => {
      const args = findAllBrackets(cli.usage);

      // in "single command mode" (i.e. in cli's bin),
      // you can pass just the process.argv
      // or if you use the command in hela-based app, it works too
      const flags = Array.isArray(parsedFlags)
        ? yaroParser(parsedFlags) // todo: cli.options to be passed to `yaro-plugins`
        : parsedFlags;

      const actionArgs = [];
      for (const [index, arg] of args.entries()) {
        if (arg.variadic) {
          actionArgs.push(flags._.slice(index));
        } else {
          actionArgs.push(flags._[index]);
        }
      }

      // todo: above todo
      console.log('cli.options', cli.options);

      return handler.call(null, flags, ...actionArgs);
    };
  };
}

// export const xaxa = command('[...files] [options]')
//   .option()
//   .option()
//   .action(() => {});

// export const fmt = command('[...files]', 'format with prettier', {
//   default: ['src/*.js'],
//   required: true,
// })
//   .option()
//   .option();

// export const build = createCli('[...files]')
//   .option('-x', 'some arr', { type: 'array' })
//   .option('-c, --count [num]', { type: 'number' })
//   .option('-s, --show-stack', 'cmael cased option')
//   .option('-f, --force', 'some boolean option')
//   .option('-n, --name-sake [pkg]', 'some option with optional value')
//   .option('-p, --patterns <...foo>', 'option with required value')
//   .action((flags, src, dist) => {});

// export const lint = (flags, patterns) => {};

// const argv = parse(process.argv.slice(2));

// let commandParts = null;
// let commandArgs = null;
// let commandOptions = null;

// if (argv['--']) {
//   const commandOptionsStart = argv['--'].findIndex((x) => x[0] === '-');
//   commandParts = commandOptionsStart
//     ? argv['--'].slice(0, commandOptionsStart).join(' ')
//     : argv['--'];
//   commandArgs = argv['--'].slice(commandOptionsStart);
//   commandOptions = parse(commandArgs);
// }

// console.log('global options:', argv);
// console.log('command:', commandParts);
// // console.log(commandArgs);
// console.log('cmd options:', commandOptions);
