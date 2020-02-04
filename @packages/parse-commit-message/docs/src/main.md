_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [.parse](./src/main.js#L51)

Receives and parses a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.

<span id="parse-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="parse-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed into an object like
  `Commit` type
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Array&lt;Commit&gt;}** - if array of commit objects

<span id="parse-examples"></span>

#### Examples

```js
import { parse } from 'parse-commit-message';

const commits = ['fix(ci): tweaks for @circleci config', 'chore: bar qux'];
const result = parse(commits);
console.log(result);
// => [{
//   header: { type: 'fix', scope: 'ci', subject: 'tweaks for @circleci config' },
//   body: null,
//   footer: null,
// }, {
//   header: { type: 'chore', scope: null, subject: 'bar qux' },
//   body: null,
//   footer: null,
// }]

const commitMessage = `feat: awesome yeah

Awesome body!
resolves #123

Signed-off-by: And Footer <abc@exam.pl>`;

const res = parse(commitMessage);

console.log(res);
// => {
//   header: { type: 'feat', scope: null, subject: 'awesome yeah' },
//   body: 'Awesome body!\nresolves #123',
//   footer: 'Signed-off-by: And Footer <abc@exam.pl>',
// }
```

### [.stringify](./src/main.js#L101)

Receives a `Commit` object, validates it using `validate`, builds a "commit"
message string and returns it.

<span id="stringify-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="stringify-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a `Commit` object, or anything that can be
  passed to `check`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Array&lt;string&gt;}** - an array of commit strings like
  `'fix(foo): bar baz'`

This method does checking and validation too, so if you pass a string, it will
be parsed and validated, and after that turned again to string.

<span id="stringify-examples"></span>

#### Examples

```js
import { parse, stringify } from 'parse-commit-message';

const commitMessage = `feat: awesome yeah

Awesome body!
resolves #123

Signed-off-by: And Footer <abc@exam.pl>`;

const flat = true;
const res = parse(commitMessage, flat);

const str = stringify(res, flat);
console.log(str);
console.log(str === commitMessage);
```

### [.validate](./src/main.js#L181)

Validates a single or multiple commit message(s) in form of string, object,
array of strings, array of objects or mixed.

<span id="validate-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="validate-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed & validated into an
  object like `Commit` type
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{CommitResult}** - an object like
  `{ value: Array<Commit>, error: Error }`

<span id="validate-examples"></span>

#### Examples

```js
import { validate } from 'parse-commit-message';

console.log(validate('foo bar qux')); // false
console.log(validate('foo: bar qux')); // true
console.log(validate('fix(ci): bar qux')); // true

console.log(validate(['a bc cqux', 'foo bar qux'])); // false

console.log(validate({ qux: 1 })); // false
console.log(validate({ header: { type: 'fix' } })); // false
console.log(validate({ header: { type: 'fix', subject: 'ok' } })); // true

const commitObject = {
  header: { type: 'test', subject: 'updating tests' },
  foo: 'bar',
  isBreaking: false,
  body: 'oh ah',
};
console.log(validate(commitObject)); // true

const result = validate('foo bar qux');
console.log(result.error);
// => Error: expect \`commit\` to follow:
// <type>[optional scope]: <description>
//
// [optional body]
//
// [optional footer]

const res = validate('fix(ci): okey barry');
console.log(result.value);
// => [{
//   header: { type: 'fix', scope: 'ci', subject: 'okey barry' },
//   body: null,
//   footer: null,
// }]

const commit = { header: { type: 'fix' } };
const { error } = validate(commit);
console.log(error);
// => TypeError: header.subject should be non empty string

const commit = { header: { type: 'fix', scope: 123, subject: 'okk' } };
const { error } = validate(commit);
console.log(error);
// => TypeError: header.scope should be non empty string when given
```

### [.check](./src/main.js#L225)

Receives a single or multiple commit message(s) in form of string, object, array
of strings, array of objects or mixed. Throws if find some error. Think of it as
"assert", it's basically that.

<span id="check-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="check-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed & validated into an
  object like `Commit` type
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Array&lt;Commit&gt;}** - returns the same as given if no
  problems, otherwise it will throw;

<span id="check-examples"></span>

#### Examples

```js
import { check } from 'parse-commit-message';

try {
  check({ header: { type: 'fix' } });
} catch (err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// Can also validate/check a strings, array of strings,
// or even mixed - array of strings and objects
try {
  check('fix(): invalid scope, it cannot be empty');
} catch (err) {
  console.log(err);
  // => TypeError: header.scope should be non empty string when given
}
```
