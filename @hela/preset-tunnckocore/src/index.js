// SPDX-License-Identifier: Apache-2.0

import workspaceCommands from '@hela/preset-workspaces';
import { command as xaxaAsHelaCommand } from 'xaxa';
import { command as asiaAsHelaCommand } from 'asia-cli';

export default async (prog) => {
  const workspaces = await workspaceCommands(prog);

  return {
    ...workspaces,
    lint: await xaxaAsHelaCommand(),
    // test: await asiaAsHelaCommand(null, prog),

    // TODO: prettier command
  };
};
