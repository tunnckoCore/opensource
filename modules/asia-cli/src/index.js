// SPDX-License-Identifier: MPL-2.0

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import fastGlob from 'fast-glob';
import { parallel } from 'asia-core';
import loadProgram from './program.js';

export function readJSON(filepath) {
	return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

export const DEFAULT_IGNORE = [
	'**/node_modules/**',
	'**/bower_components/**',
	'**/flow-typed/**',
	'**/coverage/**',
	'**/{tmp,temp}/**',
	'**/*.min.js',
	'**/bundle.js',
	'**/.cache/**',
	'**/{fixture,fixtures}/**',
	'**/vendor/**',
	'**/dist/**',
];

export const DEFAULT_PATTERNS = [
	'**/test.js',
	// "**/asia/node-example.js",
	// "**/asia-core/example.js",
	'**/*.spec.js',
	'**/*.test.js',
	'**/test/**/*.js',
	'**/tests/**/*.js',
	'**/__tests__/**/*.js',
].concat(DEFAULT_IGNORE.map((x) => `!${x}`));

async function commandAction({ flags }, _, ...globs) {
	await runAsia(globs, flags);
}

export async function command(options, program) {
	const opts = { ...options };
	const prog = await loadProgram(opts, program);

	// TODO: maybe should be fixed on Yaro
	// that's because on single command mode, you cannot set `.alias`
	if (opts.singleMode || program) {
		return prog.action(commandAction);
	}

	return prog
		.alias(['tst', 'tests', 'testing', 'tset', 'tste', 'tast', 'asia'])
		.action(commandAction);
}

function arrayifiy(val) {
	if (!val) {
		return [];
	}
	if (Array.isArray(val)) {
		return val.flat();
	}
	return [val];
}

export async function runAsia(patterns, options = {}) {
	const flags = { ...options };
	const globs = arrayifiy(patterns);
	const input = globs.length > 0 ? globs : DEFAULT_PATTERNS;

	process.env.ASIA_NO_CACHE = flags.force === true ? '1' : undefined;
	process.env.ASIA_RELOAD = flags.cacheClean === true ? '1' : undefined;
	// NOTE: not needed, since we can just pass patterns
	// to filter out what we want to test
	// process.env.ASIA_MATCH = flags.filter ?? undefined;
	process.env.ASIA_ONLY_FAILED = flags.onlyFailed === true ? '1' : undefined;

	const testFiles = await fastGlob(input, flags);

	await parallel(testFiles, ({ value: testPath }) =>
		import(path.resolve(testPath)),
	);
}
