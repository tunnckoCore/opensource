// SPDX-License-Identifier: MPL-2.0

/* eslint-disable max-classes-per-file */
/* eslint-disable no-param-reassign */

import process from 'node:process';
import dargs from 'dargs';
import { npm, yarn } from 'global-dirs';
import { execa } from 'execa';
import { Yaro } from 'yaro';

const processEnv = process.env;
const globalBins = [npm.binaries, yarn.binaries];

const defaultExecaOptions = {
	stdio: 'inherit',
	env: { ...processEnv },
	cwd: process.cwd(),
	concurrency: 1,
};

/**
 *
 * @param {object} argv
 * @param {object} options
 */
function toFlags(argv, options) {
	const opts = { shortFlag: true, ...options };
	return dargs(argv, opts).join(' ');
}

/**
 *
 * @param {string|string[]} cmd
 * @param {object} [options]
 * @public
 */
async function exec(cmd, options = {}) {
	const envPATH = `${processEnv.PATH}:${globalBins.join(':')}`;
	const env = { ...defaultExecaOptions.env, PATH: envPATH };

	return execa.command(cmd, { ...defaultExecaOptions, env, ...options });
}

class HelaError extends Error {
	constructor(msg) {
		super(msg);
		this.name = 'HelaError';
	}
}

class Hela extends Yaro {
	// eslint-disable-next-line default-param-last
	constructor(progName = 'hela', options) {
		if (progName && typeof progName === 'object') {
			options = progName;
			progName = 'hela';
		}
		super(progName, {
			defaultsToHelp: true,
			allowUnknownFlags: true,
			version: '4.0.0',
			...options,
		});
		this.isHela = true;
	}
}

const hela = (...args) => new Hela(...args);
export { toFlags, exec, hela, Hela, HelaError };
export default hela;
export { utils, Yaro } from 'yaro';
