import { createCli } from '../src/index.js';

// node ./examples/basic-cli.js --help

await createCli({
  name: 'foo-bar-cli',
  version: '0.1.0',
  commands: {
    _: (options) => {
      console.log('hello! options:', options);
    },
  },
});
