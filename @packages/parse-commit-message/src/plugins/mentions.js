import getMentions from 'collect-mentions';
import { normalizeCommit /* getValue */ } from '../utils.js';

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
export default function mentionsPlugin(commit, options) {
  const opts = { normalize: true, ...options };
  const cmt = opts.normalize ? normalizeCommit(commit, opts) : commit;

  const commitMentions = [getMentions(cmt.header)]
    .flat()
    .concat(getMentions(cmt.body))
    .concat(getMentions(cmt.footer));

  return { mentions: commitMentions };
}
