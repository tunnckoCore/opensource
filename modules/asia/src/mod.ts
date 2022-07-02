// SPDX-License-Identifier: MPL-2.0

import * as path from 'https://deno.land/std/path/mod.ts';
import asia, { loadConfig } from 'https://esm.sh/asia-core';

import main from './main.js';

const fs = {
	mkdir: Deno.mkdir,
	stat: Deno.stat,
	async readFile(...args) {
		return Deno.readTextFile(...args);
	},
	async writeFile(...args) {
		return Deno.writeTextFile(...args);
	},
	async rm(...args) {
		return Deno.remove(...args);
	},
};

const core = await main({
	fs,
	path,
	asia,
	loadConfig,
	cwd: Deno.cwd(),
	env: Deno.env.toObject(),
});

export const { cwd, test, run, env, cache, Cache, config, configPath } = core;

export default test;
