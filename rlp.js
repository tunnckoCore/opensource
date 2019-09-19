// // const testResults = pMapSeries(cfgs.reduce((acc) => {}))
// const testResults = await Promise.all(
//   cfgs.reduce(async (acc, { config: cfg = {}, ...opts }) => {
//     options = { ...options, ...opts };

//     const rollupConfig = {
//       ...cfg,
//       input: cfg.input || options.input || testPath,
//     };
//     let result = null;

//     try {
//       result = await rollup(rollupConfig);
//     } catch (err) {
//       return acc.concat(
//         fail({
//           start,
//           end: new Date(),
//           test: {
//             path: testPath,
//             title: 'Rollup',
//             errorMessage: err.message,
//           },
//         }),
//       );
//     }

//     // Classics in the genre! Yes, it's possible, sometimes.
//     // Old habit for ensurance
//     /* istanbul ignore next */
//     if (!result) {
//       return acc.concat(
//         fail({
//           start,
//           end: new Date(),
//           test: {
//             path: testPath,
//             title: 'Rollup',
//             errorMessage: `Rollup runner fails...`,
//           },
//         }),
//       );
//     }

//     const meta = utils.createAliases(config.root, options.srcDir);
//     let relativeTestPath = path.relative(meta.packageRootPath, testPath);

//     if (isWin32 && !relativeTestPath.includes('/')) {
//       relativeTestPath = relativeTestPath.replace(/\\/g, '/');
//     }

//     let outDir = options.outDir || options.outdir;
//     if (isWin32 && !outDir.includes('/')) {
//       outDir = outDir.replace(/\\/g, '/');
//     }

//     const outFileParts = relativeTestPath
//       .split('/')
//       .reduce(
//         (accumulator, x) => acc.concat(x === options.srcDir ? null : x),
//         [],
//       )
//       .filter(Boolean);

//     const outputs = [].concat(rollupConfig.output).filter(Boolean);

//     if (outputs.length === 0) {
//       outputs.push('esm', 'cjs');
//       // outputs.length === 0 ? ['esm', 'cjs']
//     }

//     const responses = outputs.map((outputOptions) => {
//       const outputOpts =
//         typeof outputOptions === 'string'
//           ? { format: outputOptions }
//           : outputOptions;

//       const file = path.join(
//         meta.packageRootPath,
//         outDir,
//         outputOpts.format,
//         ...outFileParts,
//       );

//       return result
//         .write({ ...outputOpts, file })
//         .then(() =>
//           pass({
//             start,
//             end: new Date(),
//             test: { path: outputOpts.file, title: 'Rollup' },
//           }),
//         )
//         .catch((err) =>
//           fail({
//             start,
//             end: new Date(),
//             test: {
//               title: 'Rollup',
//               path: outputOpts.file,
//               errorMessage: err.message,
//             },
//           }),
//         );
//     });

//     return acc.concat(responses);
//   }, []),
// );
