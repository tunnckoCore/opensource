// SPDX-License-Identifier: MPL-2.0

import {
  pipeline,
  defaults,
  aliases,
  coerce,
  required,
  isRequired,
} from 'yaro-plugins';
import { yaroParser } from 'yaro-parser';
import createMain from './core.js';

const { UNNAMED_COMMAND_PREFIX, command } = createMain({
  pipeline,
  parser: yaroParser,
  defaults,
  aliases,
  coerce,
  required,
});
const yaroCommand = command;

// eslint-disable-next-line unicorn/prefer-export-from
export { UNNAMED_COMMAND_PREFIX, command, yaroCommand, isRequired };
export default command;
