// SPDX-License-Identifier: MPL-2.0

const UNNAMED_COMMAND_PREFIX = '___UNNAMED_COMMAND-';

export { yaroCreateCli, UNNAMED_COMMAND_PREFIX };
export default yaroCreateCli;

async function yaroCreateCli(argv, config) {
  const cfg = Array.isArray(argv) ? { argv, ...config } : { argv: [], ...argv };

  if (cfg.buildOutput && typeof cfg.buildOutput !== 'function') {
    throw new TypeError('option `buildOutput` should be function when given');
  }
  if (cfg.exit && typeof cfg.exit !== 'function') {
    throw new TypeError('option `exit` should function when given');
  }

  cfg.exit = cfg.exit ?? (() => {});
  cfg.buildOutput = cfg.buildOutput ?? buildOutput;

  const parse = cfg.yaroParse || (cfg.yaro && cfg.yaro.parse) || cfg.yaro;

  if (typeof parse !== 'function') {
    throw new TypeError('requires parser: `cfg.yaroParse` or `cfg.yaro`');
  }

  const parsedInfo = parse(cfg.argv);
  const commands = getCommands(cfg);
  let usg = '';

  if (commands.length === 1) {
    const [_, cmd] = commands[0];
    if (cmd.cli) {
      const { usage, name } = cmd.cli;
      usg = usage.length > 0 ? `${name} ${usage}` : name;
    }

    cfg.name = cfg.name ?? usg ?? _;
  }

  if (parsedInfo.help && commands.length === 1) {
    console.log('$ %s [options]', cfg.name);
    cfg.exit(0);
    return;
  }

  if (parsedInfo.version) {
    console.log(cfg.version ?? '0.0.0');
    cfg.exit(0);
    return;
  }

  let match = findCommand(commands, parsedInfo);

  if (!match && commands.length === 1) {
    match = commands[0];
  }

  const meta = {
    notFound: parsedInfo._.length > 0,
    argv: { ...parsedInfo },
    config: cfg,
    commands: Object.fromEntries(commands),
    entries: commands,
    match,
  };

  if (match) {
    const [_, commandAction] = match;
    try {
      await commandAction(meta.argv);
    } catch (err) {
      const exitCode = err.code && typeof err.code === 'number' ? err.code : 1;
      cfg.buildOutput(meta.argv, {
        ...meta,
        exitCode,
        code: 'ERR_COMMAND_FAILED',
        error: err,
      });
      return;
    }

    return;
  }

  const exitCode = meta.notFound ? 1 : 0;
  const code = meta.notFound ? 'ERR_COMMAND_NOT_FOUND' : 'ERR_NO_ARGUMENTS';
  cfg.buildOutput({ ...parsedInfo }, { ...meta, exitCode, code });
}

function getCommands(cfg) {
  return Object.entries({ ...cfg.commands })
    .filter(([_, cmd]) => typeof cmd === 'function')
    .map(([key, _cmd]) => {
      const cmd = _cmd;
      let kk = key;

      if (cmd.isYaroCommand) {
        if (cmd.cli.name.startsWith(UNNAMED_COMMAND_PREFIX)) {
          cmd.cli.name = kk;
          cmd.cli.args = [];
          cmd.cli.parts = [''];
        } else {
          kk = cmd.cli.name;
        }
      } else if (cfg.yaroCommand) {
        // in case we get just a bare function, treat it like command
        return [kk, cfg.yaroCommand(cmd)];
      }

      return [kk, cmd];
    });
}

function findCommand(commands, parsedInfo) {
  const parsed = parsedInfo;

  return commands.find(([name, cmd]) => {
    if (cmd.isYaroCommand) {
      let matched = false;

      for (const [idx, arg] of parsed._.entries()) {
        if (cmd.cli.aliases.includes(arg)) {
          matched = arg;
          break;
        }

        const tmp = parsed._.slice(0, idx).join(' ');
        matched = cmd.cli.aliases.find((x) => x === tmp) || '';

        if (matched) {
          break;
        }
      }

      if (matched) {
        parsed._ = parsed._.slice(matched.split(' ').length);
        return true;
      }

      const cmdName = parsed._.slice(0, cmd.cli.parts.length).join(' ');

      if (name === cmdName) {
        parsed._ = parsed._.slice(cmd.cli.parts.length);
        return true;
      }

      return false;
    }
    return false;
  });
}

function buildOutput(parsedInfo, meta) {
  // const { exitCode, code, error, notFound, config, entries } = meta;

  const cliName = meta.config.name ?? 'cli';

  if (meta.error) {
    console.error('[%s] %s: %s', cliName, meta.code, meta.error.message);

    console.error('\n$ %s %s [options]\n', cliName, meta.error.cmdUsage);

    console.error('exit code:', meta.exitCode);
    meta.config.exit(1);
    return;
  }

  // if here, the cli isn't passed any arguments,
  // so it's not exactly an error and can output help
  if (!meta.notFound) {
    listCommands(meta.entries, cliName);

    console.log('exit code:', meta.exitCode);
    meta.config.exit(0);
    return;
  }

  console.log(
    '[%s] %s: %s',
    cliName,
    meta.code,
    meta.notFound ? parsedInfo._.join(' ') : undefined,
  );
  console.log('');

  listCommands(meta.entries, cliName);

  console.error('exit code:', meta.exitCode);
  meta.config.exit(meta.exitCode);
}

function listCommands(entries, cliName) {
  // if (entries.length === 1) {
  //   const usg = entries.length === 1 ? '' : ' <command>';
  //   console.log('$ %s%s [options]', cliName, usg);
  //   console.log('');
  //   return;
  // }
  console.log('$ %s <command> [options]', cliName);
  console.log('');

  if (entries.length > 0) {
    console.log('Available commands:');
    for (const [keyName, cmd] of entries) {
      const name = cmd.cli.name.startsWith(UNNAMED_COMMAND_PREFIX)
        ? keyName
        : cmd.cli.name;
      const ali = cmd.cli.aliases.length > 0 ? cmd.cli.aliases : [];
      const hints = ali.length > 0 ? `(aliases: ${ali.join(', ').trim()})` : '';

      console.log('-', name, cmd.cli.usage, hints);
    }
    console.log('');
  }
}
