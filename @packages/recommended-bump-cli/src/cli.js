#!/usr/bin/env node

import proc from 'node:process';
import { yaro } from 'yaro';
import { getRawCommits } from 'git-raw-commits';
import recommendedBump from 'recommended-bump';

const rbc = yaro
  .command('', 'Calculate next version based on Conventional Commits')
  .option('--cwd', 'Working directory', proc.cwd())
  .option('--from', 'From git commit', 'HEAD~1')
  .option('--to', 'To git commit', 'HEAD')
  .action(async (flags) => {
    let increment;

    // console.log('foo');

    for await (const cmt of getRawCommits(flags)) {
      if (typeof increment !== 'string') {
        increment = recommendedBump(cmt).increment;
      }
    }

    if (increment) {
      console.log(increment);
    }
  });

await yaro.run({
  commands: { rbc },
  // rootCommand: rbc,
  version: '3.0.0',
  name: 'recommended-bump-cli',
  showHelpOnEmpty: true,
});
