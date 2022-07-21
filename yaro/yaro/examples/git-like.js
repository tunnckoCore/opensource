import { createCli, command } from '../src/index.js';

// node ./examples/git-like.js --help

const commit = command('git commit [...msg]', async (options, msg) => {
  console.log('git commit -sS', JSON.stringify(msg.join(' ')));
});

const add = command('git add [...files]', 'git add files')
  .option('-A, --all', 'add all files', true)
  .action(async (options, files) => {
    console.log('git add files:', files);
  });

const remoteAdd = command('git remote add [foo] [bar]')
  .option('-f, --force', 'some option here')
  .option('--dry-run', 'Call without running', false)
  .action(async (options, foo, bar) => {
    console.log('adding remote %s -> %s', foo, bar);
  });

const remoteDelete = command('git remote rm [name]')
  .alias('git remote del', 'git remote remove', 'git rerm')
  .option('--dry-run', 'Call without running', false)
  .action(async (options, foo, bar) => {
    console.log('adding remote %s -> %s', foo, bar);
  });

await createCli({
  name: 'git-cli',
  version: '3.1.1',
  commands: { add, remoteAdd, remoteDelete, commit },
});
