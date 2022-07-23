import { createCli, command } from '../src/index.js';

// node ./examples/git-like.js --help

const commit = command('commit [...msg]', async (options, msg) => {
  console.log('git commit -sS', JSON.stringify(msg.flat().join(' ')));
});

const add = command('add [...files]', 'git add files')
  .option('-A, --all', 'add all files', true)
  .action(async (options, files) => {
    console.log('git add files:', files);
  });

const remoteAdd = command('remote add [foo] [bar]')
  .option('-f, --force', 'some option here')
  .option('--dry-run', 'Call without running', false)
  .action(async (options, foo, bar) => {
    console.log('adding remote %s -> %s', foo, bar);
  });

// git remote rm foo
// git remote del foo
// git remote remove foo
// git rerm foo
const remoteDelete = command('remote rm <name>')
  .alias('remote del', 'remote remove', 'rerm')
  .option('--dry-run', 'Call without running', false)
  .action(async (options, name) => {
    console.log('git remote rm', name);

    if (!options.foo) {
      throw new Error('some fake random error');
    }
  });

await createCli({
  name: 'git-cli',
  version: '3.1.1',
  commands: { add, remoteAdd, remoteDelete, commit },
});
