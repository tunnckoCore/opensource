import { hela } from '@hela/core';

export const cli = hela().option('--foo [bar]', 'some new global flag');

export const init = cli
  .command('init', 'Initialize a project')
  .alias('innit', 'inti')
  .option('--foo [bar]', 'Some flag descr')
  .action(() => {
    console.log('init!!!');
  });

export const ensInit = cli
  .command('ens init', 'initialize some ens things')
  .alias('intit', 'initit', 'inint')
  .action(({ options }, { settings }) => {
    console.log('ens initialized', options, settings);
  });

export const ensCreate = cli
  .command('ens create <collection> [...names]', 'Create collection')
  .alias('create', 'creat', 'craet', 'craete', 'cr')
  .action(async ({ collection, names, options }, { globalOptions }) => {
    console.log('create!');
    console.log('collection:', collection);
    console.log('names:', names);
    console.log('options:', options);
    console.log('globalOptions:', globalOptions);
  });
