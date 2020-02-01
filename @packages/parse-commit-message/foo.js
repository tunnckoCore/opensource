/* xeslint-disable @typescript-eslint/ban-ts-ignore */
/* xeslint-disable node/file-extension-in-import */
/* xeslint-disable import/extensions */

// import {
//   validate,
//   plugins as basePlugins,
//   applyPlugins,
//   cleaner,
//   Plugins,
//   CommitResult,
//   PossibleCommit,
// } from './src/index.ts';

// const commitMessage = 'fix!: bang bang';

// // double parsing will happen, but that's it for now...
// function parseCommitMessage(
//   commit: PossibleCommit,
//   plugins: Plugins = basePlugins,
// ): CommitResult {
//   // const { error, value } = validate(commit);
//   // if (error) {
//   //   return { error };
//   // }

//   return {
//     value: applyPlugins(plugins, commit).map(cleaner),
//   };
// }

// const { error, value } = parseCommitMessage(commitMessage);

// console.dir(JSON.stringify(value, null, 2));
