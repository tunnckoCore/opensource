// SPDX-License-Identifier: MPL-2.0

/* eslint-disable no-param-reassign */

import { buildOutput } from './utils.js';

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
  const { rootCommand, entries } = getCommands(cfg);
  const cliInfo = getCliInfo(rootCommand, entries, cfg);

  if (parsedInfo.version) {
    console.log(cliInfo.version);
    cfg.exit(0);
    return;
  }

  const meta = {
    config: cfg,
    cliInfo: { ...cliInfo },
    argv: { ...parsedInfo },
    rootCommand,
    commands: Object.fromEntries(entries),
    entries,
  };

  if (parsedInfo.help) {
    await cfg.buildOutput(meta.argv, meta, { isHelp: true });
    return;
  }

  if (rootCommand && meta.entries.length === 0) {
    await tryCatch('ERR_ROOT_COMMAND_FAILED', meta, rootCommand);
    return;
  }

  const matchedCommand = findMatchCommand(meta.entries, meta);
  if (!matchedCommand) {
    const noCommandSpecified = meta.argv._.length === 0;
    const commandNotFound = noCommandSpecified === false;

    await cfg.buildOutput(meta.argv, meta, {
      noCommandSpecified,
      commandNotFound,
      exitCode: 1,
    });
    return;
  }

  if (rootCommand) {
    const rootReturn = await tryCatch('ERR_ROOT_FAILURE', meta, rootCommand);
    if (typeof rootReturn === 'function') {
      const handler = () => rootReturn({ ...meta, matchedCommand });
      meta.matchedCommand = matchedCommand;
      await tryCatch('ERR_MATCHED_COMMAND_FAILURE', meta, handler);
      return;
    }

    const code = 'ERR_UNKNOWN_STATE';
    console.error(
      '%s: expects `rootCommand` to return a function which calls `{ matchedCommand }` which is passed as argument',
      code,
    );
    await cfg.buildOutput(meta.argv, meta, { isHelp: true, exitCode: 1 });
    return;
  }

  await tryCatch('ERR_COMMAND_FAILED', meta, matchedCommand);
}

function getCommands(cfg) {
  const cmds = { ...cfg.commands };
  let commands = Object.entries(cmds);
  let rootCmd = null;

  if (typeof cfg.rootCommand === 'function') {
    rootCmd = cfg.rootCommand;
  }

  if (!rootCmd) {
    const allDef = Object.keys(cmds).length;
    rootCmd = allDef === 1 ? (commands[0] ? commands[0][1] : null) : null;
    commands = allDef === 1 ? [] : commands;
  }

  const rootCommand = typeof rootCmd === 'function' ? rootCmd : null;

  if (rootCommand && rootCommand.cli) {
    const { name: n } = rootCommand.cli;
    rootCommand.cli.name = n.startsWith(UNNAMED_COMMAND_PREFIX) ? '_' : n;
  }

  const entries = commands
    .filter(([_, cmd]) => cmd.isYaroCommand || typeof cmd === 'function')
    .map(([key, _cmd]) => {
      const cmd = _cmd;
      let kk = key;

      if (cmd.isYaroCommand) {
        if (cmd.cli.name.startsWith(UNNAMED_COMMAND_PREFIX)) {
          cmd.cli.name = kk;
          cmd.cli.parts = [''];
        } else {
          kk = cmd.cli.name;
        }
      }

      if (!cmd.isYaroCommand && typeof cmd === 'function' && cfg.yaroCommand) {
        // in case we get just a bare function, treat it like command
        return [kk, cfg.yaroCommand(cmd)];
      }

      return [kk, cmd];
    });

  return { rootCommand, entries };
}

function getCliInfo(rootCommand, commands, cfg) {
  const version = cfg.version || '0.0.0';

  if (rootCommand && rootCommand.cli) {
    const { name, usage } = rootCommand.cli;
    const n = name === '_' ? cfg.name ?? 'cli' : name;

    return { name: n, usage, helpLine: `${n} ${usage}`.trim(), version };
  }

  const name = cfg.name || 'cli';
  const usage = commands.length > 0 ? '<command>' : '';
  return { name, usage, helpLine: `${name} ${usage}`.trim(), version };
}

async function tryCatch(code, meta, fn) {
  let result = null;
  try {
    result = await fn(meta.argv);
  } catch (err) {
    const exitCode = err.code && typeof err.code === 'number' ? err.code : 1;
    err.code = code;
    err.meta = meta;
    err.exitCode = exitCode;

    if (meta.entries.length === 0) {
      meta.config.buildOutput(meta.argv, meta, { error: err, exitCode, code });
      return null;
    }
    if (fn.isYaroCommand) {
      const nnn = fn.cli.name;
      const uuu = fn.cli.usage;
      meta.cliInfo.name = nnn;
      meta.cliInfo.usage = uuu;

      meta.cliInfo.helpLine = `${
        meta.config.name || 'cli'
      } ${nnn} ${uuu}`.trim();

      meta.config.buildOutput(meta.argv, meta, { error: err, exitCode, code });
      return null;
    }

    meta.config.buildOutput(meta.argv, meta, { error: err, exitCode, code });
    return null;
  }

  return result;
}

function findMatchCommand(entries, meta) {
  const match = entries.find(([name, cmd]) => {
    if (cmd.isYaroCommand) {
      let matched = false;

      for (const [idx, arg] of meta.argv._.entries()) {
        if (cmd.cli.aliases.includes(arg)) {
          matched = arg;
          break;
        }

        const tmp = meta.argv._.slice(0, idx + 1).join(' ');
        matched = cmd.cli.aliases.find((x) => x === tmp) || '';
        if (matched) {
          break;
        }
      }

      if (matched) {
        meta.argv._ = meta.argv._.slice(matched.split(' ').length);
        return true;
      }

      const cmdName = meta.argv._.slice(0, cmd.cli.parts.length).join(' ');
      if (name === cmdName) {
        meta.argv._ = meta.argv._.slice(cmd.cli.parts.length);
        return true;
      }

      return false;
    }
    return false;
  });

  return match && match[1];
}
