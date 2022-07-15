// SPDX-License-Identifier: MPL-2.0

import { hela, toFlags, exec } from '@hela/core';
import filter from './filter.js';
import workspaces from './workspaces.js';

// TODO: deduplicate code from `hela version`, it's mostly the same
export default hela()
  .command(
    'publish <...packages>',
    'Publish given package names, using `npm publish -ws`.',
  )
  // All packages affected of change in `@tunnckocore/p-all` package:
  //		hela publish $(hela affected @tunnckocore/p-all -p) --dry-run
  // All asia packages:
  //		hela publish asia --filter --otp 142342
  .alias(['pub', 'pubilsh', 'pblish'])
  .example('publish package-one @scope/my-pkg')
  .example('publish asia --filter')
  .example('publish asia --filter --otp 242005')
  .example('publish mypkg --otp 242005')
  .option(
    '--filter',
    'Treat single package name as filter, so it will resolve all matching packages.',
  )
  .option('--dry-run', 'Do not actually publish to the registry, just preview.')
  .option('--otp', 'Pass 2FA code to the `npm publish` --otp flag')
  .action(async ({ flags }, _, ...inputs) => {
    // NOTE: no need for this, because Yaro handles require arguments
    // if (inputs.length === 0) {
    // 	console.log('hela publish: input packages are required');
    // 	return;
    // }

    if (flags.filter === true) {
      flags.filter = inputs.map((x) => `*${x}*`);
    }

    flags.filter = [flags.filter].flat().filter(Boolean);

    const res = new Map();
    let wspc = false;

    if (flags.filter.length > 0) {
      const filtered = await filter(
        { flags: { ...flags, raw: true } },
        _,
        ...flags.filter,
      );

      wspc = filtered.ws;

      for (const name of filtered.res) {
        if (!res.has(name)) {
          res.set(name, wspc.graph[name]);
        }
      }
    }

    if (wspc === false) {
      wspc = await workspaces({ flags: { ...flags, raw: true } }, _);
    }

    for (const name of wspc.packages) {
      if (!res.has(name) && inputs.includes(name)) {
        res.set(name, wspc.graph[name]);
      }
    }

    const npmFlagsString = toFlags({
      otp: flags.otp,

      // TODO: cleanup when fix Yaro flags
      dryRun: flags.dryRun || flags['dry-run'],

      // TODO: monitor the reverse() thing, i think it's random
      workspace: [...res.values()].map((x) => x.resolved).reverse(),
    });

    await runNpmPublishCommand(npmFlagsString, flags);
  });

async function runNpmPublishCommand(npmFlagsString, opts = {}) {
  const command = `npm publish -ws ${npmFlagsString}`;

  if (opts.dry) {
    console.log('Command that would be executed:\n  $ %s', command);
  } else {
    await exec(command);
  }
}
