import type { Commit, Options } from '../types.ts';
import { isBreakingChange, normalizeCommit } from '../utils.ts';

/**
 * A plugin that adds `increment` property to the `commit`.
 * It is already included in the `plugins` named export,
 * and in `mappers` named export.
 *
 * **Note: Since v4 this plugin doesn't add `isBreaking` property, use the `isBreaking` plugin instead.**
 *
 * _See the [.plugins](#plugins) and [.mappers](#mappers)  examples._
 *
 * @example
 * import { mappers, plugins } from 'parse-commit-message';
 *
 * console.log(mappers.increment); // => [Function: incrementPlugin]
 * console.log(plugins[1]); // => [Function: incrementPlugin]
 *
 * @name  incrementPlugin
 * @param {Commit} commit a standard `Commit` object
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 * @returns {Commit} plus `{ increment: 'major' | 'minor' | 'patch' | '' }`
 * @public
 */
export default function incrementPlugin(
  commit: Commit,
  options?: Options,
): { increment: 'major' | 'minor' | 'patch' | '' } {
  const opts = { normalize: true, ...options };
  const cmt: Commit = opts.normalize ? normalizeCommit(commit, opts) : commit;
  const isBreaking = isBreakingChange(cmt);
  let commitIncrement: 'major' | 'minor' | 'patch' | '' = '';

  if (/fix|bugfix|patch/i.test(cmt.header.type)) {
    commitIncrement = 'patch';
  }
  if (/feat|feature|minor/i.test(cmt.header.type)) {
    commitIncrement = 'minor';
  }
  if (isBreaking) {
    commitIncrement = 'major';
  }

  return { increment: commitIncrement };
}
