// SPDX-License-Identifier: ISC

// `semver` contributors, ISC
// June 27, commit c56a701f456539
// https://github.com/npm/node-semver/blob/c56a701f456539/internal/re.js

// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const opts = ['includePrerelease', 'loose', 'rtl'];

function parseOptions(options) {
	if (!options) return {};
	if (typeof options !== 'object') {
		return { loose: true };
	}

	return opts
		.filter((k) => options[k])

		.reduce((acc, k) => {
			acc[k] = true;
			return acc;
		}, {});
}

export default parseOptions;

export { parseOptions };
