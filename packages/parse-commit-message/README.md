

# parse-commit-message [![npm version][npmv-img]][npmv-url] [![License][license-img]][license-url] [![Libera Manifesto][libera-manifesto-img]][libera-manifesto-url]

> Extensible parser for git commit messages following Conventional Commits Specification

Please consider following this project's author, [Charlike Mike Reagent](https://github.com/tunnckoCore), and :star: the project to show your :heart: and support.

<div id="readme"></div>

[![Code style][codestyle-img]][codestyle-url]
[![CircleCI linux build][linuxbuild-img]][linuxbuild-url]
[![CodeCov coverage status][codecoverage-img]][codecoverage-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]
[![Time Since Last Commit][last-commit-img]][last-commit-url]

<!-- [![Semantically Released][standard-release-img]][standard-release-url] -->

If you have any _how-to_ kind of questions, please read the [Contributing Guide][contributing-url] and [Code of Conduct][code_of_conduct-url] documents.
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping
[@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

[![Conventional Commits][ccommits-img]][ccommits-url]
[![Minimum Required Nodejs][nodejs-img]][npmv-url]
[![NPM Downloads Monthly][downloads-monthly-img]][npmv-url]
[![NPM Downloads Total][downloads-total-img]][npmv-url]
[![Share Love Tweet][twitter-share-img]][twitter-share-url]
[![Twitter][twitter-img]][twitter-url]

Project is [semantically](https://semver.org) versioned & automatically released from [GitHub Actions](https://github.com/features/actions) with [Lerna](https://github.com/lerna/lerna).

[![Become a Patron][patreon-img]][patreon-url]
[![Buy me a Kofi][kofi-img]][kofi-url]
[![PayPal Donation][paypal-img]][paypal-url]
[![Bitcoin Coinbase][bitcoin-img]][bitcoin-url]
[![Keybase PGP][keybase-img]][keybase-url]

| Topic                                                            |                                           Contact |
| :--------------------------------------------------------------- | ------------------------------------------------: |
| Any legal or licensing questions, like private or commerical use |           ![tunnckocore_legal][tunnckocore_legal] |
| For any critical problems and security reports                   |     ![tunnckocore_security][tunnckocore_security] |
| Consulting, professional support, personal or team training      | ![tunnckocore_consulting][tunnckocore_consulting] |
| For any questions about Open Source, partnerships and sponsoring | ![tunnckocore_opensource][tunnckocore_opensource] |

<!-- Logo when needed:

<p align="center">
  <a href="https://github.com/tunnckoCore/opensource">
    <img src="./media/logo.png" width="85%">
  </a>
</p>

-->

## Table of Contents

- [Install](#install)
  * [.parseCommit](#parsecommit)
    + [Signature](#signature)
    + [Params](#params)
    + [Examples](#examples)
  * [.stringifyCommit](#stringifycommit)
    + [Signature](#signature-1)
    + [Params](#params-1)
    + [Examples](#examples-1)
  * [.validateCommit](#validatecommit)
    + [Signature](#signature-2)
    + [Params](#params-2)
    + [Examples](#examples-2)
  * [.checkCommit](#checkcommit)
    + [Signature](#signature-3)
    + [Params](#params-3)
    + [Examples](#examples-3)
  * [.parseCommit](#parsecommit-1)
    + [Signature](#signature-4)
    + [Params](#params-4)
    + [Examples](#examples-4)
  * [.stringifyCommit](#stringifycommit-1)
    + [Signature](#signature-5)
    + [Params](#params-5)
    + [Examples](#examples-5)
  * [.validateCommit](#validatecommit-1)
    + [Signature](#signature-6)
    + [Params](#params-6)
    + [Examples](#examples-6)
  * [.checkCommit](#checkcommit-1)
    + [Signature](#signature-7)
    + [Params](#params-7)
    + [Examples](#examples-7)
  * [.applyPlugins](#applyplugins)
    + [Signature](#signature-8)
    + [Params](#params-8)
    + [Examples](#examples-8)
  * [.plugins](#plugins)
    + [Examples](#examples-9)
  * [.mappers](#mappers)
    + [Examples](#examples-10)
  * [.parseHeader](#parseheader)
    + [Signature](#signature-9)
    + [Params](#params-9)
    + [Examples](#examples-11)
  * [.stringifyHeader](#stringifyheader)
    + [Signature](#signature-10)
    + [Params](#params-10)
    + [Examples](#examples-12)
  * [.validateHeader](#validateheader)
    + [Signature](#signature-11)
    + [Params](#params-11)
    + [Examples](#examples-13)
  * [.checkHeader](#checkheader)
    + [Signature](#signature-12)
    + [Params](#params-12)
    + [Examples](#examples-14)
  * [.parse](#parse)
    + [Signature](#signature-13)
    + [Params](#params-13)
    + [Examples](#examples-15)
  * [.stringify](#stringify)
    + [Signature](#signature-14)
    + [Params](#params-14)
    + [Examples](#examples-16)
  * [.validate](#validate)
    + [Signature](#signature-15)
    + [Params](#params-15)
    + [Examples](#examples-17)
  * [.check](#check)
    + [Signature](#signature-16)
    + [Params](#params-16)
    + [Examples](#examples-18)
  * [.parse](#parse-1)
    + [Signature](#signature-17)
    + [Params](#params-17)
    + [Examples](#examples-19)
  * [.stringify](#stringify-1)
    + [Signature](#signature-18)
    + [Params](#params-18)
    + [Examples](#examples-20)
  * [.validate](#validate-1)
    + [Signature](#signature-19)
    + [Params](#params-19)
    + [Examples](#examples-21)
  * [.check](#check-1)
    + [Signature](#signature-20)
    + [Params](#params-20)
    + [Examples](#examples-22)
  * [.applyPlugins](#applyplugins-1)
    + [Signature](#signature-21)
    + [Params](#params-21)
    + [Examples](#examples-23)
  * [.plugins](#plugins-1)
    + [Examples](#examples-24)
  * [.mappers](#mappers-1)
    + [Examples](#examples-25)
  * [.parseHeader](#parseheader-1)
    + [Signature](#signature-22)
    + [Params](#params-22)
    + [Examples](#examples-26)
  * [.stringifyHeader](#stringifyheader-1)
    + [Signature](#signature-23)
    + [Params](#params-23)
    + [Examples](#examples-27)
  * [.validateHeader](#validateheader-1)
    + [Signature](#signature-24)
    + [Params](#params-24)
    + [Examples](#examples-28)
  * [.checkHeader](#checkheader-1)
    + [Signature](#signature-25)
    + [Params](#params-25)
    + [Examples](#examples-29)
  * [.parse](#parse-2)
    + [Signature](#signature-26)
    + [Params](#params-26)
    + [Examples](#examples-30)
  * [.stringify](#stringify-2)
    + [Signature](#signature-27)
    + [Params](#params-27)
    + [Examples](#examples-31)
  * [.validate](#validate-2)
    + [Signature](#signature-28)
    + [Params](#params-28)
    + [Examples](#examples-32)
  * [.check](#check-2)
    + [Signature](#signature-29)
    + [Params](#params-29)
    + [Examples](#examples-33)
- [Contributing](#contributing)
  * [Guides and Community](#guides-and-community)
  * [Support the project](#support-the-project)
  * [OPEN Open Source](#open-open-source)
  * [Wonderful Contributors](#wonderful-contributors)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## Install

This project requires [**Node.js**](https://nodejs.org) **>=10.13.0** _(see [Support & Release Policy](https://github.com/tunnckoCoreLabs/support-release-policy))_. Install it using
[**yarn**](https://yarnpkg.com) or [**npm**](https://npmjs.com).<br>
_We highly recommend to use Yarn when you think to contribute to this project._

```bash
$ yarn add parse-commit-message
```

<!-- docks-start -->

### [.parseCommit](./src/commit.js#L30)

Receives a full commit message `string` and parses it into an `Commit` object
and returns it.
Basically the same as [.parse](#parse), except that
it only can accept single string.

<span id="parsecommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="parsecommit-params"></span>

#### Params

- `commit` **{string}** - a message like `'fix(foo): bar baz\n\nSome awesome body!'`
- `returns` **{Commit}** - a standard object like `{ header: Header, body?, footer? }`

_The `parse*` methods are not doing any checking and validation,
so you may want to pass the result to `validateCommit` or `checkCommit`,
or to `validateCommit` with `ret` option set to `true`._

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

### [.stringifyCommit](./src/commit.js#L61)

Receives a `Commit` object, validates it using `validateCommit`,
builds a "commit" string and returns it. Method throws if problems found.
Basically the same as [.stringify](#stringify), except that
it only can accept single `Commit` object.

<span id="stringifycommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="stringifycommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` object like `{ header: Header, body?, footer? }`
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

### [.validateCommit](./src/commit.js#L108)

Validates given `Commit` object and returns `CommitResult`.
Basically the same as [.validate](#validate), except that
it only can accept single `Commit` object.

<span id="validatecommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="validatecommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` like `{ header: Header, body?, footer? }`
- `returns` **{CommitResult}** - an object like `{ value: Array<Commit>, error: Error }`

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

### [.checkCommit](./src/commit.js#L145)

Receives a `Commit` and checks if it is valid. Method throws if problems found.
Basically the same as [.check](#check), except that
it only can accept single `Commit` object.

<span id="checkcommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="checkcommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` like `{ header: Header, body?, footer? }`
- `returns` **{Commit}** - returns the same as given if no problems, otherwise it will throw.

<span id="checkcommit-examples"></span>

#### Examples

```js
import { checkCommit } from 'parse-commit-message';

try {
  checkCommit({ header: { type: 'fix' } });
} catch(err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// throws because can accept only Commit objects
checkCommit('foo bar baz');
checkCommit(123);
checkCommit([{ header: { type: 'foo', subject: 'bar' } }]);
```

<!-- docks-end -->

<!-- docks-start -->
<!-- docks-end -->

<!-- docks-start -->

### [.parseCommit](./src/commit.js#L30)

Receives a full commit message `string` and parses it into an `Commit` object
and returns it.
Basically the same as [.parse](#parse), except that
it only can accept single string.

<span id="parsecommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="parsecommit-params"></span>

#### Params

- `commit` **{string}** - a message like `'fix(foo): bar baz\n\nSome awesome body!'`
- `returns` **{Commit}** - a standard object like `{ header: Header, body?, footer? }`

_The `parse*` methods are not doing any checking and validation,
so you may want to pass the result to `validateCommit` or `checkCommit`,
or to `validateCommit` with `ret` option set to `true`._

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

### [.stringifyCommit](./src/commit.js#L61)

Receives a `Commit` object, validates it using `validateCommit`,
builds a "commit" string and returns it. Method throws if problems found.
Basically the same as [.stringify](#stringify), except that
it only can accept single `Commit` object.

<span id="stringifycommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="stringifycommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` object like `{ header: Header, body?, footer? }`
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

### [.validateCommit](./src/commit.js#L108)

Validates given `Commit` object and returns `CommitResult`.
Basically the same as [.validate](#validate), except that
it only can accept single `Commit` object.

<span id="validatecommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="validatecommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` like `{ header: Header, body?, footer? }`
- `returns` **{CommitResult}** - an object like `{ value: Array<Commit>, error: Error }`

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

### [.checkCommit](./src/commit.js#L145)

Receives a `Commit` and checks if it is valid. Method throws if problems found.
Basically the same as [.check](#check), except that
it only can accept single `Commit` object.

<span id="checkcommit-signature"></span>

#### Signature

```ts
function(commit, options)
```

<span id="checkcommit-params"></span>

#### Params

- `commit` **{Commit}** - a `Commit` like `{ header: Header, body?, footer? }`
- `returns` **{Commit}** - returns the same as given if no problems, otherwise it will throw.

<span id="checkcommit-examples"></span>

#### Examples

```js
import { checkCommit } from 'parse-commit-message';

try {
  checkCommit({ header: { type: 'fix' } });
} catch(err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// throws because can accept only Commit objects
checkCommit('foo bar baz');
checkCommit(123);
checkCommit([{ header: { type: 'foo', subject: 'bar' } }]);
```

<!-- docks-end -->

<!-- docks-start -->

### [.applyPlugins](./src/index.js#L99)

Apply a set of `plugins` over all of the given `commits`.
A plugin is a simple function passed with `Commit` object,
which may be returned to modify and set additional properties
to the `Commit` object.

<span id="applyplugins-signature"></span>

#### Signature

```ts
function(plugins, commits, options)
```

<span id="applyplugins-params"></span>

#### Params

- `plugins` **{Plugins}** - a simple function like `(commit) => {}`
- `commits` **{PossibleCommit}** - a PossibleCommit or an array of strings; a value which should already be gone through `parse`
- `returns` **{Array&lt;Commit&gt;}** - plus the modified or added properties from each function in `plugins`

_The `commits` should be coming from `parse`, `validate` (with `ret` option)
or the `check` methods. It does not do checking and validation._

<span id="applyplugins-examples"></span>

#### Examples

```js
import dedent from 'dedent';
import { applyPlugins, plugins, parse, check } from './src';

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

### [.plugins](./src/index.js#L183)

An array which includes `mentions` and `increment` built-in plugins.
The `mentions` is an array of objects. Basically what's returned from
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

### [.mappers](./src/index.js#L216)

An object (named set) which includes `mentions` and `increment` built-in plugins.

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
console.log(commit)
// => [{
//   header: { type: 'feat', scope: 'cli', subject: 'awesome feature' },
//   body: 'Super duper baz!',
//   footer: '',
//   increment: 'patch',
// }]
```

<!-- docks-end -->

<!-- docks-start -->

### [.parseHeader](./src/header.js#L28)

Parses given `header` string into an header object.
Basically the same as [.parse](#parse), except that
it only can accept single string and returns a `Header` object.

<span id="parseheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="parseheader-params"></span>

#### Params

- `header` **{string}** - a header stirng like `'fix(foo): bar baz'`
- `returns` **{Header}** - a `Header` object like `{ type, scope?, subject }`

_The `parse*` methods are not doing any checking and validation,
so you may want to pass the result to `validateHeader` or `checkHeader`,
or to `validateHeader` with `ret` option set to `true`._

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

### [.stringifyHeader](./src/header.js#L53)

Receives a `header` object, validates it using `validateHeader`,
builds a "header" string and returns it. Method throws if problems found.
Basically the same as [.stringify](#stringify), except that
it only can accept single `Header` object.

<span id="stringifyheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="stringifyheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `returns` **{string}** - a header stirng like `'fix(foo): bar baz'`

<span id="stringifyheader-examples"></span>

#### Examples

```js
import { stringifyHeader } from 'parse-commit-message';

const headerStr = stringifyCommit({ type: 'foo', subject: 'bar qux' });
console.log(headerStr); // => 'foo: bar qux'
```

### [.validateHeader](./src/header.js#L106)

Validates given `header` object and returns `boolean`.
You may want to pass `ret` to return an object instead of throwing.
Basically the same as [.validate](#validate), except that
it only can accept single `Header` object.

<span id="validateheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="validateheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `returns` **{CommitResult}** - an object like `{ value: Array<Commit>, error: Error }`

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

const { error } = validateHeader({
  type: 'bar'
}, true);

console.log(error);
// => TypeError: header.subject should be non empty string
```

### [.checkHeader](./src/header.js#L147)

Receives a `Header` and checks if it is valid.
Basically the same as [.check](#check), except that
it only can accept single `Header` object.

<span id="checkheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="checkheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `options` **{object}** - options to control the header regex and case sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive, defaults to `false`
- `returns` **{Header}** - returns the same as given if no problems, otherwise it will throw.

<span id="checkheader-examples"></span>

#### Examples

```js
import { checkHeader } from 'parse-commit-message';

try {
  checkHeader({ type: 'fix' });
} catch(err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// throws because can accept only Header objects
checkHeader('foo bar baz');
checkHeader(123);
checkHeader([]);
checkHeader([{ type: 'foo', subject: 'bar' }]);
```

<!-- docks-end -->

<!-- docks-start -->

### [.parse](./src/main.js#L49)

Receives and parses a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.

<span id="parse-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="parse-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed into an object like `Commit` type
- `returns` **{Array&lt;Commit&gt;}** - if array of commit objects

<span id="parse-examples"></span>

#### Examples

```js
import { parse } from 'parse-commit-message';

const commits = [
  'fix(ci): tweaks for @circleci config',
  'chore: bar qux'
];
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

### [.stringify](./src/main.js#L96)

Receives a `Commit` object, validates it using `validate`,
builds a "commit" message string and returns it.

<span id="stringify-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="stringify-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a `Commit` object, or anything that can be passed to `check`
- `returns` **{Array&lt;string&gt;}** - an array of commit strings like `'fix(foo): bar baz'`

This method does checking and validation too,
so if you pass a string, it will be parsed and validated,
and after that turned again to string.

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

### [.validate](./src/main.js#L173)

Validates a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.

<span id="validate-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="validate-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed & validated into an object like `Commit` type
- `returns` **{CommitResult}** - an object like `{ value: Array<Commit>, error: Error }`

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

### [.check](./src/main.js#L214)

Receives a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.
Throws if find some error. Think of it as "assert", it's basically that.

<span id="check-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="check-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed & validated into an object like `Commit` type
- `returns` **{Array&lt;Commit&gt;}** - returns the same as given if no problems, otherwise it will throw;

<span id="check-examples"></span>

#### Examples

```js
import { check } from 'parse-commit-message';

try {
  check({ header: { type: 'fix' } });
} catch(err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// Can also validate/check a strings, array of strings,
// or even mixed - array of strings and objects
try {
  check('fix(): invalid scope, it cannot be empty')
} catch(err) {
  console.log(err);
  // => TypeError: header.scope should be non empty string when given
}
```

<!-- docks-end -->

<!-- docks-start -->

### [.parse](./src/main.js#L49)

Receives and parses a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.

<span id="parse-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="parse-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed into an object like `Commit` type
- `returns` **{Array&lt;Commit&gt;}** - if array of commit objects

<span id="parse-examples"></span>

#### Examples

```js
import { parse } from 'parse-commit-message';

const commits = [
  'fix(ci): tweaks for @circleci config',
  'chore: bar qux'
];
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

### [.stringify](./src/main.js#L96)

Receives a `Commit` object, validates it using `validate`,
builds a "commit" message string and returns it.

<span id="stringify-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="stringify-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a `Commit` object, or anything that can be passed to `check`
- `returns` **{Array&lt;string&gt;}** - an array of commit strings like `'fix(foo): bar baz'`

This method does checking and validation too,
so if you pass a string, it will be parsed and validated,
and after that turned again to string.

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

### [.validate](./src/main.js#L173)

Validates a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.

<span id="validate-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="validate-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed & validated into an object like `Commit` type
- `returns` **{CommitResult}** - an object like `{ value: Array<Commit>, error: Error }`

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

### [.check](./src/main.js#L214)

Receives a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.
Throws if find some error. Think of it as "assert", it's basically that.

<span id="check-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="check-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed & validated into an object like `Commit` type
- `returns` **{Array&lt;Commit&gt;}** - returns the same as given if no problems, otherwise it will throw;

<span id="check-examples"></span>

#### Examples

```js
import { check } from 'parse-commit-message';

try {
  check({ header: { type: 'fix' } });
} catch(err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// Can also validate/check a strings, array of strings,
// or even mixed - array of strings and objects
try {
  check('fix(): invalid scope, it cannot be empty')
} catch(err) {
  console.log(err);
  // => TypeError: header.scope should be non empty string when given
}
```

<!-- docks-end -->

<!-- docks-start -->
<!-- docks-end -->

<!-- docks-start -->

### [.applyPlugins](./src/index.js#L99)

Apply a set of `plugins` over all of the given `commits`.
A plugin is a simple function passed with `Commit` object,
which may be returned to modify and set additional properties
to the `Commit` object.

<span id="applyplugins-signature"></span>

#### Signature

```ts
function(plugins, commits, options)
```

<span id="applyplugins-params"></span>

#### Params

- `plugins` **{Plugins}** - a simple function like `(commit) => {}`
- `commits` **{PossibleCommit}** - a PossibleCommit or an array of strings; a value which should already be gone through `parse`
- `returns` **{Array&lt;Commit&gt;}** - plus the modified or added properties from each function in `plugins`

_The `commits` should be coming from `parse`, `validate` (with `ret` option)
or the `check` methods. It does not do checking and validation._

<span id="applyplugins-examples"></span>

#### Examples

```js
import dedent from 'dedent';
import { applyPlugins, plugins, parse, check } from './src';

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

### [.plugins](./src/index.js#L183)

An array which includes `mentions` and `increment` built-in plugins.
The `mentions` is an array of objects. Basically what's returned from
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

### [.mappers](./src/index.js#L216)

An object (named set) which includes `mentions` and `increment` built-in plugins.

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
console.log(commit)
// => [{
//   header: { type: 'feat', scope: 'cli', subject: 'awesome feature' },
//   body: 'Super duper baz!',
//   footer: '',
//   increment: 'patch',
// }]
```

<!-- docks-end -->

<!-- docks-start -->

### [.parseHeader](./src/header.js#L28)

Parses given `header` string into an header object.
Basically the same as [.parse](#parse), except that
it only can accept single string and returns a `Header` object.

<span id="parseheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="parseheader-params"></span>

#### Params

- `header` **{string}** - a header stirng like `'fix(foo): bar baz'`
- `returns` **{Header}** - a `Header` object like `{ type, scope?, subject }`

_The `parse*` methods are not doing any checking and validation,
so you may want to pass the result to `validateHeader` or `checkHeader`,
or to `validateHeader` with `ret` option set to `true`._

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

### [.stringifyHeader](./src/header.js#L53)

Receives a `header` object, validates it using `validateHeader`,
builds a "header" string and returns it. Method throws if problems found.
Basically the same as [.stringify](#stringify), except that
it only can accept single `Header` object.

<span id="stringifyheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="stringifyheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `returns` **{string}** - a header stirng like `'fix(foo): bar baz'`

<span id="stringifyheader-examples"></span>

#### Examples

```js
import { stringifyHeader } from 'parse-commit-message';

const headerStr = stringifyCommit({ type: 'foo', subject: 'bar qux' });
console.log(headerStr); // => 'foo: bar qux'
```

### [.validateHeader](./src/header.js#L106)

Validates given `header` object and returns `boolean`.
You may want to pass `ret` to return an object instead of throwing.
Basically the same as [.validate](#validate), except that
it only can accept single `Header` object.

<span id="validateheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="validateheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `returns` **{CommitResult}** - an object like `{ value: Array<Commit>, error: Error }`

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

const { error } = validateHeader({
  type: 'bar'
}, true);

console.log(error);
// => TypeError: header.subject should be non empty string
```

### [.checkHeader](./src/header.js#L147)

Receives a `Header` and checks if it is valid.
Basically the same as [.check](#check), except that
it only can accept single `Header` object.

<span id="checkheader-signature"></span>

#### Signature

```ts
function(header, options)
```

<span id="checkheader-params"></span>

#### Params

- `header` **{Header}** - a `Header` object like `{ type, scope?, subject }`
- `options` **{object}** - options to control the header regex and case sensitivity
- `options.headerRegex` **{RegExp|string}** - string regular expression or instance of RegExp
- `options.caseSensitive` **{boolean}** - whether or not to be case sensitive, defaults to `false`
- `returns` **{Header}** - returns the same as given if no problems, otherwise it will throw.

<span id="checkheader-examples"></span>

#### Examples

```js
import { checkHeader } from 'parse-commit-message';

try {
  checkHeader({ type: 'fix' });
} catch(err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// throws because can accept only Header objects
checkHeader('foo bar baz');
checkHeader(123);
checkHeader([]);
checkHeader([{ type: 'foo', subject: 'bar' }]);
```

<!-- docks-end -->

<!-- docks-start -->

### [.parse](./src/main.js#L49)

Receives and parses a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.

<span id="parse-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="parse-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed into an object like `Commit` type
- `returns` **{Array&lt;Commit&gt;}** - if array of commit objects

<span id="parse-examples"></span>

#### Examples

```js
import { parse } from 'parse-commit-message';

const commits = [
  'fix(ci): tweaks for @circleci config',
  'chore: bar qux'
];
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

### [.stringify](./src/main.js#L96)

Receives a `Commit` object, validates it using `validate`,
builds a "commit" message string and returns it.

<span id="stringify-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="stringify-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a `Commit` object, or anything that can be passed to `check`
- `returns` **{Array&lt;string&gt;}** - an array of commit strings like `'fix(foo): bar baz'`

This method does checking and validation too,
so if you pass a string, it will be parsed and validated,
and after that turned again to string.

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

### [.validate](./src/main.js#L173)

Validates a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.

<span id="validate-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="validate-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed & validated into an object like `Commit` type
- `returns` **{CommitResult}** - an object like `{ value: Array<Commit>, error: Error }`

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

### [.check](./src/main.js#L214)

Receives a single or multiple commit message(s) in form of string,
object, array of strings, array of objects or mixed.
Throws if find some error. Think of it as "assert", it's basically that.

<span id="check-signature"></span>

#### Signature

```ts
function(commits, options)
```

<span id="check-params"></span>

#### Params

- `commits` **{PossibleCommit}** - a value to be parsed & validated into an object like `Commit` type
- `returns` **{Array&lt;Commit&gt;}** - returns the same as given if no problems, otherwise it will throw;

<span id="check-examples"></span>

#### Examples

```js
import { check } from 'parse-commit-message';

try {
  check({ header: { type: 'fix' } });
} catch(err) {
  console.log(err);
  // => TypeError: header.subject should be non empty string
}

// Can also validate/check a strings, array of strings,
// or even mixed - array of strings and objects
try {
  check('fix(): invalid scope, it cannot be empty')
} catch(err) {
  console.log(err);
  // => TypeError: header.scope should be non empty string when given
}
```

<!-- docks-end -->

**[back to top](#readme)**

## Contributing

### Guides and Community

Please read the [Contributing Guide][contributing-url] and [Code of Conduct][code_of_conduct-url] documents for advices.

For bug reports and feature requests, please join our [community][community-url] forum and open a thread there with prefixing the title of the thread with the name of the project if there's no separate channel for it.

Consider reading the [Support and Release Policy](https://github.com/tunnckoCoreLabs/support-release-policy) guide if you are interested in what are the supported Node.js versions and how we proceed. In short, we support latest two even-numbered Node.js release lines.

### Support the project

[Become a Partner or Sponsor?][patreon-url] :dollar: Check the **Partner**, **Sponsor** or **Omega-level** tiers! :tada: You can get your company logo, link & name on this file. It's also rendered on package page in [npmjs.com][npmv-url] and [yarnpkg.com](https://yarnpkg.com/en/package/parse-commit-message) sites too! :rocket:

Not financial support? Okey! [Pull requests](https://github.com/tunnckoCoreLabs/contributing#opening-a-pull-request), stars and all kind of [contributions](https://opensource.guide/how-to-contribute/#what-it-means-to-contribute) are always
welcome. :sparkles:

<!--
### OPEN Open Source

This project is following [OPEN Open Source](http://openopensource.org) model

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is built on collective efforts and it's not strongly guarded by its founders.

There are a few basic ground-rules for its contributors

1. Any **significant modifications** must be subject to a pull request to get feedback from other contributors.
2. [Pull requests](https://github.com/tunnckoCoreLabs/contributing#opening-a-pull-request) to get feedback are _encouraged_ for any other trivial contributions, but are not required.
3. Contributors should attempt to adhere to the prevailing code-style and development workflow.
-->

### Wonderful Contributors

Thanks to the hard work of these wonderful people this project is alive! It follows the
[all-contributors](https://github.com/kentcdodds/all-contributors) specification.
Don't hesitate to add yourself to that list if you have made any contribution! ;) [See how,
here](https://github.com/jfmengels/all-contributors-cli#usage).

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/5038030?v=4" width="120px;"/><br /><sub><b>Charlike Mike Reagent</b></sub>](https://tunnckocore.com)<br />[💻](https://github.com/tunnckoCore/opensource/commits?author=tunnckoCore "Code") [📖](https://github.com/tunnckoCore/opensource/commits?author=tunnckoCore "Documentation") [💬](#question-tunnckoCore "Answering Questions") [👀](#review-tunnckoCore "Reviewed Pull Requests") [🔍](#fundingFinding-tunnckoCore "Funding Finding") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

Consider showing your [support](#support-the-project) to them. :sparkling_heart:

**[back to top](#readme)**

## License

Copyright (c) 2018-present, [Charlike Mike Reagent](https://tunnckocore.com) `<opensource@tunnckocore.com>` & [contributors](#wonderful-contributors).<br>
Released under the [MPL-2.0 License][license-url].

[contributing-url]: https://github.com/tunnckoCore/opensource/blob/master/CONTRIBUTING.md
[code_of_conduct-url]: https://github.com/tunnckoCore/opensource/blob/master/CODE_OF_CONDUCT.md

<!-- Heading badges -->

[npmv-url]: https://www.npmjs.com/package/parse-commit-message
[npmv-img]: https://badgen.net/npm/v/parse-commit-message?icon=npm&cache=300
[license-url]: https://github.com/tunnckoCore/opensource/blob/master/packages/parse-commit-message/LICENSE
[license-img]: https://badgen.net/npm/license/parse-commit-message?cache=300
[libera-manifesto-url]: https://liberamanifesto.com
[libera-manifesto-img]: https://badgen.net/badge/libera/manifesto/grey

<!-- Front line badges -->

[codecoverage-img]: https://badgen.net/badge/coverage/65.61%25/orange?icon=codecov&cache=300

[codecoverage-url]: https://codecov.io/gh/tunnckoCore/opensource
[codestyle-url]: https://github.com/airbnb/javascript
[codestyle-img]: https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb&cache=300
[linuxbuild-url]: https://github.com/tunnckocore/opensource/actions
[linuxbuild-img]: https://badgen.net/github/checks/tunnckoCore/opensource/master?cache=300&label=build&icon=github
[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/green?cache=300
[standard-release-url]: https://github.com/standard-release/standard-release
[standard-release-img]: https://badgen.net/badge/semantically/released/05c5ff?cache=300
[community-img]: https://badgen.net/badge/join/community/7b16ff?cache=300
[community-url]: https://github.com/tunnckocorehq/community
[last-commit-img]: https://badgen.net/github/last-commit/tunnckoCore/opensource/master?cache=300
[last-commit-url]: https://github.com/tunnckoCore/opensource/commits/master
[nodejs-img]: https://badgen.net/badge/node/>=10.13.0/green?cache=300
[downloads-weekly-img]: https://badgen.net/npm/dw/parse-commit-message?icon=npm&cache=300
[downloads-monthly-img]: https://badgen.net/npm/dm/parse-commit-message?icon=npm&cache=300
[downloads-total-img]: https://badgen.net/npm/dt/parse-commit-message?icon=npm&cache=300
[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green?cache=300
[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green?cache=300
[prs-welcome-url]: http://makeapullrequest.com

<!-- TODO: update icon -->

[paypal-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HYJJEZNSGAPGC&source=url
[paypal-img]: https://badgen.net/badge/PayPal/donate/003087?cache=300&icon=https://simpleicons.now.sh/paypal/fff

<!-- TODO: update icon -->

[kofi-url]: https://ko-fi.com/tunnckoCore
[kofi-img]: https://badgen.net/badge/Buy%20me/a%20coffee/29abe0c2?cache=300&icon=https://rawcdn.githack.com/tunnckoCore/badgen-icons/f8264c6414e0bec449dd86f2241d50a9b89a1203/icons/kofi.svg

<!-- TODO: update icon -->

[bitcoin-url]: https://www.blockchain.com/btc/payment_request?address=3QNHKun1K1SUui1b4Z3KEGPPsWC1TgtnqA&message=Open+Source+Software&amount_local=10&currency=USD
[bitcoin-img]: https://badgen.net/badge/Bitcoin%20tip/3QNHKun...b4Z3KEGPPsWC1TgtnqA/yellow?cache=300&icon=https://simpleicons.now.sh/bitcoin/fff
[keybase-url]: https://keybase.io/tunnckoCore
[keybase-img]: https://badgen.net/keybase/pgp/tunnckoCore?cache=300
[twitter-url]: https://twitter.com/tunnckoCore
[twitter-img]: https://badgen.net/twitter/follow/tunnckoCore?icon=twitter&color=1da1f2&cache=300
[patreon-url]: https://www.patreon.com/bePatron?u=5579781
[patreon-img]: https://badgen.net/badge/Become/a%20patron/F96854?icon=patreon

<!-- [patreon-img]: https://badgen.net/badge/Patreon/tunnckoCore/F96854?icon=patreon -->

[patreon-sponsor-img]: https://badgen.net/badge/become/a%20sponsor/F96854?icon=patreon

[twitter-share-url]: https://twitter.com/intent/tweet?text=https://github.com/tunnckoCore/opensource/tree/master&via=tunnckoCore
[twitter-share-img]: https://badgen.net/badge/twitter/share/1da1f2?icon=twitter
[open-issue-url]: https://github.com/tunnckoCore/opensource/issues/new
[tunnckocore_legal]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/legal/tunnckocore?label&color=A56016&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_consulting]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/consulting/tunnckocore?label&color=07ba96&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_security]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/security/tunnckocore?label&color=ed1848&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_opensource]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/opensource/tunnckocore?label&color=ff7a2f&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_newsletter]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/newsletter/tunnckocore?label&color=5199FF&icon=https://svgshare.com/i/Dt6.svg

[collect-mentions]: https://github.com/olstenlarck/collect-mentions
[jest-runner-docs]: https://tunnckocore.com/opensource