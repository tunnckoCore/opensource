// SPDX-License-Identifier: Apache-2.0

import * as utils from './utils.js';

console.log(utils.getTokens(utils.getNamesFromCSV(`〇〇九,sasa\n〇四六,dj4s`)));

console.log(utils.getTokens(`〇〇九,〇四六`));
