// SPDX-License-Identifier: Apache-2.0

/* eslint-disable unicorn/prefer-export-from */

import utils from './utils.js';

const collections = await utils.getCollections();

export { collections, utils };
