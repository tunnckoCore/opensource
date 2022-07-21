// SPDX-License-Identifier: MPL-2.0

/* eslint-disable no-param-reassign */

import { pipeline, parser, defaults, aliases, coerce, required } from 'yaro';

let unnamedCommandsCount = 0;
export const UNNAMED_COMMAND_PREFIX = '___UNNAMED_COMMAND-';

export { command };
export default function command(usage, settings, action) {
  if (typeof usage === 'function') {
    action = usage;
    usage = '';
  }
  if (typeof usage !== 'string') {
    throw new TypeError('cli requires `usage` to be passed and be a string');
  }

  if (typeof settings === 'function') {
    action = settings;

    settings = {};
  }
  const cfg = { ...settings };
  const meta = {
    defaults: {},
    aliases: {},
    coerces: {},
    required: {},
    flags: {},
    ...cfg.meta,
  };
  const cli = { settings: cfg, usage, meta, aliases: [] };

  cli.alias = (...names) => {
    cli.aliases.push(...names.flat());
    return cli;
  };

  cli.option = createOptionMethod(cli, cfg);
  cli.action = createActionMethod(cli, cfg);

  if (typeof action === 'function') {
    return cli.action(action);
  }

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

export function removeBrackets(v) {
  return v.replace(/[<[].+/, '').trim();
}

function camelcase(input) {
  return input.replace(
    /([a-z])-([a-z])/g,
    (_, p1, p2) => p1 + p2.toUpperCase(),
  );
}

export function findAllBrackets(v) {
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

    const commandHandler = cli.fn || handler;

    cli.name = removeBrackets(cli.usage);
    cli.args = findAllBrackets(cli.usage);
    cli.parts = cli.name.split(' ');
    cli.usage = cli.usage.slice(cli.name.length).trim();

    if (cli.name.length === 0) {
      unnamedCommandsCount += 1;
      cli.name = String(UNNAMED_COMMAND_PREFIX + unnamedCommandsCount);
    }

    commandAction.isYaroCommand = true;
    commandAction.cli = cli;
    commandHandler.isYaroCommand = true;
    commandHandler.cli = cli;

    return commandAction;

    async function commandAction(parsedFlags, ...argz) {
      const argv = pipeline(
        // run parser only if when we are given process.argv array
        Array.isArray(parsedFlags) && parser(),
        aliases(cli.meta.aliases), // aliases always first
        defaults(cli.meta.defaults, cli.meta.aliases),
        // todo: buggy, better use `required`? seems fixed.
        coerce(cli.meta.coerces), // casting should be before `required`
        required(cli.meta.required, cli.meta.aliases),
      )(parsedFlags);

      const { _: positionals, ...flags } = argv;

      // if we are passed another arguments,
      // then this is called manually by the user
      // so it will be passed the needed/correct arguments
      // otherwise it is called by a runner/cli
      if (argz.length > 0) {
        return commandHandler.call(null, flags, ...argz);
      }

      const actionArgs = [];
      for (const [index, arg] of cli.args.entries()) {
        const value = arg.variadic
          ? positionals.slice(index)
          : positionals[index];

        if (arg.required && !value) {
          const cmdUsage = `${cli.name} ${cli.usage}`;
          const err = new Error(
            `missing required argument "${arg.name}" from "${cli.usage}" command`,
          );
          err.cmdUsage = cmdUsage;
          throw err;
        }

        actionArgs.push(value);
      }

      return commandHandler.call(null, flags, ...actionArgs);
    }
  };
}
