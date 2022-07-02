// SPDX-License-Identifier: Apache-2.0

import workspaceCommands from '@hela/preset-workspaces';
import { command as xaxaAsHelaCommand } from 'xaxa';
import { command as asiaAsHelaCommand } from 'asia-cli';

export default async () => {
	const workspaces = await workspaceCommands();

	return {
		...workspaces,
		lint: await xaxaAsHelaCommand(),
		test: await asiaAsHelaCommand(),

		// TODO: prettier command
	};
};
