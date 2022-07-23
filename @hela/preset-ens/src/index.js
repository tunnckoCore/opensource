// SPDX-License-Identifier: Apache-2.0

import { hela } from '@hela/core';

export const createCollection = hela()
  .command('ens:create <collection>', 'Create collection')
  .alias(['create', 'craet'])
  .action(async () => {
    console.log('create!');
  });

export const verify = hela()
  .command('ens:verify <collection>', 'Make a collection verified')
  .alias(['verify', 'veryfi', 'veryfy'])
  .action(async () => {});

export const certify = hela()
  .command('ens:certify <collection>', 'Make a collection certified')
  .alias(['certify', 'certyfi', 'certyfy'])
  .action(async () => {});

export const addNames = hela()
  .command('ens:add:names [...names]', 'Add missing names to a collection')
  .alias(['add:names', 'add:name'])
  .action(async ({ flags, _, ...names }) => {
    console.log(names);
  });

export const addCommunity = hela()
  .command(
    'ens:add:community [...socials]',
    'Add community links to a collection.',
  )
  .alias(['add:community', 'add:commumity', 'add:social', 'add:socials'])
  .action(async ({ flags, _, ...socials }) => {
    console.log(socials);
  });

export const addWebsites = hela()
  .command(
    'ens:add:website [...websites]',
    'Add website links to a collection.',
  )
  .alias(['add:website', 'add:websites', 'add:link', 'add:links'])
  .action(async ({ flags, _, ...websites }) => {
    console.log(websites);
  });

// import path from 'node:path';
// import fs from 'node:fs/promises';
// import { parallel, serial } from '@tunnckocore/p-all';
// import * as utils from './utils.js';
// import { collectionsList, collections } from './index.js';

// console.log(utils.getTokens(utils.getNamesFromCSV(`〇〇九,sasa\n〇四六,dj4s`)));
// console.log(utils.getTokens(`〇〇九,〇四六\nfoo jan\n121`));

// console.log(utils.namify('ens-full-date-club'));
// console.log(utils.namify('english-verbs'));
// console.log(utils.namify('3-digit-palindromes'));
// console.log(utils.namify('3-letter-first-names'));
// console.log(utils.namify('arabic-3-digit-palindromes'));

// console.log(utils.getTokenInfo('⁉️⁉️.eth'));
// console.log(utils.getTokenInfo('٥٦٤.eth'));

// console.log('Collections:', collectionsList.length);
// console.log('1 Hex Club:', collections['palindrome-cities']);

// await convertLogos();

// async function convertLogos() {
//   await serial(collectionsList, async ({ value: collection }) => {
//     const logoDir = utils
//     .getCollectionsPath()
//     .replace(/\/collections/g, '/logos');
//     const logoPath = path.join(logoDir, `${collection.info.slug}.png`);
//     let buf = null;

//     // console.log('logoDir', logoDir);
//     // console.log('logoPath', logoPath);
//     try {
//       buf = await fs.readFile(logoPath);
//     } catch {
//       console.log('collection NOT OK:', collection.info.slug);
//       buf = Buffer.from(''); // empty logo
//     }

//     console.log(`data:image/png;base64,${buf.toString('base64url')}`);
//     // console.log('collection OK');
//   });
// }

// collectionsList.map((x) => {
//   console.log(`-`, x.info.name, x.info.verified ? '**(verified)**' : '');
// });

// console.log(collectionsList.length);
// await updateMetadata();

// async function updateMetadata() {
//   await parallel(await utils.getCollections(true), async ({ value: item }) => {
//     const collection = item;

//     collection.info.name = utils.namify(item.info.slug);
//     // collection.info.supply = Object.keys(collection.data).length;

//     // if (collection.info.verified) {
//     //   console.log('club', collection.info.slug);
//     //   console.log('================');
//     // }
//     // console.log(
//     //   'club %s (%s)',
//     //   collection.info.slug,
//     //   collection.info.verified ? 'verified' : 'not verified',
//     // );

//     await utils.writeCollection(collection);
//   });
// }

// await convertCategoriesToCollections();

// async function convertCategoriesToCollections() {
//   const categoryPath = path.join(
//     path.dirname(import.meta.url.replace('file://', '')),
//     'categories',
//   );
//   const allCategories = await fs.readdir(categoryPath);
//   const list = allCategories.map((x) => path.join(categoryPath, x));

//   console.log('Categories %s', list.length);

//   await serial(list, async ({ value: fp }) => {
//     const categoryCSV = await fs.readFile(fp, 'utf8');
//     const categoryInfo = {
//       slug: utils.slugify(path.basename(fp, path.extname(fp))),
//     };

//     console.log('Converting %s', categoryInfo.slug);

//     const written = await utils.writeCollection(
//       await utils.generateCollection(
//     categoryInfo,
//     utils.getNamesFromCSV(categoryCSV),
//       ),
//     );

//     console.log('Wrote to %s', written);
//   });
// }
