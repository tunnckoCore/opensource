// SPDX-License-Identifier: MPL-2.0

import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';
import asia, { loadConfig } from 'asia-core';

import main from './main.js';

const core = await main({
	fs,
	path,
	asia,
	loadConfig,
	cwd: process.cwd(),
	env: process.env,
	nextTick: process.nextTick,
});

export const { cwd, test, run, env, cache, Cache, config, configPath } = core;

export default test;
