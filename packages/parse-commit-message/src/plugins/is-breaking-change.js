// import mixinDeep from 'mixin-deep';

import { normalizeCommit, /* cleaner, */ isBreakingChange } from '../utils.js';

/**
 * A plugin that adds `isBreakingChange` and `isBreaking` (_deprecated_) properties
 * to the `commit`. It is already included in the `plugins` named export,
 * and in `mappers` named export. Be aware that there's a difference between
 * the utility `isBreakingChange` which has named export (as everything from `src/utils`)
 * and this plugin function.
 *
 * **Note: This plugin was included in v4 release version, previously was part of the `increment` plugin.**
 *
 * _See the [.plugins](#plugins) and [.mappers](#mappers)  examples._
 *
 * @example
 * import { mappers, plugins } from 'parse-commit-message';
 *
 * console.log(mappers.isBreakingChange); // => [Function: isBreakingChangePlugin]
 * console.log(plugins[2]); // => [Function: isBreakingChangePlugin]
 *
 * @name  isBreakingChangePlugin
 * @param {Commit} commit a standard `Commit` object
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 * @returns {Commit} plus `{ isBreakingChange: boolean }`
 * @public
 */
export default function isBreakingChangePlugin(commit, options) {
  const opts = { normalize: true, ...options };
  const cmt = opts.normalize ? normalizeCommit(commit, opts) : commit;
  const isBreaking = isBreakingChange(cmt);

  return {
    isBreakingChange: isBreaking,
    isBreaking, // ! deprecated
  };
  // return mixinDeep(cleaner(cmt), {
  //   isBreakingChange: isBreaking,
  //   isBreaking, // ! deprecated
  // });
}
