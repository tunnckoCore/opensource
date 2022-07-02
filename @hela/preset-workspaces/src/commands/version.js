// SPDX-License-Identifier: MPL-2.0

import path from 'node:path';
import { increment as semverIncrement } from '@tunnckocore/semver-increment';
import { parallel } from '@tunnckocore/p-all';
import { hela, HelaError } from '@hela/core';
import { readJSON, writeJSON } from '../utils.js';
import filter from './filter.js';
import workspaces from './workspaces.js';

// TODO: add git support
export default hela()
	.command(
		'version <semver> <...names>',
		'Bump version of packages given in --filter flag',
	)
	// TODO: Yaro should camelize flags
	.option(
		'--workspace-file',
		'File path to write workspaces metadata',
		'hela-workspace.json',
	)
	.option(
		'--tag',
		'Pass npm dist-tag to be update. Writes it to publishConfig.tag',
	)
	.option(
		'--dry-run',
		'Run the command without writing new versions to disk',
		false,
	)
	.option('--filter', 'Use given name as filter')
	// eslint-disable-next-line max-statements
	.action(async ({ flags }, _, ...inputs) => {
		const [semver, ...names] = inputs;
		const { version, type } = [
			'patch',
			'minor',
			'major',
			'prerelease',
			// 'premajor',
			// 'preminor',
			// 'prepatch',
		].includes(semver)
			? { type: semver }
			: { version: semver };

		const res = new Map();

		// TODO: handle errors better in Yaro, thrown from actions
		// TODO: handle when no names but filter
		if (names.length === 0) {
			throw new HelaError('hela version: missing required `names`');
		}

		if (flags.filter === true) {
			flags.filter = names.map((x) => `*${x}*`);
		}

		flags.filter = [flags.filter].flat().filter(Boolean);

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
			if (!res.has(name) && names.includes(name)) {
				res.set(name, wspc.graph[name]);
			}
		}

		const results = [...res.values()];

		await parallel(results, incrementer(flags, { version, type }));
	});

function incrementer(flags, { version, type }) {
	// TODO: force dry running for now
	flags.dryRun = flags.dryRun ?? true;

	if (flags.dryRun !== true) {
		console.log('Writing changes...');
	}

	// no need for defaulting the item object.
	// no chance getting `{ reason }`, cuz results are not promises.
	return async function incr({ value: item }) {
		const packageJson = path.join(flags.cwd, item.resolved, 'package.json');
		const pkg = await readJSON(packageJson);
		const { version: oldVersion } = pkg;
		const nextVersion = type ? semverIncrement(oldVersion, type) : version;

		if (flags.dryRun) {
			console.log('%s: %s -> %s', item.name, oldVersion, nextVersion);
		}

		if (flags.dryRun !== true) {
			console.log('%s: %s -> %s', item.name, oldVersion, nextVersion);
			pkg.version = nextVersion;
			if (typeof flags.tag === 'string') {
				// eslint-disable-next-line unicorn/consistent-destructuring
				pkg.publishConfig.tag = flags.tag;
			}
			await writeJSON(packageJson, pkg);
		}

		// TODO: add git support
	};
}
