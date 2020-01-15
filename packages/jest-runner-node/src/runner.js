'use strict';

const JestWorker = require('jest-worker').default;
const { pass, fail } = require('@tunnckocore/create-jest-runner');

process.env.NODE_ENV = 'nodejs';
module.exports = async function jestRunnerNode({ testPath }) {
  const start = new Date();

  const worker = new JestWorker(require.resolve('./require-module'), {
    maxRetries: 1,
    numWorkers: 3,
    // enableWorkerThreads: true,
  });

  try {
    await worker.require(testPath);

    return pass({
      start,
      end: new Date(),
      test: { path: testPath },
    });
  } catch (err) {
    // ?? no way to got to here?
    return fail({
      start,
      end: new Date(),
      test: {
        path: testPath,
        errorMessage: err.message,
        title: `Test failure: \n${err.message}`,
      },
    });
  }

  // !!!!!!!!!!!!!!!!!!

  // let res = null;
  // try {
  //   require(testPath);
  // } catch (err) {
  //   res = { err };
  //   // return createFailed({
  //   //   err,
  //   //   testPath,
  //   //   start,
  //   //   cfg,
  //   // });
  // }

  // // const failed = createFailed({
  // //   err: res && res.err,
  // //   testPath,
  // //   start,
  // //   cfg,
  // // });

  // if (res) {
  //   console.log('ZZZZZZZZZZZZZZZZZZZZ', res);
  // }

  // return res
  //   ? fail({
  //       start,
  //       end: new Date(),
  //       test: {
  //         path: testPath,
  //         title: 'Jest Node.js',
  //         errorMessage: `jest-runner-node: ${res.err.toString()}`,
  //       },
  //     })
  //   : pass({
  //       start,
  //       end: new Date(),
  //       test: {
  //         path: testPath,
  //         title: 'Jest Node.js',
  //       },
  //     });

  // !!!!!!!!!!!!!!!!!!!!!!!!!

  // const worker = new JestWorker(require.resolve('./require-module.js'), {
  //   numWorkers: 4,
  //   forkOptions: { stdio: 'inherit' },
  //   exposedMethods: ['require'],
  //   // enableWorkerThreads: true,
  // });
  // // const stdout = worker.getStdout();
  // const stderr = worker.getStderr();

  // const res = await tryCatch(
  //   () => {
  //     /* const result = await */ require(testPath);

  //     // await worker.end();

  //     // if (result instanceof Error) {
  //     //   console.log('EEEEEEEERRRRRRRRR 22222222');
  //     //   throw result;
  //     // } else {
  //     //   return 123;
  //     // }
  //   },
  //   {
  //     testPath,
  //     start,
  //   },
  // );

  // if (res && res.hasError) return res.error;

  // return pass({
  //   start,
  //   end: new Date(),
  //   test: {
  //     path: testPath,
  //     title: 'Jest Node.js',
  //   },
  // });
  // stderr
  //   // .on('data', () => {
  //   //   console.log('stderr data', ...args);
  //   // })
  //   .on('error', (err) => {
  //     console.log('stderr error!', err);
  //     resolve(createFailed({ err, testPath, start, cfg }));
  //   })
  //   .on('exit', (code) => {
  //     console.log('stderr code:', code);
  //     const passing = {
  //       start,
  //       end: new Date(),
  //       test: {
  //         path: testPath,
  //         title: 'Jest Node.js',
  //       },
  //     };
  //     resolve(
  //       code === 0
  //         ? pass(passing)
  //         : createFailed({
  //             err: new Error(`ErrorCode ${code}`),
  //             testPath,
  //             start,
  //             cfg,
  //           }),
  //     );
  //     // await worker.end();
  //   });

  // console.log('zzz', res);
  // return res;

  //   return createFailed({ err, testPath, start, cfg });
  // }
};

// async function tryLoadConfig(testPath, start) {
//   return tryCatch(
//     () => {
//       const cfg = jestRunnerDocks.searchSync();

//       if (!cfg || (cfg && !cfg.config)) {
//         const runnersConf = jestRunnerConfig.searchSync();

//         if (!runnersConf || (runnersConf && !runnersConf.config)) {
//           return {};
//         }
//         return runnersConf.config.docks || runnersConf.config.docs;
//       }

//       return cfg.config;
//     },
//     { testPath, start },
//   );
// }

// async function tryCatch(fn, { testPath, start, cfg }) {
//   let passing = false;
//   try {
//     await fn();
//     passing = true;
//     console.log('zzzzzzzzzzzzzzzzzzzzzzzAAAAAAAAAAAa');
//   } catch (err) {
//     console.log('WAAAAAAAAAAAAAAAAa');
//     if (err.command === 'verb') {
//       const errMsg = err.all
//         .split('\n')
//         .filter((line) => !/\[.+].+/.test(line))
//         .join('\n');
//       const msg = errMsg.replace(
//         /(.*)Error:\s+(.+)/,
//         '$1Error: Failure in `verb`, $2',
//       );

//       return createFailed({ err, testPath, start, cfg }, msg);
//     }

//     return createFailed({ err, testPath, start, cfg });
//   }

//   return passing;
// }

function createFailed({ err, testPath, start, cfg }, message) {
  const msg =
    cfg && cfg.verbose
      ? message || err.stack || err.message
      : message || 'Some unknown error!';

  return {
    hasError: true,
    error: fail({
      start,
      end: new Date(),
      test: {
        path: testPath,
        title: 'Jest Node.js',
        errorMessage: `jest-runner-node: ${msg}`,
      },
    }),
  };
}

// function tryExtensions(filepath, config) {
//   const { extensions } = getWorkspacesAndExtensions(config.cwd);
//   const hasExtension = path.extname(filepath).length > 0;

//   if (hasExtension) {
//     return filepath;
//   }

//   const extension = extensions.find((ext) => fs.existsSync(filepath + ext));
//   if (!extension) {
//     throw new Error(`Cannot find input file: ${filepath}`);
//   }

//   return filepath + extension;
// }
