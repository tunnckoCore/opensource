# @tunnckocore/semver-increment

Trimmed down version of the `semver` package, with just `increment` (semver.inc)
functionality and converted to ESM.

```js
import { increment, SemVer } from '@tunnckocore/semver-increment';

// SemVer = trimmed down SemVer class with just `inc` method.

const nextVersion = increment('1.1.3', 'patch');

console.log(nextVersion);
```
