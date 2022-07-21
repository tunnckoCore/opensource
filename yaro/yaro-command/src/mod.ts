// SPDX-License-Identifier: MPL-2.0

import {
  pipeline,
  parser,
  defaults,
  aliases,
  coerce,
  required,
  isRequired,
} from 'https://esm.sh/yaro-plugins/src/index.js';
import { yaro } from 'https://esm.sh/yaro-parser/src/index.js';
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
// export { isRequired } from 'https://esm.sh/yaro-plugins';
