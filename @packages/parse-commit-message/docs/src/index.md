_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [.applyPlugins](./src/index.js#L102)

Apply a set of `plugins` over all of the given `commits`. A plugin is a simple
function passed with `Commit` object, which may be returned to modify and set
additional properties to the `Commit` object.

<span id="applyplugins-signature"></span>

#### Signature

```ts
function(plugins, commits, options)
```

<span id="applyplugins-params"></span>

#### Params

- `plugins` **{Plugins}** - a simple function like `(commit) => {}`
- `commits` **{PossibleCommit}** - a PossibleCommit or an array of strings; a
  value which should already be gone through `parse`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Array&lt;Commit&gt;}** - plus the modified or added properties
  from each function in `plugins`

_The `commits` should be coming from `parse`, `validate` (with `ret` option) or
the `check` methods. It does not do checking and validation._

<span id="applyplugins-examples"></span>

#### Examples

```js
import dedent from 'dedent';
import { applyPlugins, plugins, parse, check } from 'parse-commit-message';

const commits = [
  'fix: bar qux',
  dedent`feat(foo): yea yea

  Awesome body here with @some mentions
  resolves #123

  BREAKING CHANGE: ouch!`,
  'chore(ci): updates for ci config',
  {
    header: { type: 'fix', subject: 'Barry White' },
    body: 'okey dude',
    foo: 'possible',
  },
];

// Parses, normalizes, validates
// and applies plugins
const results = applyPlugins(plugins, check(parse(commits)));

console.log(results);
// => [ { body: null,
//   footer: null,
//   header: { scope: null, type: 'fix', subject: 'bar qux' },
//   mentions: [],
//   increment: 'patch',
//   isBreaking: false },
// { body: 'Awesome body here with @some mentions\nresolves #123',
//   footer: 'BREAKING CHANGE: ouch!',
//   header: { scope: 'foo', type: 'feat', subject: 'yea yea' },
//   mentions: [ [Object] ],
//   increment: 'major',
//   isBreaking: true },
// { body: null,
//   footer: null,
//   header:
//    { scope: 'ci', type: 'chore', subject: 'updates for ci config' },
//   mentions: [],
//   increment: false,
//   isBreaking: false },
// { body: 'okey dude',
//   footer: null,
//   header: { scope: null, type: 'fix', subject: 'Barry White' },
//   foo: 'possible',
//   mentions: [],
//   increment: 'patch',
//   isBreaking: false } ]
```

### [.plugins](./src/index.js#L186)

An array which includes `mentions`, `isBreakingChange` and `increment` built-in
plugins. The `mentions` is an array of objects - basically what's returned from
the [collect-mentions][] package.

<span id="plugins-examples"></span>

#### Examples

```js
import { plugins, applyPlugins, parse } from 'parse-commit-message';

console.log(plugins); // =>  [mentions, increment]
console.log(plugins[0]); // => [Function mentions]
console.log(plugins[0]); // => [Function increment]

const cmts = parse([
  'fix: foo @bar @qux haha',
  'feat(cli): awesome @tunnckoCore feature\n\nSuper duper baz!'
  'fix: ooh\n\nBREAKING CHANGE: some awful api change'
]);

const commits = applyPlugins(plugins, cmts);
console.log(commits);
// => [
//   {
//     header: { type: 'fix', scope: '', subject: 'foo bar baz' },
//     body: '',
//     footer: '',
//     increment: 'patch',
//     isBreaking: false,
//     mentions: [
//       { handle: '@bar', mention: 'bar', index: 8 },
//       { handle: '@qux', mention: 'qux', index: 13 },
//     ]
//   },
//   {
//     header: { type: 'feat', scope: 'cli', subject: 'awesome feature' },
//     body: 'Super duper baz!',
//     footer: '',
//     increment: 'minor',
//     isBreaking: false,
//     mentions: [
//       { handle: '@tunnckoCore', mention: 'tunnckoCore', index: 18 },
//     ]
//   },
//   {
//     header: { type: 'fix', scope: '', subject: 'ooh' },
//     body: 'BREAKING CHANGE: some awful api change',
//     footer: '',
//     increment: 'major',
//     isBreaking: true,
//     mentions: [],
//   },
// ]
```

### [.mappers](./src/index.js#L219)

An object (named set) which includes `mentions` and `increment` built-in
plugins.

<span id="mappers-examples"></span>

#### Examples

```js
import { mappers, applyPlugins, parse } from 'parse-commit-message';

console.log(mappers); // => { mentions, increment }
console.log(mappers.mentions); // => [Function mentions]
console.log(mappers.increment); // => [Function increment]

const flat = true;
const parsed = parse('fix: bar', flat);
console.log(parsed);
// => {
//   header: { type: 'feat', scope: 'cli', subject: 'awesome feature' },
//   body: 'Super duper baz!',
//   footer: '',
// }

const commit = applyPlugins([mappers.increment], parsed);
console.log(commit);
// => [{
//   header: { type: 'feat', scope: 'cli', subject: 'awesome feature' },
//   body: 'Super duper baz!',
//   footer: '',
//   increment: 'patch',
// }]
```
