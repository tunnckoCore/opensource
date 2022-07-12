// SPDX-License-Identifier: Apache-2.0

import fsSync, { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { serial } from '@tunnckocore/p-all';
import uts46 from 'idna-uts46-hx';

import BigNumber from 'bn.js';
import keccak256 from 'keccak256';

export function getTokens(str) {
	return getListOfNames(str).map((name) => getTokenInfo(name));
}

export function getNamesFromCSV(str) {
	return str
		.split(/\s+/g)
		.map((line) => {
			// skip given ids, we regenerate correct ones
			const [name, _] = line.split(',');
			// skip headers
			if (name === 'name') {
				return null;
			}

			return name.trim().toLowerCase();
		})
		.filter(Boolean);
}

export function getTokenInfo(name) {
	if (!name) {
		throw new TypeError('getToken: requires non-empty `name` string argument');
	}
	const clearName = name.replace(/\.eth$/, '');

	// INFO: eth-ens-namehash uses .toAscii ...
	// at least we use the default options from there
	const label = uts46.toUnicode(clearName, {
		useStd3ASCII: true,
		transitional: false,
	});

	const ascii = uts46.toAscii(clearName, {
		useStd3ASCII: true,
		transitional: false,
	});

	const hash = keccak256(label);
	const id = new BigNumber(hash, 'hex').toString();

	return {
		ascii,
		label,
		name: `${clearName}.eth`,
		hash,
		id,
	};
}

export function sortObject(val) {
	return Object.fromEntries(Object.entries(val).sort());
}

export async function readJSON(filepath) {
	return JSON.parse(await fs.readFile(filepath, 'utf8'));
}

export function getCollectionsPath(tryCreate = true, cwd = false) {
	const ensCwd = process.env.ENS_COLLECTIONS_CWD;
	const pwd = ensCwd || (cwd ? cwd.replace('file://') : null);
	const dir = pwd || path.dirname(path.dirname(fileURLToPath(import.meta.url)));
	const collectionsDir = path.join(dir, 'collections');

	if (tryCreate) {
		fsSync.mkdirSync(collectionsDir, { recursive: true });
	}

	return collectionsDir;
}

/**
 * Gets all collections from `collections/` directory into a single object,
 * of `{ collectionName: collection }`.
 *
 * @returns {object}
 */
export async function getCollections(list, mapper, { tryCreate, cwd } = {}) {
	const collectionsPath = getCollectionsPath(tryCreate, cwd);
	const allCollections = await fs.readdir(collectionsPath);
	const collections = allCollections.map((x) => path.join(collectionsPath, x));

	const expose = list ? [] : {};

	await serial(collections, async ({ value: collectionPath }) => {
		// console.log('collectionPath abc:', collectionPath);
		const collection = await readJSON(collectionPath);
		const name = path.basename(collectionPath, path.extname(collectionPath));

		// don't buffer huge amounts of data into memory
		if (typeof mapper === 'function') {
			await mapper(collection, name, collectionPath);
			return;
		}

		if (list) {
			expose.push(collection);
		} else {
			expose[name] = collection;
		}
	});

	return expose;
}

export function arrayify(val) {
	if (!val) return [];
	if (Array.isArray(val)) {
		return val.flat();
	}
	return [val];
}

export function decamelize(str = '') {
	return str
		.replace(/([A-Z]{2,})(\d+)/g, '$1 $2')
		.replace(/([\da-z]+)([A-Z]{2,})/g, '$1 $2')

		.replace(/([\da-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][\da-z]+)/g, '$1 $2');
}

export function camelize(str = '') {
	const name = namify(str).split(' ').join('');

	return name.slice(0, 1).toLowerCase() + name.slice(1);
}

export function namify(str = '') {
	const parts = str.split('-');

	return parts.map((p) => p.slice(0, 1).toUpperCase() + p.slice(1)).join(' ');
}

export function slugify(val = '') {
	return decamelize(val.trim())
		.toLowerCase()
		.replace(/[^\da-z]+/g, '-');
}

/**
 * Convert any type of names list, to an array.
 *
 * @param {string} val - comma-separated or newline-separated list of names
 * @returns {string[]} - list of names
 */
export function getListOfNames(val) {
	if (!val) return [];
	if (Array.isArray(val)) return val.flat();

	const names = val.split(/[\s,]+/g);

	return names.map((x) => x.trim().toLowerCase()).filter(Boolean);
}

export async function generateCollection(info, names) {
	const result = getListOfNames(names)
		.filter(Boolean)
		.reduce(
			(acc, name) => {
				let token = null;

				try {
					token = getTokenInfo(name);
				} catch (err) {
					// skip gracefully, it's invalid domain
					if (err.message.includes('Illegal char')) {
						console.log('skipping %s, invalid domain!', name);
						return acc;
					}
					throw err;
				}

				acc.data[token.label] = token.id;
				acc.info.supply += 1;

				return acc;
			},
			{ info: { ...info, supply: 0 }, data: {} },
		);

	return normalizeCollection(result);
}

/**
 *
 * type Project = {
 *	info: {
 *    verified: boolean;
 *		name: string;
 *	 	description: string;
 *	  slug?: string;
 *		supply: number; // auto-calculated
 *		links: string[]; // websites, and etc
 *		community: string[]; // just social media and chats
 *		logo: string; // url preferably; if not given we generate one from the symbol/slug
 *	};
 *	data: {
 *		[label: string]: string; // label: tokenId
 *	};
 * };
 *
 * @param {Project} project
 */
export async function writeCollection(project, { tryCreate, cwd } = {}) {
	const collectionsDir = getCollectionsPath(tryCreate, cwd);
	const collectionDestination = path.join(collectionsDir, project.info.slug);
	const dest = `${collectionDestination}.json`;

	await fs.writeFile(dest, JSON.stringify(project, null, 2));

	return dest;
}

export async function getCollection(name, { tryCreate, cwd } = {}) {
	const collection = await readJSON(
		path.join(getCollectionsPath(tryCreate, cwd), `${name}.json`),
	);

	return collection;
}

export async function verifyCollection(val) {
	const name = typeof val === 'string' ? slugify(val) : val.info.slug;
	const collection = await getCollection(name);

	collection.info.verified = true;

	await writeCollection(collection);

	return collection;
}

export function normalizeCollection(project = {}) {
	const result = { info: { ...project.info }, data: { ...project.data } };

	// Normalizations
	result.info.verified = false;
	result.info.name = result.info.name?.trim();
	result.info.slug = result.info.slug?.trim();
	result.info.supply = result.info.supply ?? Object.keys(result.data).length;

	// if no slug provided, we create one from the given name
	result.info.slug = slugify(result.info.slug ?? result.info.name);
	result.info.name = result.info.name ?? namify(result.info.slug);
	result.info.description = result.info.desc || result.info.description;
	result.info.description = result.info.description?.trim();
	result.info.links = arrayify(result.info.links);
	result.info.community = arrayify(result.info.community);

	// sort names/labels
	result.data = sortObject(result.data);

	return result;
}

export async function addLinkToCollection(val, links, community = false) {
	const name = typeof val === 'string' ? slugify(val) : val.info.slug;
	const collection = await getCollection(name);
	const _links = arrayify(links);
	const type = community ? 'community' : 'links';

	collection.info[type].push(..._links);

	await writeCollection(collection);

	return collection;
}

export async function addCommunityToCollection(val, links) {
	return addLinkToCollection(val, links, true);
}

export async function addNamesToCollection(collectionName, names) {
	const collection = await getCollection(collectionName);

	getTokens(names).map((token) => {
		collection.data[token.label] = token.id;
		collection.info.supply += 1;

		return null;
	});

	// console.log(collection);
	// const project = await generateCollection(collection, names);

	const collectionDest = await writeCollection(normalizeCollection(collection));

	return collectionDest;
}

// export async function extractCollections(cwd) {
// 	await getCollections(null, async (collection, _, collectionPath) => {
// 		const collectionFilename = path.basename(collectionPath);
// 		const collectionsDir = await getCollectionsPath(true, cwd);
// 		const dest = path.join(collectionsDir, collectionFilename);
// 		console.log('xx', dest);
// 	});
// }

// testing unicodes
// console.log(getToken('tunnckocore.eth'));
// console.log(getToken('5848'));
// console.log(getToken('025°'));
// console.log(getToken('🇪🇬egypt'));
// console.log(getToken('😱😱😱'));

// console.log(
// 	await generateCollection({
// 		name: '24h Club: Timekeepers',

// 		description: 'The eternal #TimeKeepers.',

// 		// if you want to be the same as the name, skip it
// 		slug: '24h-club',

// 		// url to IPFS-uploaded logo
// 		logo: 'http://ipfs-link/24h-club.png',

// 		// all app/website like links
// 		links: [
// 			'https://www.ensclock.com',
// 			'https://ens.vision/categories/24h-club', // example second link
// 		],

// 		// all social media and chats, in one place
// 		community: [
// 			'https://discord.gg/fQazeMMkXC',
// 			'https://twitter.com/24hClubOfficial',
// 		],
// 	}),
// );

// console.log(getListOfNames('foo, bar,baz\nsasa,susy,sa\r\nquxie '));

// the flow should be:
// 1) person open Issue template
// 2) we detect that event from Github Workflows
// 3) parse the issue body
// 4) create collection by passing info & names (string of comma/newline-separated names)
// 5) create PR adding the create collection
//
// await writeCollection(
// 	await generateCollection({}, getListOfNames('sa,sasa,foo')),
// );
