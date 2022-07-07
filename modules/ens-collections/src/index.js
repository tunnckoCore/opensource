// SPDX-License-Identifier: Apache-2.0

/* eslint-disable unicorn/prefer-export-from */

import * as utils from './utils.js';

const collections = await utils.getCollections();
const collectionsList = await utils.getCollections(true);

export { collections, collectionsList, utils };
