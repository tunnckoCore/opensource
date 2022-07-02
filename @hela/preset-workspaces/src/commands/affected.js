// SPDX-License-Identifier: MPL-2.0

/* eslint-disable consistent-return */

import { hela } from '@hela/core';
import { serial } from '@tunnckocore/p-all';
import workspaces from './workspaces.js';

export default hela()
	.command(
		'affected [name]',
		'List affected workspaces of change in `name` package',
	)
	.option('--raw', 'Print raw-only output', false)
	.option(
		'-p, --packages',
		'Print affected package names, instead of workspaces (default)',
	)
	// TODO: Yaro should camelize flags
	.option(
		'--workspace-file',
		'File path to write workspaces metadata',
		'hela-workspace.json',
	)
	.action(async ({ flags }, _, input) => {
		const ws = await workspaces({ flags: { ...flags, raw: true } }, _);

		if (flags.verbose) {
			console.log('Resolved workspaces (%s):', ws.resolved.length, ws.resolved);
		}

		if (input) {
			const aff = await affectedOf(input, ws.graph);

			if (flags.verbose) {
				console.log(
					'Affected packages of %s (%s):',
					input,
					aff.packages.length,
					aff.packages,
				);

				console.log(
					'Affected workspaces of %s (%s):',
					input,
					aff.workspaces.length,
					aff.workspaces,
				);
			} else {
				const arr = flags.packages ? aff.packages : aff.workspaces;

				if (!flags.raw) {
					for (const name of arr) console.log(name);
				} else {
					return arr;
				}
				return;
			}
			return;
		}
		console.log('TODO: implement general affected (using git?)');
	});

async function affectedOf(name, graph) {
	const affected_ = { packages: new Set(), workspaces: new Set() };

	async function affectedOfName(pkgName) {
		const pkgMeta = graph[pkgName];
		affected_.packages.add(pkgMeta.name);
		affected_.workspaces.add(pkgMeta.resolved);

		if (pkgMeta.dependents) {
			await serial(pkgMeta.dependents, async ({ value: dependent }) => {
				await affectedOfName(dependent.name);
			});
		}
	}

	await affectedOfName(name);

	return affected_;
}
