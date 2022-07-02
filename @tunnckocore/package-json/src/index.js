import parsePkgName from 'parse-package-name';
import ky from 'ky-universal';

export class PackageJsonError extends Error {
	constructor(message, err) {
		super(message);
		this.name = 'PackageJsonError';
		this.originalError = err;
	}
}

/**
 * Get package metadata from the Unpkg instead of NPM registry.
 * Optionally you can pass `endpoint` function and return the build
 * the registry url.
 *
 * @example
 * import packageJson from '@tunnckocore/package-json';
 *
 * async function main() {
 *   console.log(await packageJson('eslint'));
 *   console.log(await packageJson('package-json@4.0.0'));
 *   console.log(await packageJson('ava@next'));
 *   console.log(await packageJson('@babel/core'));
 *   console.log(await packageJson('@tunnckocore/package-json'));
 * }
 *
 * main().catch(console.error);
 *
 * @name  packageJson
 * @param {string} packageName the package name, supports `pkg-name@1.2.2` (version) and `pkg-name@next` (dist-tag)
 * @param {function} endpoint like `(name, tag) => url`
 * @returns {object} package metadata object
 * @public
 */
export default async function packageJson(packageName, endpoint) {
	const { name, version } = parsePkgName(packageName);
	const tag = version === '' ? 'latest' : version;
	const uri =
		typeof endpoint === 'function'
			? endpoint(name, tag)
			: `https://cdn.jsdelivr.net/npm/${name}@${tag}/package.json`;

	let pkg = null;
	try {
		pkg = await ky
			.get(uri)
			.then((resp) => resp.text())
			.then(JSON.parse);
	} catch (err) {
		// NOTE: jsDelivr can response with 403 Forbidden, if over 50MB
		if (err.response && err.response.status === 403) {
			try {
				// ! so, try through UNPKG.com
				pkg = await packageJson(
					packageName,
					(x, t) => `https://unpkg.com/${x}@${t}/package.json`,
				);
			} catch (err_) {
				throw new PackageJsonError(
					`Package "${name}" not found, even through UNPKG.com!`,
					err_,
				);
			}
			return pkg;
		}

		throw new PackageJsonError(
			`Package "${name}" not found or loading error!`,
			err,
		);
	}
	return pkg;
}
