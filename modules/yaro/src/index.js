// SPDX-License-Identifier: MPL-2.0

// big portions derived from `lukeed/mri` MIT

/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */

import process from 'node:process';
import parseArgv from 'mri';
import { dset } from 'dset';

const {
	cwd,
	exit,
	platform,
	arch,
	version,
	env: processEnv,
	argv: processArgv,
} = process;
const platformInfo = `${platform}-${arch} node-${version}`;

function isObject(val) {
	return val && typeof val === 'object' && Array.isArray(val) === false;
}

class Yaro {
	constructor(programName, options) {
		if (isObject(programName) && !options) {
			options = programName;
			programName = null;
		}
		if (options && typeof options === 'string') {
			options = { version: options };
		}

		const progName = typeof programName === 'string' ? programName : 'cli';

		this.settings = {
			cwd: cwd(),
			version: '0.0.0',
			singleMode: false,
			allowUnknownFlags: false,
			...options,
		};

		if (
			hasOwn(this.settings, 'defaultsToHelp') &&
			this.settings.singleMode === true
		) {
			this.settings.defaultsToHelp = false;
			this.settings.defaultCommand = '$$root';
		}

		// console.log("this.settings", this.settings);

		this.programName = progName;
		this.commands = new Map();
		this.flags = new Map();
		this.examples = [];
		this.isYaro = true;

		this.option('-h, --help', 'Display help message');
		this.option('-v, --version', 'Display version');
	}

	// NOTE: use only when single command mode to define like `my-cmd [...files]`
	// it is later use in `.command` (which in the case of singleMode is called from `.action`)
	// instead of the `rawName`.
	usage(str) {
		// for now only in single command mode
		if (this.settings.singleMode) {
			this._usg = str ? str.trim() : '';
		}

		return this;
	}

	command(rawName, description, config) {
		if (this.settings.singleMode === true && config && !config.singleMode) {
			throw new Error('in single mode cannot add commands');
		}
		const descr = description || '(no description for this command)';

		// todo: `rest` parsing, variadic args and etc
		const [commandName, ...rest] = rawName.split(' ');

		const command = {
			commandName,
			rawName,
			description: descr,
			config: { ...config },
			args: this.createArgs(rest),
			flags: new Map(),
			examples: [],
			aliases: [],
		};

		command.config.alias = [command.config.alias].flat().filter(Boolean);
		command.aliases = command.config.alias;
		this.currentCommand = command; // todo: reset in action() ?

		this.alias(command.aliases);

		this.commands.set(command.commandName, command);
		return this;
	}

	option(rawName, description, config) {
		const flag = this.createFlag(rawName, description, config);

		if (this.settings.singleMode === true || !this.currentCommand) {
			this.flags.set(flag.name, flag);
		} else {
			this.currentCommand.flags.set(flag.name, flag);
			this.__updateCommandsList();
		}
		return this;
	}

	example(text) {
		if (this.settings.singleMode === true || !this.currentCommand) {
			this.examples.push(text);
		} else {
			this.currentCommand.examples.push(text);
			this.__updateCommandsList();
		}
		return this;
	}

	alias(...aliases) {
		if (!this.currentCommand) {
			throw new Error('cannot set .alias() if there is no command declared');
		}

		const alias = [this.currentCommand.aliases]
			.flat()

			.concat(...aliases)
			.filter(Boolean);

		this.currentCommand.aliases = [...new Set(alias)];
		this.__updateCommandsList();

		return this;
	}

	action(handler) {
		if (typeof handler !== 'function') {
			throw new TypeError('yaro: no action defined, or not a function');
		}
		const fn = (...args) => handler.apply(this, args);

		if (!this.currentCommand && this.settings.singleMode === true) {
			const cmd = this._usg ? ` ${this._usg}` : '';

			this.command(`$$root${cmd}`, 'On single mode', { singleMode: true });
		}
		this.currentCommand.handler = fn;
		this.__updateCommandsList();

		return this.settings.singleMode === true ? this : Object.assign(fn, this);
	}

	extendWith(inst) {
		const keys = Object.getOwnPropertyNames(inst);
		const tasks = Object.values(inst).filter((x) => x.isHela && x.isYaro);

		if (tasks.length > 0) {
			for (const task of tasks) {
				this.merge(this, task);
			}
		}

		if (keys.length >= 10 && inst.isHela && inst.isYaro && inst.extendWith) {
			return this.merge(this, inst);
		}

		return this;
	}

	merge(one, two) {
		for (const [_, flag] of two.flags) {
			one.option(flag.rawName, flag.description, flag.config);
		}

		for (const example of two.examples) {
			one.example(example);
		}

		one.commands.set(two.currentCommand.commandName, two.currentCommand);
		return one;
	}

	version(value) {
		this.settings.version = value || this.settings.version;

		return this;
	}

	showVersion(ret = false) {
		if (ret) {
			return this.settings.version;
		}
		console.log(this.settings.version);
		return this;
	}

	help(handler) {
		this.settings.helpHandler = handler || this.settings.helpHandler;

		return this;
	}

	showHelp(commandName) {
		const sections = this.buildHelpOutput(commandName);

		if (typeof this.settings.helpHandler === 'function') {
			this.settings.helpHandler.call(this, sections);
			return this;
		}

		console.log(
			sections
				.map((x) => (x.title ? `${x.title}:\n${x.body}` : x.body))
				.join('\n\n'),
		);
		return this;
	}

	buildHelpOutput(commandName) {
		const sections = [];
		const commands = [...this.commands.values()].filter(
			(x) => x.commandName !== '$$root',
		);

		// it's general help, so include commands
		if (!commandName) {
			const cmdStr = this.settings.defaultCommand ? ' [command]' : ' <command>';
			const usg = this.settings.singleMode ? `${this._usg} ` : '';
			sections.push({
				title: 'Usage',
				body: `  $ ${this.programName}${commands.length > 0 ? cmdStr : ''} ${
					this.flags.size > 0 ? `${usg}[options]` : ''
				}`,
			});

			if (commands.length > 0) {
				sections.push(this.createSection('Commands', commands));

				// eslint-disable-next-line unicorn/no-array-push-push
				sections.push({
					title: `For more info, run any command with the \`--help\` flag`,
					body: commands
						.slice(0, 2)
						.map((cmd) => `  $ ${this.programName} ${cmd.commandName} --help`)
						.filter(Boolean)
						.join('\n'),
				});
			}
		} else {
			const command = this.commands.get(commandName);
			sections.push({
				title: 'Usage',
				body: `  $ ${this.programName} ${command.commandName} ${
					command.flags.size > 0 ? '[options]' : ''
				}`,
			});
			// eslint-disable-next-line unicorn/no-array-push-push
			sections.push({
				title: 'Aliases',
				body: `  ${command.aliases.join(', ').trim()}`,
			});
		}

		const cmd = commandName ? this.commands.get(commandName) : null;
		const flags = [...(commandName ? cmd : this).flags.values()];

		if (flags.length > 0) {
			sections.push(this.createSection('Flags', flags));
		}

		const examples = cmd
			? cmd.examples
			: this.examples.concat(cmd ? cmd.examples : null).filter(Boolean);

		if (examples.length > 0) {
			sections.push({
				title: 'Examples',
				body: examples
					.map((example) =>
						typeof example === 'function'
							? example
							: (progName) => `  $ ${progName} ${example}`,
					)
					.map((exampleFn) => exampleFn.call(this, this.programName))
					.join('\n'),
			});
		}

		return sections;
	}

	// eslint-disable-next-line max-statements
	parse(argv = processArgv, options = {}) {
		// NOTE: it's in a single command mode but does not have `.action` defined,
		// so we create noop one o uccessfully continue
		if (!this.currentCommand && this.settings.singleMode === true) {
			this.action(() => {});
		}

		this.settings = { ...this.settings, ...options };
		this.result = this.__getResult(argv.slice(2));

		if (this.settings.superLazy) {
			return this.result;
		}

		if (this.result.flags.version) {
			this.showVersion();
			exit(0);
		}

		const cmd = this.__getCommand();

		this.checkHelp(cmd);

		// if here, cmd is found, almost guaranteed?

		const command = this.checkArguments(cmd.command);
		const res = { ...this.result, command };

		for (const flag of command.flags.values()) {
			for (const flagName of flag.names.filter(Boolean)) {
				// if (hasOwn(res.flags, flagName)) {
				//   res.flags[flagName] =
				// }
				if (hasOwn(flag.config || {}, 'default')) {
					res.flags[flagName] = flag.config.default;
				}
			}
		}

		// since we can pass alias as "defaultCommand",
		// so we should sync them
		res.commandName = command.commandName;

		this.checkUnknownFlags(command);

		if (this.settings.lazy) {
			return res;
		}

		res.flags = {
			...this.result.flags,
			...this.result.helaSettings.argv,
			cwd: this.settings.cwd,
		};
		this.result.flags = res.flags;

		if (!command.handler || typeof command.handler !== 'function') {
			throw new TypeError('yaro: no action() defined, or not a function');
		}

		this.result.input = this.result.args;
		// console.log(this.result);
		Reflect.apply(command.handler, this, [
			this.result,
			this.result.flags,
			...this.result.args,
		]);
		return res;
	}

	checkHelp(cmd) {
		if (this.result.flags.help) {
			const name = cmd && cmd.command && cmd.command.commandName;

			this.showHelp(this.settings.defaultCommand ? '' : name);
			exit(0);
		}
		if (!cmd.found) {
			if (!this.settings.defaultsToHelp) {
				if (this.result.commandName) {
					console.log('yaro: Command "%s" not found', this.result.commandName);
				} else {
					this.showHelp();
				}
				exit(1);
			} else {
				this.showHelp();
				exit(0);
			}
		}
	}

	checkArguments(command) {
		const hasRequired = command.args.filter((x) => x.isRequired);
		const hasMultiple = command.args.filter((x) => x.isMultiple);

		if (hasRequired.length > 0 && this.result.args.length === 0) {
			console.log('yaro: Missing required arguments');
			exit(1);
		}
		if (hasMultiple.length === 0 && this.result.args.length > 1) {
			console.log(
				'yaro: Too much arguments passed, you may want add "..." in command declaration?',
			);
			exit(1);
		}

		return { ...command, hasRequired, hasMultiple };
	}

	checkUnknownFlags(command) {
		const flags = [...this.flags.values()];
		const cmdFlags = command ? [...command.flags.values()] : [];

		// eslint-disable-next-line unicorn/consistent-function-scoping
		const findIn = (arr) => (x) => arr.find((flag) => flag.name === x);
		const keys = Object.keys(this.result.flags);
		const foundInGlobal = keys.filter(findIn(flags));
		const foundInCommand = keys.filter(findIn(cmdFlags));
		const found = foundInGlobal.concat(foundInCommand);

		// todo: bug behavior when allowUnknownFlags: false (default for Yaro)
		if (this.settings.allowUnknownFlags !== true && found.length === 0) {
			console.log('yaro: Unknown flag(s):', keys);
			exit(1);
		}

		// todo: implement required value of flags

		return command;
	}

	createArgs(args) {
		return args.reduce((acc, arg) => {
			const isRequired = arg.startsWith('<');
			const isRequiredMultiple = arg.startsWith('<...');
			const isOptionalMultiple = arg.startsWith('[...');

			return acc.concat({
				isRequired,
				isOptional: !isRequired,
				isMultiple: isRequiredMultiple || isOptionalMultiple,
				arg,
			});
		}, []);
	}

	createSection(title, arr) {
		const longestName = findLongest(arr.map((x) => x.rawName || x));
		const longestDesc = findLongest(arr.map((x) => x.description || x));
		return {
			title,
			body: arr
				.map((x) => {
					const def =
						title === 'Flags' && x.config
							? ` (default: ${JSON.stringify(x.config.default)})`
							: '';
					const name = padRight(x.rawName, longestName.length);
					const desc = padRight(x.description, longestDesc.length);

					return `  ${name}  ${desc} ${def}`;
				})
				.join('\n'),
		};
	}

	// from `cac`, MIT
	createFlag(rawName, description, config) {
		const flag = {
			rawName,
			description,
		};

		if (config !== undefined) {
			flag.config = flag.config || {};
			flag.config.default = config;
		}

		// You may use cli.option('--env.* [value]', 'desc') to support a dot-nested option
		flag.rawName = rawName.replace(/\.\*/g, '');

		flag.negated = false;
		flag.names = removeBrackets(rawName)
			.split(',')
			.map((v) => {
				let name = v.trim().replace(/^-{1,2}/, '');
				if (name.startsWith('no-')) {
					flag.negated = true;
					name = name.replace(/^no-/, '');
				}
				return name;
			})
			.sort((a, b) => (a.length > b.length ? 1 : -1)); // Sort names

		// Use the longese name (last one) as actual option name
		flag.name = flag.names[flag.names.length - 1];

		if (flag.negated) {
			// ? hmmmm? should be false?
			flag.config.default = true;
		}

		if (rawName.includes('<')) {
			flag.required = true;
		} else if (rawName.includes('[')) {
			flag.required = false;
		} else {
			// No arg needed, it's boolean flag
			flag.isBoolean = true;
		}

		return flag;
	}

	__existsAsAlias(name) {
		let found = false;

		for (const [k, command] of this.commands) {
			if (!k) {
				continue;
			}

			const f = command.aliases.includes(name);

			if (!f) {
				continue;
			}
			found = command;
		}
		return found;
	}

	__getCommand() {
		const res = { found: true };
		let command = null;

		// console.log("this.commands", this.commands);
		// console.log("this.result", this.result);

		// todo: better error handling and etc
		if (
			!this.commands.has(this.result.commandName) ||
			!this.result.commandName
		) {
			command = this.__existsAsAlias(this.result.commandName);
			if (!command) {
				res.found = false;
			}
		}

		res.command = command || this.commands.get(this.result.commandName);

		// console.log("__getCommand res", res);
		return res;
	}

	__getResult(argv) {
		const flagAliases = {};

		for (const [_, cmd] of this.commands.entries()) {
			for (const [flagName, flag] of cmd.flags.entries()) {
				flagAliases[flagName] = flag.names;
			}
		}

		const parsed = parseArgv(argv, {
			alias: {
				h: 'help',
				v: 'version',
				...flagAliases,
			},
		});

		const parsedArgv = { ...parsed };
		const rawArgs = [...parsed._];
		delete parsed._;

		const flags = Object.keys({ ...parsed }).reduce((acc, key) => {
			dset(acc, key, acc[key] === undefined ? true : acc[key]);
			return acc;
		}, {});

		const cmdName = this.settings.singleMode
			? '$$root'
			: rawArgs.slice(0, 1)[0];

		const args = this.settings.singleMode ? rawArgs : rawArgs.slice(1);
		const idx = args.indexOf('--');
		const argsBefore = args.slice(0, idx - 1);
		const argsAfter = args.slice(idx - 1);

		const result = {
			commandName: rawArgs.length > 0 ? cmdName : this.settings.defaultCommand,
			parsedArgv,
			rawArgs,
			flags,
			helaSettings: this.settings,
		};

		if (idx > -1 && this.settings['--']) {
			result.args = argsBefore;
			result['--'] = argsAfter;
		} else {
			result.args = args;
		}

		return result;
	}

	__updateCommandsList() {
		this.commands.delete(this.currentCommand.commandName);
		this.commands.set(this.currentCommand.commandName, this.currentCommand);

		return this;
	}
}

function hasOwn(obj, val) {
	return Object.hasOwn(obj, val);
}
function removeBrackets(val) {
	return val && val.replace(/\[<\[].+/, '').trim();
}
function findLongest(arr) {
	const res = arr.sort((a, b) => (a.length > b.length ? -1 : 1));
	return res[0];
}
function padRight(str, length) {
	return str.length >= length
		? str
		: `${str}${' '.repeat(length - str.length)}`;
}

const yaro = (...args) => new Yaro(...args);
const utils = {
	exit,
	cwd,
	processEnv,
	processArgv,
	platformInfo,
	parseArgv,
	isObject,
};

export { yaro, Yaro, utils };
export default yaro;
