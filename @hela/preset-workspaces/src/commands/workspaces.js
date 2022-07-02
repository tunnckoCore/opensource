// SPDX-License-Identifier: MPL-2.0

import { hela } from '@hela/core';
import { readJSON, getWorkspaceFile } from '../utils.js';
import init from './init.js';

export default hela()
	.command(
		'workspaces [name]',
		'Load workspace graph file, or list resolved workspace(s)',
	)
	.option('--raw', 'Return instead of print', false)
	// TODO: Yaro should camelize flags
	.option(
		'--workspace-file',
		'File path to write workspaces metadata',
		'hela-workspace.json',
	)
	.alias(['workspace', 'workspaces', 'ws', 'w'])
	.action(async ({ flags }, _, input) => {
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
			workspaceGraph = await init({ flags });
		}

		const ws = workspaceGraph;

		if (input && input.length > 0) {
			return flags.raw ? ws.graph[input] : console.log(ws.graph[input]);
		}

		return flags.raw ? ws : console.log(ws);
	});
