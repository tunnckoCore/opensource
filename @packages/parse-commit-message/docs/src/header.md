_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [.parseHeader](./src/header.js#L31)

Parses given `header` string into an header object. Basically the same as
[.parse](#parse), except that it only can accept single string and returns a
`Header` object.

<span id="parseheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="parseheader-params"></span>

#### Params

- `header` **{string}** - a header stirng like `'fix(foo): bar baz'`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Header}** - a `Header` object like `{ type, scope?, subject }`

_The `parse*` methods are not doing any checking and validation, so you may want
to pass the result to `validateHeader` or `checkHeader`, or to `validateHeader`
with `ret` option set to `true`._

<span id="parseheader-examples"></span>

#### Examples

```js
import { parseHeader } from 'parse-commit-message';

const longCommitMsg = `fix: bar qux

Awesome body!`;

const headerObj = parseCommit(longCommitMsg);
console.log(headerObj);
// => { type: 'fix', scope: null, subject: 'bar qux' }
```

### [.stringifyHeader](./src/header.js#L59)

Receives a `header` object, validates it using `validateHeader`, builds a
"header" string and returns it. Method throws if problems found. Basically the
same as [.stringify](#stringify), except that it only can accept single `Header`
object.

<span id="stringifyheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="stringifyheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{string}** - a header stirng like `'fix(foo): bar baz'`

<span id="stringifyheader-examples"></span>

#### Examples

```js
import { stringifyHeader } from 'parse-commit-message';

const headerStr = stringifyCommit({ type: 'foo', subject: 'bar qux' });
console.log(headerStr); // => 'foo: bar qux'
```

### [.validateHeader](./src/header.js#L115)

Validates given `header` object and returns `boolean`. You may want to pass
`ret` to return an object instead of throwing. Basically the same as
[.validate](#validate), except that it only can accept single `Header` object.

<span id="validateheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="validateheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{CommitResult}** - an object like
  `{ value: Array<Commit>, error: Error }`

<span id="validateheader-examples"></span>

#### Examples

```js
import { validateHeader } from 'parse-commit-message';

const header = { type: 'foo', subject: 'bar qux' };

const headerIsValid = validateHeader(header);
console.log(headerIsValid); // => true

const { value } = validateHeader(header, true);
console.log(value);
// => {
//   header: { type: 'foo', scope: null, subject: 'bar qux' },
//   body: 'okey dude',
//   footer: null,
// }

const { error } = validateHeader(
  {
    type: 'bar',
  },
  true,
);

console.log(error);
// => TypeError: header.subject should be non empty string
```

### [.checkHeader](./src/header.js#L156)

Receives a `Header` and checks if it is valid. Basically the same as
[.check](#check), except that it only can accept single `Header` object.

<span id="checkheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="checkheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `options` **{object}** - options to control the header regex and case
  sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or
  instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive,
  defaults to `false`
- `returns` **{Header}** - returns the same as given if no problems, otherwise
  it will throw.

<span id="checkheader-examples"></span>

#### Examples

```js
import { checkHeader } from 'parse-commit-message';

try {
  checkHeader({ type: 'fix' });
} catch (err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// throws because can accept only Header objects
checkHeader('foo bar baz');
checkHeader(123);
checkHeader([]);
checkHeader([{ type: 'foo', subject: 'bar' }]);
```
