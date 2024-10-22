

_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [recommendedBump](./src/index.ts#L71)

Calculates recommended bump (next version), based on given `commits`.
It always returns an object. If no commits are given it is `{ increment: false }`.
Otherwise it may contain `patch`, `minor`, or `major` properties which are
of `Array<Commit>` type, based on [parse-commit-message][].

ProTip: Use `result[result.increment]` to get most meanigful result.

Each item passed as `commits` is validated against the Convetional Comits Specification
and using [parse-commit-message][]. Commits can be string, array of commit message strings,
array of objects (of [type Commit as defined](https://github.com/tunnckoCoreLabs/parse-commit-message#type-definitions)) or mix of previous
posibilities.


<span id="recommendedbump-params"></span>

#### Params

- `commits` **{Array&lt;object&gt;}** - commit messages one of `string`, `Array<string>` or `Array<Commit>`
- `options` - pass additional `options.plugins` to be passed to [parse-commit-message][]
- `returns` **{object}** - result like `{ increment: boolean | string, patch?, minor?, major? }`

See the tests and examples for more clarity.

<span id="recommendedbump-examples"></span>

#### Examples

```js
import recommendedBump from 'recommended-bump';

const commits = [
  'chore: foo bar baz',
  `fix(cli): some bugfix msg here

Some awesome body.

Great footer and GPG sign off, yeah!
Signed-off-by: Awesome footer <foobar@gmail.com>`
  ];

const { increment, isBreaking, patch } = recommendedBump(commits);

console.log(isBreaking); // => false
console.log(increment); // => 'patch'
console.log(patch);
// => [{ header: { type, scope, subject }, body, footer }, { ... }]
console.log(patch[0].header.type); // => 'fix'
console.log(patch[0].header.scope); // => 'cli'
console.log(patch[0].header.subject); // => 'some bugfix msg here'
console.log(patch[0].body); // => 'Some awesome body.'
console.log(patch[0].footer);
// => 'Great footer and GPG sign off, yeah!\nSigned-off-by: Awesome footer <foobar@gmail.com>'
```



<span id="recommendedbump-examples"></span>

#### Examples

```js
import { parse } from 'parse-commit-message';
import recommendedBump from 'recommended-bump';

const commitOne = parse('fix: foo bar');
const commitTwo = parse('feat: some feature subject');

const result = recommendedBump([commitOne, commitTwo]);
console.log(result.increment); // => 'minor'
console.log(result.isBreaking); // => false
console.log(result.minor); // => [{ ... }]
```

