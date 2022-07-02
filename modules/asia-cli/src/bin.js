#!/usr/bin/env node

// SPDX-License-Identifier: MPL-2.0

// `yaro` is smaller than `hela`
// that's why we're using it by default
// but anyone can just import the exported hela command in any hela CLI app
// that's why `hela` sits there as peerDependency, only if needed
import { Yaro } from 'yaro';

import { readJSON, command } from './index.js';

const prog = new Yaro('asia', {
	defaultsToHelp: false,
	allowUnknownFlags: true,
	singleMode: true,
	version: readJSON('../package.json').version,
});

await command(null, prog.usage('[...patterns]'));

await prog.parse();
