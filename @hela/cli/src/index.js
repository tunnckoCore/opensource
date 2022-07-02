// SPDX-License-Identifier: MPL-2.0

import process from 'node:process';
import { hela, utils } from '@hela/core';

import { loadConfig, tryLoadFromPackageJson } from './utils.js';

const argv = utils.parseArgv(process.argv.slice(2), {
	default: {
		// a duplicate of below `.option`s
		cwd: process.cwd(),
		showStack: false,
		verbose: false,
		config: 'hela.config.js',
	},
	alias: {
		config: ['c'],
	},
});

const prog = hela({ argv });

prog
	.option('--cwd', 'some global flag', argv.cwd)
	.option('--verbose', 'Print more verbose output', false)
	.option('--showStack', 'Show more detailed info when errors', false)
	.option('-c, --config', 'Path to config file', 'hela.config.js');

export default async function main() {
	const helaConfig = tryLoadFromPackageJson(argv);
	const cfg = await loadConfig(helaConfig ?? argv.config, argv, prog);

	// if local config file is loaded, or a package from `extends`
	if (cfg.filepath.includes('node_modules') || cfg.filepath.endsWith('.js')) {
		prog.extendWith(cfg.config);
	}

	return prog.parse();
}
