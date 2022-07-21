import { yaro, isRequired } from 'yaro';
import { command, UNNAMED_COMMAND_PREFIX } from './src/index.js';

const affected = command(
  '[...names]',
  'List affected workspaces of change in `name` package',
)
  .alias('innit', 'intit')
  .alias('aff', 'affcted', 'affecetd')
  .option('--raw', 'Print raw-only output', { type: Boolean, default: false })
  .option(
    '-p, --packages',
    'Print affected package names, instead of workspaces (which is default)',
    { type: Boolean, default: false },
  )
  .option('--workspace-file', 'File path to write workspaces metadata', {
    default: 'hela-workspace.json',
    // type: String,
    required: isRequired,
    // normalize: true,
  })
  .action(async (options, names) => {
    console.log('affected command', options, names);
  });

const ensCreate = command(
  'ens create <foo> [...names]',
  'Resolve workspaces and packages information',
)
  .alias('ens cr', 'enscr', 'ens craet', 'ens creat', 'ens:cr', 'ens:new')
  .option('-f, --foo-bar', 'File path to write workspaces metadata')
  .option('--dry-run', 'Run the command without writing new versions to disk', {
    type: Boolean,
    default: false,
  })
  .action(async (options, foo, names) => {
    console.log('run affected command from init command');
    await affected(options, names);
  });

const ens = command('ens <command>', async (options, cmd, ...args) => {
  await ensCreate(options, ...args);
});

const lint = command('gaga [...files]', async (options, files) => {
  console.log('formatting and linting files', files);
});

const xaxa = command((options) => {
  console.log('xaxa lint cmd!', { options });
});

const fmt = async (options) => {
  console.log('format command, just a simple function style definition');
  console.log('options:', options);
  await xaxa(options);
};

const foobie = async (options) => {
  console.log('foobie command calls `fmt` (bare function) command');
  await fmt(options);
};

/**
 *
 * @param {*} argv
 * @param {*} config
 * @returns
 */

async function hela(argv, config) {
  const cfg = Array.isArray(argv) ? { argv, ...config } : { argv: [], ...argv };

  if (cfg.buildOutput && typeof cfg.buildOutput !== 'function') {
    throw new TypeError('option `buildOutput` should be function when given');
  }
  if (cfg.exit && typeof cfg.exit !== 'function') {
    throw new TypeError('option `exit` should function when given');
  }

  cfg.exit = cfg.exit ?? (() => {});
  cfg.buildOutput = cfg.buildOutput ?? buildOutput;

  const parsedInfo = yaro(cfg.argv);
  const commands = getCommands(cfg);
  let usg = '';

  if (commands.length === 1) {
    const [_, { cli }] = commands[0];
    usg = cli.usage.length > 0 ? `${cli.name} ${cli.usage}` : cli.name;
    cfg.name = cfg.name ?? usg;
    // console.log('$ %s [options]', cfg.name ?? name);
    // return;
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
      } else {
        // in case we get just a bare function, treat it like command
        return [kk, command(cmd)];
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

await hela(process.argv.slice(2), {
  commands: { ensCreate, affected },
  name: 'sasa',
  version: '5.0.0',
  exit: process.exit,
});

// console.log('options', options);
// await init(options);
// await action(yaro(process.argv.slice(2)));
// await action(['foo-bar', 'src/**/*.js', 'quxie.js']);
// await action(['foo-bar', 'src/**/*.js', 'quxie.js', '-f']);
// await action(['foo-bar', 'src/**/*.js', 'quxie.js', '--force']);
