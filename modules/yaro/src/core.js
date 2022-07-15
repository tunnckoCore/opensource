// SPDX-License-Identifier: MPL-2.0

/* eslint-disable no-param-reassign */

import * as utils from './utils.js';

// TODO: make `.commands` and `.flags` a Sets
// resolves everything from: https://github.com/tunnckoCore/opensource/issues/202

export class Yaro {
  constructor(name, settings) {
    if (name && typeof name === 'object') {
      settings = name;
      name = 'cli';
    }

    this.cliName = typeof name === 'string' ? name : 'cli';
    this.commands = [];
    this.flags = [];
    this._cmd = false;
    this.settings = {
      allowInvalidOptionType: false,
      allowUnknownOptions: false,
      helpByDefault: false,
      cliVersion: '0.0.0',
      singleMode: settings === true,
      exit: () => {},
      ...settings,
    };

    this.cliVersion = this.settings.cliVersion;

    // note: define before `this.command` call, those are the global ones
    this.option('-h, --help', 'Display this message');
    this.option('-v, --version', 'Display the cli version');

    const cliNameParts = this.cliName.split(' ');

    this.settings.singleMode = this.settings.singleMode
      ? this.settings.singleMode
      : cliNameParts.length > 1;

    if (this.settings.singleMode) {
      this.command(this.cliName);
      this.cliName = cliNameParts[0];
    }
  }

  notFoundCommandsOf(commandName) {
    this.command(
      `${commandName} <command> [options]`,
      `Handles non-existing sub-commands for the "${commandName}" command`,
      { hidden: true },
      // eslint-disable-next-line max-params
    ).action((opts, __, match, details) => {
      opts.help = true;
      this.commandHelp(match, details);
    });

    return this;
  }

  command(rawName, description = '', config = {}) {
    this._cmd = true;

    const name = utils.removeBrackets(rawName);
    const args = utils.findAllBrackets(rawName);

    const command = {
      flags: [],
      rawName,
      name,
      args,
      parts: name.split(' '),
      description,
      aliasNames: [],
      config: { ...config },
    };

    this.currentCommand = command;

    if (!this.settings.singleMode) {
      this.option('-h, --help', `Display help for "${name}" command.`);
    }
    return this;
  }

  describe(description = '') {
    this.currentCommand.description = description;
    return this;
  }

  alias(...names) {
    if (!this._cmd) {
      throw new Error('yaro: .alias() can only be defined after .command()');
    }
    this.currentCommand.aliasNames = names.flat();

    return this;
  }

  option(rawName, description = '', config = {}) {
    const flag = {
      rawName,
      description,
      negated: false,
      config: { ...config },
    };

    const names = utils
      .removeBrackets(rawName)
      .split(',')
      .map((v) => {
        let name = v.trim().replace(/^-{1,2}/, '');
        if (name.startsWith('no-')) {
          flag.negated = true;
          name = name.replace(/^no-/, '');
        }

        return utils.camelcaseOptionName(name);
      })
      .sort((a, b) => (a.length > b.length ? 1 : -1)); // Sort names

    // Use the longest name (last one) as actual option name
    flag.name = names[names.length - 1];
    flag.names = names;

    if (flag.negated && flag.config.default == null) {
      flag.config.default = true;
    }

    if (rawName.includes('<')) {
      flag.required = true;
    } else if (rawName.includes('[')) {
      flag.required = false;
    }

    if (this._cmd === false) {
      flag.isGlobal = true;
      this.flags.push(flag);
      return this;
    }

    this.currentCommand.flags.push(flag);

    return this;
  }

  action(handler) {
    if (this._cmd) {
      this.currentCommand.handler = handler;
      this.commands.push(this.currentCommand);
      this._cmd = false;
    } else {
      this.defaultAction = handler;
    }

    return this.settings.singleMode ? this : Object.assign(handler, this);
  }

  // help(fn) {
  //   // todo: make default callback
  //   this.helpCallback = typeof fn === 'function' ? fn : undefined;
  //   return this;
  // }

  outputHelp() {
    utils.buildHelpOutput(this);
    return this;
  }

  version(ver = '0.0.0') {
    this.cliVersion = String(ver);
    return this;
  }

  outputVersion() {
    console.log(
      `${this.cliName}/${this.cliVersion} ${this.settings.platformInfo}`,
    );

    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  #isMatchCommand(command, args) {
    if (command.parts.length > 1) {
      return command.parts.every(
        (part, i) => part === args[i] || command.aliasNames.includes(args[i]),
      );
    }

    const name = args[0];

    return command.name === name || command.aliasNames.includes(name);
  }

  #yargs(argv, flags = [], yargsConfig = {}) {
    const yargsOpts = utils.normalizeFlags(flags, yargsConfig, this.settings);

    const parsed = this.settings.parser(argv, yargsOpts);
    // console.log('yargsparsed', parsed);
    const { _: args, ...globalFlags } = parsed.argv;

    if (yargsConfig['halt-at-non-option'] && globalFlags['--']) {
      args.push(...globalFlags['--']);
    }

    return { error: parsed.error, args, flags: globalFlags };
  }

  // eslint-disable-next-line class-methods-use-this
  #hasOption(flagName, flags) {
    let ret = false;

    for (const flag of flags) {
      if (flag.names.includes(utils.camelcaseOptionName(flagName))) {
        ret = true;
        break;
      }
    }

    return ret;
  }

  #checkUnknownOptions(options, command) {
    const unknownOptions = [];

    for (const name of Object.keys(options)) {
      const hasOption = command
        ? this.#hasOption(name, command.flags)
        : this.#hasOption(name, this.flags);

      if (name !== '--' && !hasOption) {
        const flagName = name.length > 1 ? `--${name}` : `-${name}`;
        unknownOptions.push(flagName);
      }
    }

    return unknownOptions;
  }

  #handleUnknownOptions(options, command) {
    const unknownFlags =
      !this.settings.allowUnknownOptions &&
      this.#checkUnknownOptions(options, command);

    if (!unknownFlags || unknownFlags.length === 0) {
      return;
    }

    const a = unknownFlags.join(', ');
    const c = this.cliName;

    if (command) {
      const b = command.name;
      console.log('Unknown option(s) "%s" for "%s %s" command!', a, c, b);
      console.log('Run `%s %s --help', c, b);
    } else {
      console.log('Unknown option(s) "%s".', a);
      console.log('Run `%s --help', c);
    }

    this.settings.exit(1);
  }

  #handleDefaults(details) {
    if (details.flags.version) {
      this.outputVersion();
      this.settings.exit(0);
      return;
    }
    if (
      details.args.length === 0 &&
      (details.flags.help || this.settings.helpByDefault)
    ) {
      this.outputHelp();
      this.settings.exit(0);
      return;
    }

    if (details.error) {
      console.log('Failure with', this.cliName, details.error.message);
      this.settings.exit(1);
    }
  }

  #handleUnknownCommand(match, details) {
    const isHiddenCommand = match && match.command.config.hidden;
    if (isHiddenCommand) {
      match.command.options.help = true;
      return;
    }

    if (!match) {
      console.log('Command run failed:', this.cliName, ...details.args);
      console.log('Run "%s --help" for more info.', this.cliName);
      this.settings.exit(1);
    }
  }

  #handleFailedCommand(match) {
    if (!match.error) {
      return;
    }

    console.log(
      '%s: Command "%s" failed! %s',
      this.cliName,
      match.command.name,
      match.error.message,
    );
    console.log('Run `%s %s --help`', this.cliName, match.command.name);
    this.settings.exit(1);
  }

  #searchCommand(details, yargsCfg) {
    let match = false;

    for (const command of this.commands) {
      // console.log('command', command);
      const parsed = this.#yargs(this.argz, command.flags, yargsCfg);

      if (this.#isMatchCommand(command, parsed.args)) {
        const sub = command.name.split(' ');
        command.options = parsed.flags;

        match = {
          globalOptions: details.flags,
          args: parsed.args.slice(sub.length),
          command,
        };
        break;
      }
    }

    return match;
  }

  #checkMissingArguments({ command: cmd, args } = {}) {
    const minArgs = cmd.args.filter((arg) => arg.required).length;

    if (args.length < minArgs) {
      console.log(
        '%s: Missing required args for command "%s".',
        this.cliName,
        cmd.rawName,
      );
      console.log('Run `%s %s --help` for more info.', this.cliName, cmd.name);
      this.settings.exit(1);
    }
  }

  #checkOptionValue(flags, options) {
    for (const flag of flags) {
      const name = flag.name.split('.')[0];

      const value = options[name];
      const isPassed = name in options;
      // Check required option value

      // info: we know what we do
      // eslint-disable-next-line valid-typeof
      if (isPassed && flag.config.type && typeof value !== flag.config.type) {
        console.log(
          '%s: Value for option "%s" is not of type "%s".',
          this.cliName,
          flag.rawName,
          flag.config.type,
        );
        console.log('Run `%s --help` for more info.', this.cliName);
        this.settings.exit(1);
      }

      if (flag.required) {
        const hasNegated = flags.some(
          (o) => o.negated && o.names.includes(flag.name),
        );

        if (value === true || (value === false && !hasNegated)) {
          console.log(
            '%s: Missing required value for option "%s".',
            this.cliName,
            flag.rawName,
          );
          this.settings.exit(1);
        }
      }
    }
  }

  commandHelp(match, details) {
    if (!match || !match.command.options.help) {
      return;
    }

    utils.buildHelpOutput(this, match, details);
    this.settings.exit(0);
  }

  #runCommand(match, details) {
    const { command: cmd, args } = match;
    const actionArgument = {};

    for (const [index, arg] of cmd.args.entries()) {
      const argValue = arg.variadic ? args.slice(index) : args[index];
      const argName = arg.name;

      actionArgument[argName] = argValue;
    }

    this.#checkMissingArguments(match);
    this.#checkOptionValue(cmd.flags, cmd.options);

    actionArgument.options = this.settings.mergeOptions
      ? { ...details.flags, ...cmd.options }
      : cmd.options;

    actionArgument.flags = cmd.options;

    return cmd.handler.call(this, actionArgument, {
      globalOptions: details.flags,
      options: cmd.options,
      flags: cmd.options,
      match,
      details,
    });
  }

  parse(argv, yargsCfg = {}) {
    const cfg = { run: true, ...yargsCfg };
    this.argz = this.settings.processArgv || this.settings.argv || argv;

    if (this.settings.singleMode) {
      this.argz = [this.cliName, ...this.argz];
    }

    const details = this.#yargs(this.argz, this.flags, {
      ...yargsCfg,
      'halt-at-non-option': true,
    });

    // Check for global unknown options
    this.#handleUnknownOptions(details.flags);

    this.#checkOptionValue(this.flags, details.flags);

    // Handle defaults like showing help, parsing error, or version output
    this.#handleDefaults(details);

    // Search in commands (supports sub-commands, git-style)
    const match = this.#searchCommand(details, yargsCfg);

    this.#handleUnknownCommand(match, details);

    // Check for unknown command options
    this.#handleUnknownOptions(match.command.options, match.command);

    this.#handleFailedCommand(match);

    this.commandHelp(match, details);

    if (cfg.run) {
      return this.#runCommand(match, details);
    }

    return { details, match };
  }
}

export * as utils from './utils.js';
