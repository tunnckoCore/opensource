#!/usr/bin/env node

// SPDX-License-Identifier: Apache-2.0

import path from 'node:path';
import { fileURLToPath } from 'node:url';

// `yaro` is smaller than `hela`
// that's why we're using it by default
// but anyone can just import the exported hela command in any hela CLI app
// that's why `hela` sits there as peerDependency, only if needed
import { Yaro } from 'yaro';

import { readJSON, command } from './index.js';

const pkgRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const program = new Yaro('asia', {
	defaultsToHelp: false,
	allowUnknownFlags: true,
	singleMode: true,
	version: readJSON(path.join(pkgRoot, 'package.json')).version,
});

await command(null, program);

await program.parse();
