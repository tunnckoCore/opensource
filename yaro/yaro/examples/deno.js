// import ipFilter from 'ip-filter';
// eslint-disable-next-line import/named
import { createCli, command } from '../src/mod.ts';

// node ./examples/linter-cli.js --help

const lint = command('[...files]', async (options, files) => {
  console.log('Linting files:', files);
  console.log('Options:', options);
  // testing with external error
  // ipFilter('sasasasa');
});

await createCli({
  name: 'foo-bar-cli',
  version: '2.1.6',
  commands: { lint },
});
