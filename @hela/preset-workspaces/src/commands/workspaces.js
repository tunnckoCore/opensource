// SPDX-License-Identifier: MPL-2.0

import { readJSON, getWorkspaceFile } from '../utils.js';
import init from './init.js';

export default (prog) =>
  prog
    .command(
      'workspaces [name]',
      'Load workspace graph file, or list resolved workspace(s)',
    )
    .option('--raw', 'Return instead of print, (default: true)', true)
    .option('--workspace-file', 'File path to write workspaces metadata', {
      default: 'hela-workspace.json',
      type: 'string',
      normalize: true,
    })
    .alias('workspace', 'ws', 'w')
    .action(async ({ flags, name: input, ...data }, meta) => {
      // console.log('workspacescmd:', flags);
      const workspaceFilePath = getWorkspaceFile(flags);

      let workspaceGraph = false;

      try {
        workspaceGraph = await readJSON(workspaceFilePath);
      } catch (err) {
        if (flags.verbose) {
          console.error(
            'Error while reading workspace graph file, will try to initialize one automatically!',
            err.stack,
          );
        }
      }

      if (!workspaceGraph) {
        if (flags.verbose) {
          console.log('Initializing workspace graph file...');
        }
        workspaceGraph = await init(prog)(
          { flags, name: input, ...data },
          meta,
        );
      }

      const ws = workspaceGraph;

      if (input && input.length > 0) {
        return flags.raw ? ws.graph[input] : console.log(ws.graph[input]);
      }

      return flags.raw ? ws : console.log(ws);
    });
