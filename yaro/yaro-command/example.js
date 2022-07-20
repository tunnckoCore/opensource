import { yaro, isRequired } from 'yaro';
import { command } from './src/index.js';

const action = command(
  '<collection> [...patterns]',
  'Lint and format files with ESLint --fix and Prettier.',
)
  .option('--log', 'Log per changed file', {
    type: Boolean,
    default: false,
    // required: isRequired,
    // required: ({ isDifferent, flagValue }) => (isDifferent ? Boolean : true),
  })
  .option('-f, --force', 'Force lint, cleaning the cache.', {
    type: Boolean,
    default: false,
    // required: isRequired,
    // required: ({ isDifferent, flagValue }) => (isDifferent ? Boolean : true),
  })
  .option('-b, --bar', 'some option', {
    default: 100,
    type: Number,
  })
  .option('-c, --config <filepath>', 'Path to config file.', {
    default: 'xaxa.config.js',
    // type: String,
    required: isRequired,
  })
  .option('--workspace-file <filepath>', 'Filepath to write workspaces data.', {
    default: 'hela-workspace.json',
    // type: String,
    required: isRequired,
  })
  .action((flags, collection, patterns) => {
    console.log('parsed flags:', flags);
    console.log('collection', collection);
    console.log('patterns', patterns);
  });

await action(process.argv.slice(2));
// await action(['foo-bar', 'src/**/*.js', 'quxie.js']);
// await action(['foo-bar', 'src/**/*.js', 'quxie.js', '-f']);
// await action(['foo-bar', 'src/**/*.js', 'quxie.js', '--force']);
