import { Commit } from '../types.ts';
import { normalizeCommit, getValue, isBreakingChange } from '../utils.ts';
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
export default function increment(commit: Commit, normalize: boolean = true) {
  const cmt: Commit = normalize ? normalizeCommit(commit) : commit;
  const isBreaking = isBreakingChange(cmt);
  let commitIncrement = '';

  // complete non-sense, but because TypeScript
  const type = getValue(cmt.header, 'type');

  if (/fix|bugfix|patch/i.test(type)) {
    commitIncrement = 'patch';
  }
  if (/feat|feature|minor/i.test(type)) {
    commitIncrement = 'minor';
  }
  if (isBreaking) {
    commitIncrement = 'major';
  }

  return { increment: commitIncrement };
}
