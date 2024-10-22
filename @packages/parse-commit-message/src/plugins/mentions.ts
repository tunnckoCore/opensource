import getMentions from 'collect-mentions';

import type { Commit, Mention, Options } from '../types.ts';
import { normalizeCommit /* getValue */ } from '../utils.ts';

/**
 * A plugin that adds `mentions` array property to the `commit`.
 * It is already included in the `plugins` named export,
 * and in `mappers` named export.
 * Basically each entry in that array is an object,
 * directly returned from the [collect-mentions][].
 *
 * _See the [.plugins](#plugins) and [.mappers](#mappers)  examples._
 *
 * @example
 * import { mappers, plugins } from 'parse-commit-message';
 *
 * console.log(mappers.mentions); // => [Function: mentionsPlugin]
 * console.log(plugins[0]); // => [Function: mentionsPlugin]
 *
 * @name  mentionsPlugin
 * @param {Commit} commit a standard `Commit` object
 * @param {object} options options to control the header regex and case sensitivity
 * @param {RegExp|string} options.headerRegex string regular expression or instance of RegExp
 * @param {boolean} options.caseSensitive whether or not to be case sensitive, defaults to `false`
 * @returns {Commit} plus `{ mentions: Array<Mention> }`
 * @public
 */
export default function mentionsPlugin(commit: Commit, options?: Options): { mentions: Mention[] } {
  const opts = { normalize: true, mentionsWithDot: false, ...options };
  const cmt = opts.normalize ? normalizeCommit(commit, opts) : commit;

  const commitMentions = [
    getMentions(
      cmt.header?.subject || ((cmt.header as any)?.value as any) || '',
      opts.mentionsWithDot,
    ),
  ]
    .flat()
    .concat(getMentions(cmt.body || '', opts.mentionsWithDot))
    .concat(getMentions(cmt.footer || '', opts.mentionsWithDot));

  return { mentions: commitMentions };
}
