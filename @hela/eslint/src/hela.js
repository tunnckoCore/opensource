'use strict';

const glob = require('glob-cache');
const JestWorker = require('jest-worker').default;
// const { CLIEngine } = require('eslint');
const { hela } = require('hela');
const { DEFAULT_IGNORE, DEFAULT_INPUT } = require('./index');

module.exports = hela()
  .command('eslint [...files]', 'Run ESLint. Everything is passed to it')
  .action(async (...args) => {
    const files = args.slice(0, -2);
    const argv = args[args.length - 2];
    // const flags = toFlags(argv);

    let worker = null;

    const patterns = files.length > 0 ? files : DEFAULT_INPUT;
    await glob({
      include: patterns,
      exclude: DEFAULT_IGNORE,
      cacheLocation: './.cache/eslint-cache',
      always: true,
      // onBeforeHook: () => {
      //   worker = new JestWorker(require.resolve('./eslint-hook.js'), {
      //     // numWorkers: 4,
      //     forkOptions: { stdio: 'inherit' },
      //   });
      // },
      hook: async (ctx) => {
        // const worker = ctx.onBeforeResult;
        // console.log('ctx.valid', ctx.valid);
        // console.log('ctx.missing', ctx.missing);
        if (ctx.valid === false || (ctx.valid && ctx.missing)) {
          console.log('file', ctx.file.path);
          worker =
            worker ||
            new JestWorker(require.resolve('./eslint-hook.js'), {
              numWorkers: 7,
              forkOptions: { stdio: 'inherit' },
            });

          await worker.default(ctx, argv);
          // console.log('dd');

          worker.end();
        }
      },
    });
  });
