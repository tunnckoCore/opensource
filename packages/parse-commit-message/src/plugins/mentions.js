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
 * @name  mentions
 * @param {Commit} commit a standard `Commit` object
 * @returns {Commit} plus `{ mentions: Array<Mention> }`
 * @public
 */
export default function mentions(commit, options) {
  const opts = { normalize: true, ...options };
  const cmt = opts.normalize ? normalizeCommit(commit, opts) : commit;

  const commitMentions = []
    .concat(getMentions(cmt.header))
    .concat(getMentions(cmt.body))
    .concat(getMentions(cmt.footer));

  return { mentions: commitMentions };
}
