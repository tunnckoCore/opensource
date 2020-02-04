_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [.parseCommit](./src/commit.js#L33)

Receives a full commit message `string` and parses it into an `Commit` object
and returns it. Basically the same as [.parse](#parse), except that it only can
accept single string.

<span id="parsecommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="parsecommit-params"></span>

#### Params

- `commit` **{string}** - a message like
  `'fix(foo): bar baz\n\nSome awesome body!'`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Commit}** - a standard object like
  `{ header: Header, body?, footer? }`

_The `parse*` methods are not doing any checking and validation, so you may want
to pass the result to `validateCommit` or `checkCommit`, or to `validateCommit`
with `ret` option set to `true`._

<span id="parsecommit-examples"></span>

#### Examples

```js
import { parseCommit } from 'parse-commit-message';

const commitObj = parseCommit('foo: bar qux\n\nokey dude');
console.log(commitObj);
// => {
//   header: { type: 'foo', scope: null, subject: 'bar qux' },
//   body: 'okey dude',
//   footer: null,
// }
```

### [.stringifyCommit](./src/commit.js#L67)

Receives a `Commit` object, validates it using `validateCommit`, builds a
"commit" string and returns it. Method throws if problems found. Basically the
same as [.stringify](#stringify), except that it only can accept single `Commit`
object.

<span id="stringifycommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="stringifycommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` object like
  `{ header: Header, body?, footer? }`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{string}** - a commit nessage stirng like `'fix(foo): bar baz'`

<span id="stringifycommit-examples"></span>

#### Examples

```js
import { stringifyCommit } from 'parse-commit-message';

const commitStr = stringifyCommit({
  header: { type: 'foo', subject: 'bar qux' },
  body: 'okey dude',
});
console.log(commitStr); // => 'foo: bar qux\n\nokey dude'
```

### [.validateCommit](./src/commit.js#L117)

Validates given `Commit` object and returns `CommitResult`. Basically the same
as [.validate](#validate), except that it only can accept single `Commit`
object.

<span id="validatecommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="validatecommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` like `{ header: Header, body?, footer? }`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{CommitResult}** - an object like
  `{ value: Array<Commit>, error: Error }`

<span id="validatecommit-examples"></span>

#### Examples

```js
import { validateCommit } from 'parse-commit-message';

const commit = {
  header: { type: 'foo', subject: 'bar qux' },
  body: 'okey dude',
};

const commitIsValid = validateCommit(commit);
console.log(commitIsValid); // => true

const { value } = validateCommit(commit, true);
console.log(value);
// => {
//   header: { type: 'foo', scope: null, subject: 'bar qux' },
//   body: 'okey dude',
//   footer: null,
// }
```

### [.checkCommit](./src/commit.js#L157)

Receives a `Commit` and checks if it is valid. Method throws if problems found.
Basically the same as [.check](#check), except that it only can accept single
`Commit` object.

<span id="checkcommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="checkcommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` like `{ header: Header, body?, footer? }`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Commit}** - returns the same as given if no problems, otherwise
  it will throw.

<span id="checkcommit-examples"></span>

#### Examples

```js
import { checkCommit } from 'parse-commit-message';

try {
  checkCommit({ header: { type: 'fix' } });
} catch (err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// throws because can accept only Commit objects
checkCommit('foo bar baz');
checkCommit(123);
checkCommit([{ header: { type: 'foo', subject: 'bar' } }]);
```
