// SPDX-License-Identifier: MPL-2.0

import path from 'node:path';
import fs from 'node:fs';
import { HelaError } from '@hela/core';

export function isObject(val) {
	return val && typeof val === 'object' && Array.isArray(val) === false;
}

export function readJSON(filepath) {
	return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

export function tryLoadFromPackageJson(argv) {
	const pkg = readJSON(path.join(argv.cwd, 'package.json'));

	return pkg.hela;
}

export async function loadConfig(cfgName, argv, prog) {
	let cfg = null;

	// case because we don't yet have the prog's -c, --config parsed
	// name = name || "hela.config.js";

	const isFilepath = String(cfgName).endsWith('.js');
	const name = isFilepath ? path.join(argv.cwd, cfgName) : cfgName;

	try {
		cfg = await import(name);
	} catch {
		throw new HelaError(`Failed to load config: ${name}`);
	}

	// if it's a promise, e.g. a promise resolving to object
	cfg = await cfg;

	if (cfg.default) {
		if (typeof cfg.default === 'string') {
			// eslint-disable-next-line unicorn/no-await-expression-member
			cfg = (await loadConfig(cfg.default, argv, prog)).config;
		}

		if (typeof cfg.default === 'function') {
			cfg = await cfg.default(prog);
			// eslint-disable-next-line promise/prefer-await-to-then
		} else if (cfg.default && cfg.default.then && cfg.default.catch) {
			cfg = await cfg.default;

			if (typeof cfg.default === 'function') {
				cfg = await cfg.default(prog);
			}
		}
	}

	cfg = await cfg;

	const res = {
		config: cfg,
		filepath: isFilepath
			? path.join(argv.cwd, name)
			: path.join(argv.cwd, 'node_modules', name),
	};

	if (argv.verbose) {
		console.log('[info] hela: Loading config ->', name);
	}

	return res;
}
