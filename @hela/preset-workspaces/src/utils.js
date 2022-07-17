// SPDX-License-Identifier: MPL-2.0

import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs/promises';
import { hela } from '@hela/core';
import { fileURLToPath } from 'node:url';
import { parallel } from '@tunnckocore/p-all';

export async function readJSON(filepath) {
  return JSON.parse(await fs.readFile(filepath, 'utf8'));
}
export async function writeJSON(filepath, data, width = 2) {
  const content = JSON.stringify(data, null, width);
  return fs.writeFile(filepath, `${content}\n`, 'utf8');
}

export function getWorkspaceFile(options = {}) {
  return path.join(
    options.cwd || process.cwd(),
    typeof options.workspaceFile === 'string'
      ? options.workspaceFile
      : 'hela-workspace.json',
  );
}

export async function importCommands(progam) {
  const $$dirname = path.dirname(fileURLToPath(import.meta.url));
  const commandsPath = path.join($$dirname, 'commands');
  const cmds = await fs.readdir(commandsPath);
  const commands = cmds.map((x) => path.join(commandsPath, x));

  // single instance for all commands
  const prog = progam || hela();

  const mod = {};
  await parallel(commands, async ({ value: commandPath }) => {
    const cmd = await import(commandPath);
    const name = path.basename(commandPath, path.extname(commandPath));

    mod[name] = cmd.default(prog);
  });

  return mod;
}

export default importCommands;
