// @ts-ignore
// import mixinDeep from 'https://dev.jspm.io/mixin-deep';
import mixinDeep from '../mixin-deep.ts';

import { Commit } from '../types.ts';
import { normalizeCommit, cleaner, isBreakingChange } from '../utils.ts';

export default function isBreakingChangePlugin(
  commit: Commit,
  normalize: boolean = true,
) {
  const cmt: Commit = normalize ? normalizeCommit(commit) : commit;
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
