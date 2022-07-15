// SPDX-License-Identifier: Apache-2.0

export default async (options, program) => {
  const description = 'Lint and format files with ESLint and Prettier';

  // if program is passed, then it's assumed singleMode
  const prefix = program ? '' : 'lint ';

  let prog = null;

  if (program) {
    prog = program.usage('[...patterns]', description);
  } else {
    const { hela } = await import('@hela/core');
    prog = hela(options).command(`${prefix}[...patterns]`, description);
  }

  // TODO: seems like Yaro doesn't work OK, when it's boolean
  // it works if the default is non-boolean, e.g. the `-c, --config` works
  return prog
    .option('-f, --force', 'Force lint, cleaning the cache', false)
    .option(
      '--workspace-file',
      'File path to write workspaces metadata',
      'hela-workspace.json',
    );
};
