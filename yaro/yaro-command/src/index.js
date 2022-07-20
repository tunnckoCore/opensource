// SPDX-License-Identifier: MPL-2.0

/* eslint-disable no-param-reassign */

import { pipeline, parser, defaults, aliases, coerce, required } from 'yaro';

export { command };
export default function command(usage, settings) {
  if (typeof usage !== 'string') {
    throw new TypeError('cli requires `usage` to be passed and be a string');
  }

  let action = null;

  if (typeof settings === 'function') {
    action = settings;

    settings = {};
  }
  const cfg = { allowUnknown: false, terminate: false, ...settings };
  const meta = {
    defaults: {},
    aliases: {},
    coerces: {},
    required: {},
    flags: {},
  };
  const cli = { settings: cfg, usage, fn: action, meta };

  cli.option = createOptionMethod(cli, cfg);
  cli.action = createActionMethod(cli, cfg);

  return cli;
}

function createOptionMethod(cli /* , settings */) {
  return (rawName, desc, config) => {
    const flag = createOption(rawName, desc, config);

    cli.meta.flags[flag.name] = flag;

    cli.meta.aliases = flag.aliases.reduce((acc, k) => {
      acc[k] =
        flag.aliases.length === 1
          ? flag.aliases
          : flag.aliases.filter((x) => x !== k);

      return acc;
    }, cli.meta.aliases);

    cli.meta.defaults = flag.aliases.reduce((acc, k) => {
      acc[k] = flag.default;
      return acc;
    }, cli.meta.defaults);

    cli.meta.coerces = flag.aliases.reduce((acc, k) => {
      acc[k] = flag.type;
      return acc;
    }, cli.meta.coerces);

    cli.meta.required = flag.aliases.reduce((acc, k) => {
      acc[k] = flag.required;
      return acc;
    }, cli.meta.required);

    return cli;
  };
}

function createOption(rawName, desc, config) {
  let cfg = config;
  if (desc && typeof desc === 'object') {
    cfg = desc;

    desc = cfg.desc || cfg.description || '';
  }
  if (cfg !== null && typeof cfg !== 'object') {
    cfg = { default: cfg };
  }

  cfg = { ...cfg };

  const flag = {
    rawName,
    desc: desc || '',
    default: cfg.default,
    type: cfg.type,
  };

  const names = removeBrackets(rawName)
    .split(',')
    .reduce((acc, v) => {
      let name = v.trim();

      let j;

      // eslint-disable-next-line no-plusplus
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
  flag.aliases = [...new Set(names)];

  if (flag.negated) {
    flag.default = true;
  }

  if (rawName.includes('<')) {
    flag.required = true;
  } else if (rawName.includes('[')) {
    flag.required = false;
  }

  flag.required = cfg.required ?? flag.required;

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

      const argv = pipeline(
        parser(),
        aliases(cli.meta.aliases),
        defaults(cli.meta.defaults, cli.meta.aliases),
        // todo: buggy, better use `required`? seems fixed.
        coerce(cli.meta.coerces),
        required(cli.meta.required, cli.meta.aliases),
      )(parsedFlags);

      const actionArgs = [];
      for (const [index, arg] of args.entries()) {
        if (arg.variadic) {
          actionArgs.push(argv._.slice(index));
        } else {
          actionArgs.push(argv._[index]);
        }
      }

      const { _, ...flagsOptions } = argv;

      return handler.call(null, flagsOptions, ...actionArgs);
    };
  };
}
