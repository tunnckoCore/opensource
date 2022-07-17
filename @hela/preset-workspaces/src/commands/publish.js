// SPDX-License-Identifier: MPL-2.0

import { toFlags, run as runCommands } from '@hela/core';
import filter from './filter.js';
import workspaces from './workspaces.js';

// TODO: deduplicate code from `hela version`, it's mostly the same
export default (prog) =>
  prog
    .command(
      'publish <...packages>',
      'Publish given package names, using `npm publish -ws`.',
    )
    // All packages affected of change in `@tunnckocore/p-all` package:
    //    hela publish $(hela affected @tunnckocore/p-all -p) --dry-run
    // All asia packages:
    //    hela publish asia --filter --otp 142342
    .alias('pub', 'pubilsh', 'pblish', 'pb')
    .example('publish package-one @scope/my-pkg')
    .example('publish asia --filter')
    .example('publish asia --filter --otp 242005')
    .example('publish mypkg --otp 242005')
    .option(
      '--filter',
      'Treat single package name as filter, so it will resolve all matching packages.',
    )
    .option(
      '--dry',
      'Does not run `npm publish`, instead show the compiled command',
      false,
    )
    .option(
      '--dry-run',
      'Runs `npm publish` on dry-run, no publishing to registry.',
      false,
    )
    .option('--otp <code>', 'Pass 2FA code to the `npm publish` --otp flag', {
      type: 'number',
    })
    .action(async ({ flags, packages, ...data }, meta) => {
      // NOTE: no need for this, because Yaro handles required arguments
      // if (packages.length === 0) {
      //   console.log('hela publish: input packages are required');
      //   return;
      // }

      if (flags.filter === true) {
        flags.filter = packages.map((x) => `*${x}*`);
      }

      flags.filter = [flags.filter].flat().filter(Boolean);

      const res = new Map();
      let wspc = false;

      if (flags.filter.length > 0) {
        const filtered = await filter(prog)(
          { ...data, flags: { ...flags, raw: true }, patterns: flags.filter },
          meta,
        );

        wspc = filtered.ws;

        for (const name of filtered.res) {
          if (!res.has(name)) {
            res.set(name, wspc.graph[name]);
          }
        }
      }

      if (wspc === false) {
        wspc = await workspaces(prog)(
          { flags: { ...flags, raw: true }, ...data },
          meta,
        );
      }

      for (const name of wspc.packages) {
        if (!res.has(name) && packages.includes(name)) {
          res.set(name, wspc.graph[name]);
        }
      }

      // TODO: monitor the reverse() thing, i think it's random
      const wsResolved = [...res.values()].map((x) => x.resolved).reverse();

      const npmFlagsString = toFlags({
        otp: flags.otp,
        dryRun: flags.dryRun,

        workspace: wsResolved,
      });

      await runNpmPublishCommand(npmFlagsString, wsResolved, flags);
    });

async function runNpmPublishCommand(npmFlagsString, wsResolved, opts = {}) {
  const command = `npm publish -ws ${npmFlagsString}`;

  if (opts.verbose) {
    console.log('');
    console.log('Preparing to publish:');
    wsResolved.map((pkgPath) => console.log('-', pkgPath));
  }

  if (opts.dry) {
    console.log('Command that would be executed:\n  $ %s', command);
  } else {
    await runCommands(command);
  }

  if (opts.verbose) {
    console.log('');
    console.log('Published:');
    wsResolved.map((pkgPath) => console.log('-', pkgPath));
  }
}
