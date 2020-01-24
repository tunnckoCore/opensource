// import mixinDeep from 'mixin-deep';

import { normalizeCommit, /* cleaner, */ isBreakingChange } from '../utils.js';

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
