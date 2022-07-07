// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parallel } from '@tunnckocore/p-all';
import uts46 from 'idna-uts46-hx';
import { ethers } from 'ethers';

export function getTokenInfo(name) {
	if (!name) {
		throw new TypeError('getToken: requires non-empty `name` string argument');
	}

	const label = uts46.toUnicode(name.replace(/\.eth$/, ''), {
		useStd3ASCII: true,
	});

	const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label));
	const id = ethers.BigNumber.from(hash).toString();

	return {
		id,
		label,
		hash,
	};
}

export function sortObject(val) {
	return Object.fromEntries(Object.entries(val).sort());
}

export async function readJSON(filepath) {
	return JSON.parse(await fs.readFile(filepath, 'utf8'));
}

export function getCollectionsPath() {
	const $$dirname = path.dirname(fileURLToPath(import.meta.url));
	const collectionsDir = path.join($$dirname, 'collections');

	return collectionsDir;
}

/**
 * Gets all collections from `collections/` directory into a single object,
 * of `{ collectionName: collection }`.
 *
 * @returns {object}
 */
export async function getCollections() {
	const collectionsPath = getCollectionsPath();
	const allCollections = await fs.readdir(collectionsPath);
	const collections = allCollections.map((x) => path.join(collectionsPath, x));

	const expose = {};

	await parallel(collections, async ({ value: collectionPath }) => {
		const collection = await readJSON(collectionPath);
		const name = path.basename(collectionPath, path.extname(collectionPath));

		expose[name] = collection;
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

	return names.map((x) => x.trim()).filter(Boolean);
}

export async function generateCollection(info, names) {
	const result = getListOfNames(names)
		.filter(Boolean)
		.reduce(
			(acc, name) => {
				const { label, id } = getTokenInfo(name);
				acc.data[label] = id;
				acc.info.supply += 1;

				return acc;
			},
			{ info: { ...info, supply: 0 }, data: {} },
		);

	// Normalizations
	result.info.verified = false;
	result.info.name = result.info.name.trim();
	result.info.slug = result.info.slug?.trim();

	// if no slug provided, we create one from the given name
	result.info.slug = slugify(result.info.slug ?? result.info.name);
	result.info.description = result.info.desc || result.info.description;
	result.info.description = result.info.description.trim();
	result.info.links = arrayify(result.info.links);
	result.info.community = arrayify(result.info.community);

	// sort names/labels
	result.data = sortObject(result.data);

	return result;
}

/**
 *
 * type Project = {
 *	info: {
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
export async function writeCollection(project) {
	const collectionsDir = getCollectionsPath();
	const collectionDestination = path.join(collectionsDir, project.info.slug);

	await fs.writeFile(collectionDestination, JSON.stringify(project, null, 2));

	return collectionDestination;
}

export async function getCollection(name) {
	const collection = await readJSON(
		path.join(getCollectionsPath(), `${name}.json`),
	);

	return collection;
}

export async function verifyCollection(val) {
	const name = typeof val === 'string' ? slugify(val) : val.info.slug;
	const project = await getCollection(name);

	project.info.verified = true;

	await writeCollection(project);

	return project;
}

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
