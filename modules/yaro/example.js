import { Yaro } from './src/index.js';

const cli = new Yaro('myprg', {
  defaultsToHelp: true,
  // defaultCommand: "add",
  allowUnknownFlags: true,
  '--': true,
});

cli.option('--config', 'Path to some config file');

cli
  .command('lint <input>', 'Some linting', { alias: ['lnt', 'lnit'] })
  .alias('limnt', 'lintr')
  .alias(['linting', 'lintx'])
  .example(`lint 'src/*.js'`)
  .example(`lint 'src/*.js' --fix`)
  .option('--fix', 'Fix autofixable problems', { default: true })
  // todo: implement required value of flags
  .option('-f, --format <formatter>', 'Cli reporter', {
    default: 'codeframe',
  })
  .action((input, flags, arg) => {
    // console.log('args:', input);
    // console.log('flags:', flags);
    console.log('lint called!', arg, flags, input);
  });

cli
  .command('install [...packages]', 'Install deps')
  .option('--save-dev', 'descr here')
  .alias('i', 'add')
  .action((...args) => {
    console.log('args:', args);
    console.log('install cmd');
  });

cli.command('foo-bar-baz-qux-zaz', 'Okkk deps').action(() => {
  console.log('foobar cmd');
});

// eslint-disable-next-line no-unused-vars
const result = cli.parse();

// console.log("result:", result);
