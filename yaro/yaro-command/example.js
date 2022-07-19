import { yaro } from 'yaro-parser';
import { command } from './src/index.js';

const action = command(
  '<collection> [...patterns]',
  'Lint and format files with ESLint --fix and Prettier.',
)
  .option('--log', 'Log per changed file', false)
  .option('-f, --force', 'Force lint, cleaning the cache.', false)
  .option('-c, --config', 'Path to config file.', {
    default: 'xaxa.config.js',
    type: 'string',
    normalize: true,
  })
  .option('--workspace-file', 'File path to write workspaces metadata.', {
    default: 'hela-workspace.json',
    type: 'string',
    normalize: true,
  })
  .action((flags, collection, patterns) => {
    console.log('parsed flags:', flags);
    console.log('collection', collection);
    console.log('patterns', patterns);
  });

await action(process.argv.slice(2));
