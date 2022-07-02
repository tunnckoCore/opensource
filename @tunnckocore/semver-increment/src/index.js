// SPDX-License-Identifier: ISC

/* eslint-disable no-param-reassign */

// `semver` contributors, ISC
// June 27, commit c56a701f456539
// https://github.com/npm/node-semver/blob/c56a701f456539/internal/re.js
//
// - stripped only to have the needed for `.inc`
// - converted to ESM

import { re, t } from './re.js';
import { parseOptions } from './parse-options.js';

const NUMERIC = /^\d+$/;
const MAX_LENGTH = 256;
const MAX_SAFE_INTEGER =
	Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9_007_199_254_740_991;

const compareIdentifiers = (a, b) => {
	const anum = NUMERIC.test(a);
	const bnum = NUMERIC.test(b);

	if (anum && bnum) {
		a = +a;
		b = +b;
	}

	return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};

export class SemVer {
	// eslint-disable-next-line max-statements
	constructor(version, options) {
		options = parseOptions(options);

		if (version instanceof SemVer) {
			if (
				version.loose === !!options.loose &&
				version.includePrerelease === !!options.includePrerelease
			) {
				// eslint-disable-next-line no-constructor-return
				return version;
			}

			// eslint-disable-next-line prefer-destructuring
			version = version.version;
		} else if (typeof version !== 'string') {
			throw new TypeError(`Invalid Version: ${version}`);
		}

		if (version.length > MAX_LENGTH) {
			throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
		}

		this.options = options;
		this.loose = !!options.loose;
		// this isn't actually relevant for versions, but keep it so that we
		// don't run into trouble passing this.options around.
		this.includePrerelease = !!options.includePrerelease;

		const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);

		if (!m) {
			throw new TypeError(`Invalid Version: ${version}`);
		}

		this.raw = version;

		// these are actually numbers
		this.major = +m[1];
		this.minor = +m[2];
		this.patch = +m[3];

		if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
			throw new TypeError('Invalid major version');
		}

		if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
			throw new TypeError('Invalid minor version');
		}

		if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
			throw new TypeError('Invalid patch version');
		}

		// numberify any prerelease numeric ids
		this.prerelease = []; // default

		if (m[4]) {
			this.prerelease = m[4].split('.').map((id) => {
				if (/^\d+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) {
						return num;
					}
				}
				return id;
			});
		}

		this.build = m[5] ? m[5].split('.') : [];
		this.format();
	}

	format() {
		this.version = `${this.major}.${this.minor}.${this.patch}`;
		if (this.prerelease.length > 0) {
			this.version += `-${this.prerelease.join('.')}`;
		}
		return this.version;
	}

	toString() {
		return this.version;
	}

	// preminor will bump the version up to the next minor release, and immediately
	// down to pre-release. premajor and prepatch work the same way.
	inc(release, identifier) {
		switch (release) {
			case 'premajor':
				this.prerelease.length = 0;
				this.patch = 0;
				this.minor = 0;
				this.major += 1;
				this.inc('pre', identifier);
				break;
			case 'preminor':
				this.prerelease.length = 0;
				this.patch = 0;
				this.minor += 1;
				this.inc('pre', identifier);
				break;
			case 'prepatch':
				// If this is already a prerelease, it will bump to the next version
				// drop any prereleases that might already exist, since they are not
				// relevant at this point.
				this.prerelease.length = 0;
				this.inc('patch', identifier);
				this.inc('pre', identifier);
				break;
			// If the input is a non-prerelease version, this acts the same as
			// prepatch.
			case 'prerelease':
				if (this.prerelease.length === 0) {
					this.inc('patch', identifier);
				}
				this.inc('pre', identifier);
				break;

			case 'major':
				// If this is a pre-major version, bump up to the same major version.
				// Otherwise increment major.
				// 1.0.0-5 bumps to 1.0.0
				// 1.1.0 bumps to 2.0.0
				if (
					this.minor !== 0 ||
					this.patch !== 0 ||
					this.prerelease.length === 0
				) {
					this.major += 1;
				}
				this.minor = 0;
				this.patch = 0;
				this.prerelease = [];
				break;
			case 'minor':
				// If this is a pre-minor version, bump up to the same minor version.
				// Otherwise increment minor.
				// 1.2.0-5 bumps to 1.2.0
				// 1.2.1 bumps to 1.3.0
				if (this.patch !== 0 || this.prerelease.length === 0) {
					this.minor += 1;
				}
				this.patch = 0;
				this.prerelease = [];
				break;
			case 'patch':
				// If this is not a pre-release version, it will increment the patch.
				// If it is a pre-release it will bump up to the same patch version.
				// 1.2.0-5 patches to 1.2.0
				// 1.2.0 patches to 1.2.1
				if (this.prerelease.length === 0) {
					this.patch += 1;
				}
				this.prerelease = [];
				break;
			// This probably shouldn't be used publicly.
			// 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
			case 'pre':
				if (this.prerelease.length === 0) {
					this.prerelease = [0];
				} else {
					let i = this.prerelease.length;

					// eslint-disable-next-line no-plusplus
					while (--i >= 0) {
						if (typeof this.prerelease[i] === 'number') {
							this.prerelease[i] += 1;
							i = -2;
						}
					}
					if (i === -1) {
						// didn't increment anything
						this.prerelease.push(0);
					}
				}
				if (identifier) {
					// 1.2.0-beta.1 bumps to 1.2.0-beta.2,
					// 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
					if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
						if (Number.isNaN(this.prerelease[1])) {
							this.prerelease = [identifier, 0];
						}
					} else {
						this.prerelease = [identifier, 0];
					}
				}
				break;

			default:
				throw new Error(`invalid increment argument: ${release}`);
		}
		this.format();
		this.raw = this.version;
		return this;
	}
}

// eslint-disable-next-line max-params, consistent-return
export function increment(version, release, options, identifier) {
	if (typeof options === 'string') {
		identifier = options;
		options = undefined;
	}

	try {
		return new SemVer(
			version instanceof SemVer ? version.version : version,
			options,
		).inc(release, identifier).version;
	} catch {}
}

export default SemVer;
