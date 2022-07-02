// import Tinypool from 'tinypool';

// const pool = new Tinypool({
// 	filename: new URL(`./worker.js`, import.meta.url).href,
// 	minThreads: 4,
// 	maxThreads: 8,
// });

// await parallel(affected, ({ value: fp }) => {
// 	const url = new URL(`./${fp}`, import.meta.url);

// 	return pool
// 		.run({ min: 400, max: 4000, filepath: url.pathname })
// 		.then((x) => console.log(url.pathname, 'done', x));
// });

// console.log(new URL(`./packages/asia-core`, import.meta.url));

import path from 'node:path';
import fs from 'node:fs/promises';
import fastGlob from 'fast-glob';

const stream = fastGlob.stream(['**/node_modules/**'], {
	onlyDirectories: true,
});

for await (const entry of stream) {
	await fs.rm(path.resolve(entry), { recursive: true, force: true });
	// .editorconfig
	// services/index.js
}
