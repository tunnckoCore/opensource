import { normalizeCommit, isBreakingChange } from '../utils.js';

/**
 * A plugin that adds `increment` and `isBreaking` properties
 * to the `commit`. It is already included in the `plugins` named export,
 * and in `mappers` named export.
 *
 * **Note: Since v4 this plugin doesn't add `isBreaking` property, use the `isBreaking` plugin instead.**
 *
 * _See the [.plugins](#plugins) and [.mappers](#mappers)  examples._
 *
 * @name  increment
 * @param {Commit} commit a standard `Commit` object
 * @returns {Commit} plus `{ increment: string }`
 * @public
 */
export default function increment(commit, options) {
  const opts = { normalize: true, ...options };
  const cmt = opts.normalize ? normalizeCommit(commit, opts) : commit;
  const isBreaking = isBreakingChange(cmt);
  let commitIncrement = '';

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
