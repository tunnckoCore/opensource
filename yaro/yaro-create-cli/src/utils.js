// SPDX-License-Identifier: MPL-2.0

/* eslint-disable no-param-reassign */

export function buildOutput(flags, meta, info) {
  if ((info.noCommandSpecified && meta.config.showHelpOnEmpty) || info.isHelp) {
    if (info.isHelp) {
      udpateHelpLine(meta);
      console.log('\n$ %s [options]\n', meta.cliInfo.helpLine);
    }

    showAvailableCommands(meta, console.log);
    meta.config.exit(info.exitCode ?? 0);
    return;
  }

  if (info.commandNotFound) {
    const args = meta.argv._.join(' ');
    console.error('ERR_COMMAND_NOT_FOUND: command "%s" not found', args);
    udpateHelpLine(meta);
    console.error('\n$ %s [options]\n', meta.cliInfo.helpLine);

    showAvailableCommands(meta, console.error);
    meta.config.exit(1);
    return;
  }

  const err = info.error;
  const has = /MATCHED_COMMAND_FAIL|ROOT_COMMAND_FAIL/.test(err?.code || '');

  if (err && has && !err.cmdUsage) {
    const isRootFailed = /ROOT_COMMAND_FAILED/.test(err.code);
    const cmdErr = err.meta.matchedCommand.cli;

    cmdErr.usage = cmdErr.usage.trim();
    cmdErr.name = cmdErr.name === '_' ? '' : cmdErr.name;

    let fLine = isRootFailed
      ? meta.config.name || meta.cliInfo.name
      : `${meta.cliInfo.name} ${cmdErr.name}`;

    fLine = meta.singleMode ? meta.config.name || fLine.trim() || 'cli' : fLine;

    console.error(
      '%s: command "%s" failed with "%s"',
      err.code,
      fLine.trim(),
      err.toString(),
    );

    if (meta.argv.verbose) {
      console.error('');
      console.error(err.stack);
    }

    console.error('\n$ %s --verbose', fLine.trim());
    console.error('');

    meta.config.exit(1);
    return;
  }

  if (err) {
    const helpLine =
      meta.cliInfo.helpLine === meta.cliInfo.name
        ? `${meta.cliInfo.name} ${meta.matchedCommand?.cli?.name || ''}`
        : meta.cliInfo.helpLine.replace(meta.cliInfo.usage, '');

    // console.log('meta.cliInfo', meta.cliInfo, failed ? 'sasa' : 12);
    const failingArgs =
      (err.code === 'ERR_COMMAND_FAILED' && err.cmdUsage) || meta.rootCommand;

    if (failingArgs) {
      console.error('%s:', info.code, err.message);
      // console.log('ZZZZZZZZZZZZZZZ', meta, failed);
    } else {
      console.error(
        '%s: command "%s" failed with "%s"',
        info.code,
        meta.cliInfo.name,
        err.message,
      );
    }
    udpateHelpLine(meta, err);
    console.error('\n$ %s --verbose\n', helpLine.trim());
    meta.config.exit(info.exitCode);
    return;
  }

  udpateHelpLine(meta);

  const cc = 'ERR_NO_COMMAND_SPECIFIED';
  console.error('%s: no command specified and showHelpOnEmpty not enabled', cc);
  console.error('\n$ %s [options]\n', meta.cliInfo.helpLine);

  showAvailableCommands(meta, console.error);

  meta.config.exit(1);
}

function udpateHelpLine(meta, error) {
  if (error) {
    const nnn = error.meta.cliInfo.name;
    const hhh = error.meta.cliInfo.helpLine;

    let line = hhh === nnn ? hhh.replace(nnn, error?.cmdUsage || '') : hhh;
    line = hhh === line ? hhh : `${hhh.startsWith(nnn) ? '' : nnn} ${line}`;

    meta.cliInfo.helpLine = line.trim();

    if (meta.argv.verbose) {
      console.error('');
      console.error(error.stack);
    }
  } else if (meta.entries.length > 1 && meta.rootCommand) {
    const name =
      meta.cliInfo.usage === ''
        ? `${meta.cliInfo.name} <command>`
        : meta.cliInfo.name;

    meta.cliInfo.helpLine = `${name} ${meta.cliInfo.usage}`.trim();
  }

  return meta;
}

export function getAvailableCommands(meta) {
  const res = [];

  for (const [key, cmd] of meta.entries) {
    const cliName = meta.rootCommand?.cli?.name || meta.config.name || 'cli';

    const cmdName = `${cliName} ${key}`.trim();
    res.push(`- ${cmdName} ${cmd.cli.usage}`.trim());
  }

  return res;
}

export function showAvailableCommands(meta, log) {
  const available = getAvailableCommands(meta);

  if (available.length > 0) {
    log('Available commands:');
  }

  available.map((line) => log(line));
}
