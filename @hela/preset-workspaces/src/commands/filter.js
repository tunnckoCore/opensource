// SPDX-License-Identifier: MPL-2.0

import picomatch from 'picomatch';
import workspaces from './workspaces.js';

export default (prog) =>
  prog
    .command(
      'filter <...patterns>',
      'List all packages matching a given filter pattern',
    )
    .option(
      '--npm',
      'Make list of arguments to be passed to `npm publish` with `-w` flag',
      false,
    )
    .option('--raw', 'Return instead of print', false)
    .option('--workspace-file', 'File path to write workspaces metadata', {
      default: 'hela-workspace.json',
      type: 'string',
      normalize: true,
    })
    .action(async ({ flags, patterns, ...data }, meta) => {
      // console.log("patterns", patterns);
      const isMatch = picomatch(patterns);

      const ws = await workspaces(prog)(
        { ...data, flags: { ...flags, raw: true } },
        meta,
      );
      const res = ws.packages.filter((x) => {
        if (patterns.includes(x)) {
          return true;
        }
        // const r = arrayIncludes(ws.resolved, patterns);
        // console.log("r", r);
        // if (r) {
        //   console.log("x", x);
        //   return true;
        // }

        return isMatch(x.replace('/', '.'));
      });

      if (flags.npm) {
        const npmResult = res.reverse().map((pkgName) => {
          const dir = ws.graph[pkgName].resolved;

          return `--workspace ${dir}`;
        });

        return flags.raw
          ? { ws, res: npmResult }
          : npmResult.map((x) => console.log(x));
      }

      return flags.raw ? { ws, res } : res.map((name) => console.log(name));
    });
