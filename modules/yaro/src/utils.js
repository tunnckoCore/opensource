// SPDX-License-Identifier: MPL-2.0

export function findAllBrackets(v) {
  const ANGLED_BRACKET_RE_GLOBAL = /<([^>]+)>/g;
  const SQUARE_BRACKET_RE_GLOBAL = /\[([^\]]+)]/g;

  const res = [];

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const parse = (match) => {
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
    res.push(parse(angledMatch));
  }

  let squareMatch;
  // eslint-disable-next-line no-cond-assign
  while ((squareMatch = SQUARE_BRACKET_RE_GLOBAL.exec(v))) {
    res.push(parse(squareMatch));
  }

  return res;
}

export function removeBrackets(v) {
  return v.replace(/[<[].+/, '').trim();
}

export function camelcase(input) {
  return input.replace(
    /([a-z])-([a-z])/g,
    (_, p1, p2) => p1 + p2.toUpperCase(),
  );
}

export function camelcaseOptionName(name) {
  // Camelcase the option name
  // Don't camelcase anything after the dot `.`
  return name
    .split('.')
    .map((v, i) => (i === 0 ? camelcase(v) : v))
    .join('.');
}

export function normalizeFlags(flags, yargsConfig = {}, settings = {}) {
  return flags.reduce(
    (acc, x) => {
      // we do manual type checking through the `coerce` method
      // if the setting is passed, we define `opts[type].flag = []`
      // thus Yargs parser will skip the coercing part and will just cast.
      if (settings.allowInvalidOptionType && x.config.type) {
        acc[x.config.type] = acc[x.config.type] || [];
        acc[x.config.type].push(...x.names);
      }

      handleCoerce(acc, x);

      if (x.config.normalize === true) {
        acc.normalize = [acc.normalize].flat().filter(Boolean);
        acc.normalize.push(...x.names);
      }

      if (x.names.length > 1) {
        acc.alias = { ...acc.alias };
        acc.alias[x.name] = x.names;
      }

      // do not default boolean ones to `false`,
      // because they are undefined by default anyway
      // and when passed they are true.
      // yargs-parser bugs when you default a boolean to false
      if (typeof x.config.default !== 'undefined') {
        acc.default = { ...acc.default };
        acc.default[x.name] = x.config.default;
      }

      if (x.config.narg) {
        acc.narg = { ...acc.narg };
        acc.narg[x.name] = x.config.narg;
      }

      return acc;
    },
    {
      configuration: {
        'populate--': true,
        ...yargsConfig,
      },
    },
  );
}

function handleCoerce(acc, flag) {
  if (!flag.config.coerce && flag.config.type) {
    // eslint-disable-next-line no-param-reassign
    flag.config.coerce = (arg) => {
      // eslint-disable-next-line valid-typeof
      if (typeof arg !== flag.config.type) {
        throw new TypeError(
          `yaro: Option "${flag.name}" must be of type "${flag.config.type}"`,
        );
      }

      // manual casting instead of using opts.string, opts.boolean, etc
      // we do not handle array casting or other
      if (flag.config.type === 'string') {
        return String(arg);
      }
      if (flag.config.type === 'boolean') {
        return Boolean(arg);
      }
      if (flag.config.type === 'number') {
        const ret = Number.parseInt(arg, 10);

        if (Number.isNaN(ret)) {
          throw new TypeError(
            `yaro: Option "${flag.name}" is passed non number value`,
          );
        }

        return ret;
      }

      return arg;
    };
  }

  if (flag.config.coerce) {
    acc.coerce = { ...acc.coerce };
    acc.coerce[flag.name] = flag.config.coerce;
  }
}

export function buildHelpOutput(cli, match, details) {
  if (!match) {
    if (cli.settings.singleMode) {
      const command = cli.commands[0];
      console.log(command.rawName, '->', command.description);
    } else {
      console.log(
        'GLOBAL HELP!',
        cli.commands
          .map((cmd) => !cmd.config.hidden && cmd.rawName)
          .filter(Boolean),
      );
    }
    return;
  }

  if (match.command.config.hidden && match.command.options.help) {
    const matchedCommandName = match.command.name;
    const p = [matchedCommandName, ...match.args];

    console.log('%s %s <command> [options]', cli.cliName, p.join(' '));

    cli.commands
      .filter((x) => !x.config.hidden && x.rawName.startsWith(p.join(' ')))
      .map((cmd) => console.log('-', cmd.rawName, '->', cmd.description));
  } else {
    const { command: cmd } = match;
    console.log('%s %s', cli.cliName, cmd.rawName);
    console.log('-', cmd.rawName, '->', cmd.description);
  }
}
