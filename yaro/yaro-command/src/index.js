// SPDX-License-Identifier: MPL-2.0

import {
  pipeline,
  defaults,
  aliases,
  coerce,
  required,
  isRequired,
} from 'yaro-plugins';
import { yaro } from 'yaro-parser';
import createMain from './core.js';

const { UNNAMED_COMMAND_PREFIX, command } = createMain({
  pipeline,
  parser: yaro,
  defaults,
  aliases,
  coerce,
  required,
});

// eslint-disable-next-line unicorn/prefer-export-from
export { UNNAMED_COMMAND_PREFIX, command, isRequired };
export default command;
