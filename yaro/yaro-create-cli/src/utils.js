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
  if (err && err.code === 'ERR_MATCHED_COMMAND_FAILURE' && !err.cmdUsage) {
    const cmdErr = err.meta.matchedCommand.cli;
    // const cmdline = `${cmdErr.name} ${cmdErr.usage}`.trim();
    const failed = `${meta.cliInfo.name} ${cmdErr.name}`;
    console.error(
      '%s: command "%s" failed with "%s"',
      err.code,
      failed,
      err.toString(),
    );
    console.error('\n$ %s --verbose\n', `${failed} ${cmdErr.usage}`.trim());

    if (meta.argv.verbose) {
      console.error(err.stack);
    }
    meta.config.exit(1);
    return;
  }

  if (info.error) {
    console.error('%s:', info.code, info.error.message);
    udpateHelpLine(meta, info.error);
    console.error('\n$ %s [options]\n', meta.cliInfo.helpLine);
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
  if (error && !meta.errorInReturned) {
    const nnn = error.meta.cliInfo.name;
    const line = error.meta.cliInfo.helpLine.replace(nnn, error.cmdUsage);
    meta.cliInfo.helpLine = `${nnn} ${line}`.trim();
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
