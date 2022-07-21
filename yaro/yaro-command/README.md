# yaro v4

> A companion to Hela, based on `yargs-parser@21`. Creating CLI programs,
> easily. Deno support and ESM-only default. Similar to CAC, Yargs, and Sade,
> because there are different problems and viewpoints.

## Highlights

- Familiar and small APIs.
- Built from the ground up, for N-th time.
- Used in production for years.
- Stable & robust, built on `yargs-parser`.
- Single Command Mode support.
- Built-in help output & version.
- Checking for option's value.
- Missing required arguments checking.
- Sane defaults, option's value type checking too.
- Veriadic and positional arguments.
- Familiar & intuitive sub-commands support.
- Dot-notation, camelCase options, and other goodies.
- ESM-only (& node 16+) & Deno support (`'https://esm.sh/yaro@4/src/mod.ts'`).

### `yaro([name], [settings])`

More docs and better help output - soon!

But it's pretty straightforward:

- cli.command(rawName, desc, config = {})
- cli.option(rawName, desc, config = {})
- cli.alias(...aliases)
- cli.version(versionString)
- cli.describe(desc) - add description to **a command!** Useful for single
  command mode.

**Example**

```js
import { yaro } from 'yaro';

const cli = yaro('hela').version('0.1.0');

cli
  .option('--verbose', 'Print more verbose output', {
    default: false,
    type: 'boolean',
  })
  .option('--show-stack', 'Show more detailed info when errors', {
    default: false,
    type: 'boolean',
  })
  .option('--idx <num>', 'some index', { type: 'number' })
  .option('-c, --config', 'Path to config file', {
    type: 'string',
    default: 'hela.config.js',
    normalize: true,
  });

cli
  .command('init', 'Initialize a project')
  .alias('innit', 'inti')
  .option('--foo [bar]', 'Some flag descr')
  .action(() => {
    console.log('init!!!');
  });

cli
  .command('ens init', 'initialize some ens things')
  .alias('intit', 'initit', 'inint')
  .action(({ options }, { settings }) => {
    console.log('ens initialized', options, settings);
  });

const createCollection = cli
  .command('ens create <collection> [...names]', 'Create collection')
  .alias('create', 'creat', 'craet', 'craete', 'cr')
  .action(async ({ collection, names, options }, { globalOptions }) => {
    console.log('create!');
    console.log('collection:', collection);
    console.log('names:', names);
    console.log('options:', options);
    console.log('globalOptions:', globalOptions);
  });

const verify = cli
  .command('ens verify <...collection>', 'Make multiple collections verified')
  .alias('verify', 'verifi', 'veryfi', 'veryfy')
  .action(async (collections) => {
    console.log('ens verify! multiple collections', collections);
  });

const certify = cli
  .command('ens certify <collection>', 'Make a collection certified')
  .alias('certify', 'certyfi', 'certyfy', 'cert')
  .action(async () => {});

const addNames = cli
  .command('ens add names <...names>', 'Add missing names to a collection')
  // .alias(['add:names', 'add:name'])
  .action(async (names) => {
    console.log('ens add names', names);
  });

const addCommunity = cli
  .command(
    'ens add community [...socials]',
    'Add community links to a collection.',
  )
  // .alias(['add:community', 'add:commumity', 'add:social', 'add:socials'])
  .action(async (socials) => {
    console.log('ens add community', socials);
  });

const addWebsites = cli
  .command(
    'ens add website [...websites]',
    'Add website links to a collection.',
  )
  // .alias(['add:website', 'add:websites', 'add:link', 'add:links'])
  .action(async (websites) => {
    console.log('ens add website', websites);
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

// note: Handle non existing sub-commands at the end
// those "fake commands" are not listed on the help output
cli.notFoundCommandsOf('ens');
cli.notFoundCommandsOf('remote');

cli.parse();
```

### Single Command Mode

You can pass second argument as boolean, or a settings object with
`{ singleMode: true }`

```js
import { yaro } from 'yaro';
// or Deno
// import { yaro } from 'https://esm.sh/yaro@4'

yaro('xaxa [...patterns]', true)
  .version('0.1.0')
  .describe('Lint files which match the given patterns')
  .option('-c, --config', 'Path to config file', {
    default: 'xaxa.config.js',
    type: 'string',
    normalize: true,
  })
  .action(({ options, patterns }, { globalOptions, match, details }) => {
    console.log({ globalOptions, match, details });
    console.log('command is OK!', patterns, options);
  })
  .parse();
```
