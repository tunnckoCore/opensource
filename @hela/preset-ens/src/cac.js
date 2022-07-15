import { cac } from 'cac';

const cli = cac('hela');

cli
	.command('init', 'Initialize a project')
	.option('--foo [bar]', 'Some flag descr')
	.action(() => {
		console.log('init!!!');
	});

const createCollection = cli
	.command('ens create <collection>', 'Create collection')
	.alias('create', 'craet')
	.action(async () => {
		console.log('create!');
	});

const verify = cli
	.command('ens verify <collection>', 'Make a collection verified')
	.alias('verify', 'veryfi', 'veryfy')
	.action(async () => {});

const certify = cli
	.command('ens certify <collection>', 'Make a collection certified')
	// .alias(['certify', 'certyfi', 'certyfy'])
	.action(async () => {});

const addNames = cli
	.command('ens add names <...names>', 'Add missing names to a collection')
	// .alias(['add:names', 'add:name'])
	.action(async (names) => {
		console.log(names);
	});

const addCommunity = cli
	.command(
		'ens add community [...socials]',
		'Add community links to a collection.',
	)
	// .alias(['add:community', 'add:commumity', 'add:social', 'add:socials'])
	.action(async (socials) => {
		console.log(socials);
	});

const addWebsites = cli
	.command(
		'ens add website [...websites]',
		'Add website links to a collection.',
	)
	// .alias(['add:website', 'add:websites', 'add:link', 'add:links'])
	.action(async (websites) => {
		console.log(websites);
	});

// ens.globalCommand.usageText = `${ens.name} ${ens.globalCommand.usageText}`;
// ens.version('0.1.0');

// git remote [-v | --verbose]
// git remote add [-t <branch>] [-m <master>] [-f] [--[no-]tags] [--mirror=(fetch|push)] <name> <URL>
// git remote rename [--[no-]progress] <old> <new>
// git remote remove <name>
// git remote set-head <name> (-a | --auto | -d | --delete | <branch>)
// git remote set-branches [--add] <name> <branch>...
// git remote get-url [--push] [--all] <name>
// git remote set-url [--push] <name> <newurl> [<oldurl>]
// git remote set-url --add [--push] <name> <newurl>
// git remote set-url --delete [--push] <name> <URL>
// git remote [-v | --verbose] show [-n] <name>...
// git remote prune [-n | --dry-run] <name>...
// git remote [-v | --verbose] update [-p | --prune] [(<group> | <remote>)...]

cli
	.command('remote add <name>', 'A git remote add.')
	.option('--foo <ok>')
	.action((name, options) => {
		console.log('remote add:', name);
		console.log('options:', options);
	});

cli
	.command('remote rename <a> <b>', 'A git rename `a` to `b`.')
	.action((a, b) => {
		console.log('remote rename a to b', a, b);
	});

const remoteRemove = cli
	.command('remote remove', 'Delete something')
	.alias('rm')
	.action(() => {
		console.log('remote remove');
	});

cli
	.command('remote set-branches [--add] <name> <branch>', 'Set branch.')
	.action(() => {});

// const cli = mergePrograms(cac('git'), ens, app);

// console.log(cli);
// console.log(remoteRemove);
// app.outputHelp();
cli.help();
cli.version('0.1.0');

cli
	.option('--verbose', 'Print more verbose output', { default: false })
	.option('--show-stack', 'Show more detailed info when errors', {
		default: false,
	})
	.option('-c, --config', 'Path to config file', {
		type: 'string',
		default: 'hela.config.js',
	});

cli
	.command('', 'Default command')
	.usage('<command> [options]')
	.action((flags) => {
		console.log(flags);
		const argv = process.argv.slice(2);

		if (flags && flags.help) {
			cli.outputHelp();
			process.exit(0);
		} else if (flags && flags.version) {
			cli.outputVersion();
			process.exit(0);
		} else if (argv.length > 0) {
			console.log(cli);
			console.log('Invalid command "%s"!', argv.join(' '));
			console.log('Run `%s --help` for more info.', cli.name);
			process.exit(1);
		} else {
			cli.outputHelp();
			process.exit(1);
		}
	});

cli.parse();
