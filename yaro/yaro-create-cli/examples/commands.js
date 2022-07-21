import { command, isRequired } from 'yaro-command/src/index.js';

export const affected = command(
  '[...names]',
  'List affected workspaces of change in `name` package',
)
  .alias('innit', 'intit')
  .alias('aff', 'affcted', 'affecetd')
  .option('--raw', 'Print raw-only output', { type: Boolean, default: false })
  .option(
    '-p, --packages',
    'Print affected package names, instead of workspaces (which is default)',
    { type: Boolean, default: false },
  )
  .option('--workspace-file', 'File path to write workspaces metadata', {
    default: 'hela-workspace.json',
    // type: String,
    required: isRequired,
    // normalize: true,
  })
  .action(async (options, names) => {
    console.log('affected command', options, names);
  });

export const ensCreate = command(
  'ens create <foo> [...names]',
  'Resolve workspaces and packages information',
)
  .alias('ens cr', 'enscr', 'ens craet', 'ens creat', 'ens:cr', 'ens:new')
  .option('-f, --foo-bar', 'File path to write workspaces metadata')
  .option('--dry-run', 'Run the command without writing new versions to disk', {
    type: Boolean,
    default: false,
  })
  .action(async (options, foo, names) => {
    console.log('run affected command from init command');
    await affected(options, names);
  });

export const ens = command('ens <command>', async (options, cmd, ...args) => {
  await ensCreate(options, ...args);
});

export const lint = command('gaga [...files]', async (options, files) => {
  console.log('formatting and linting files', files);
});

export const xaxa = command((options) => {
  console.log('xaxa lint cmd!', { options });
});

export const fmt = async (options) => {
  console.log('format command, just a simple function style definition');
  console.log('options:', options);
  await xaxa(options);
};

export const foobie = async (options) => {
  console.log('foobie command calls `fmt` (bare function) command');
  await fmt(options);
};
