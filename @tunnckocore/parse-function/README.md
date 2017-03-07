<h1 align="center">parse-function
  <a href="https://www.npmjs.com/package/parse-function"><img src="https://img.shields.io/npm/v/parse-function.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/parse-function"><img src="https://img.shields.io/npm/l/parse-function.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/parse-function"><img src="https://img.shields.io/npm/dm/parse-function.svg" alt="npm downloads monthly"></a>
  <a href="https://www.npmjs.com/package/parse-function"><img src="https://img.shields.io/npm/dt/parse-function.svg" alt="npm downloads total"></a>
  <br>
<img src="https://cdn.jsdelivr.net/emojione/assets/svg/1f54e.svg" width="256" height="256" alt="Parse a function"><br>
Parse a function into an object
</h1>

> Parse a function into an object that has its name, body, args and a few more useful properties.

[![codeclimate][codeclimate-img]][codeclimate-url] 
[![codestyle][standard-img]][standard-url] 
[![linux build][travis-img]][travis-url] 
[![windows build][appveyor-img]][appveyor-url] 
[![codecov][coverage-img]][coverage-url] 
[![dependency status][david-img]][david-url]

_You might also be interested in [function-arguments][] library if you need more lightweight
solution and need for just getting the names of the function arguments._

## Features

- **Smart Plugins:** for extending the core API or the end [Result](#result), see the [.use](#use) method
- **Extensible:** using plugins for working directly on AST nodes, see the [.use](#use) method
- **ES2017 Ready:** by using `.parseExpression` method of the [babylon][] `v7.x` parser
- **Customization:** allows switching the parser, through `options.parse`
- **Support for:** arrow functions, default parameters, generators and async/await functions
- **Stable:** battle-tested in production and against all parsers - [espree][], [acorn][], [babylon][]
- **Tested:** with [275+ tests](./test.js) for _200%_ coverage

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [Which version to use?](#which-version-to-use)
- [Notes](#notes)
  * [Throws in one specific case](#throws-in-one-specific-case)
  * [Function named _"anonymous"_](#function-named-_anonymous_)
  * [Real anonymous function](#real-anonymous-function)
- [API](#api)
  * [parseFunction](#parsefunction)
  * [.parse](#parse)
  * [.use](#use)
  * [.define](#define)
  * [Result](#result)
- [Related](#related)
- [Contributing](#contributing)
- [Building docs](#building-docs)
- [Running tests](#running-tests)
- [Author](#author)
- [Logo](#logo)
- [License](#license)

## Install
Install with [npm](https://www.npmjs.com/)

```
$ npm install parse-function --save
```

or install using [yarn](https://yarnpkg.com)

```
$ yarn add parse-function
```

## Usage
> For more use-cases see the [tests](test.js)

```js
const parseFunction = require('parse-function')
const app = parseFunction()

console.log(app.use) // => function
console.log(app.parse) // => function
console.log(app.define) // => function
```

## Which version to use?

There's no breaking changes between the `v2.x` version. The only breaking is `v2.1` which also is not
working properly, so no use it.

**Use v2.0.x**

When you don't need support for `arrow functions` and `es6 default params`. This version 
uses a RegExp expression to work.

**Use v2.2.x**

Only when you need a _basic_ support for `es6 features` like arrow functions. This version 
uses a RegExp expression to work.

**Use v2.3.x**

When you want _full*_ support for `arrow functions` and `es6 default params`. Where this "full",
means "almost full", because it has bugs. This version also uses (`acorn.parse`) real parser 
to do the parsing.

**Use v3.x**

When you want to use different parser instead of the default `babylon.parse`, by passing custom
parse function to the `options.parse` option. **From this version we require `node >= 4`**.

**Use v4.x**

When you want full customization and most stable support for old and modern features. This version
uses `babylon.parseExpression` for parsing and provides a [Plugins API](#use). 
See the [Features](#features) section for more info.

## Notes

### Throws in one specific case

> _see: [issue #3](https://github.com/tunnckoCore/parse-function/issues/3) and [test.js#L210-L215](https://github.com/tunnckoCore/parse-function/blob/master/test.js#L210-L215)_

It may throw in one specific case, otherwise it won't throw, so you should 
relay on the `result.isValid` for sure.

### Function named _"anonymous"_

> _see: [test.js#L277-L282](https://github.com/tunnckoCore/parse-function/blob/master/test.js#L277-L282) and [Result](#result) section_

If you pass a function which is named _"anonymous"_ the `result.name` will be `'anonymous'`, 
but the `result.isAnonymous` will be `false` and `result.isNamed` will be `true`, because 
in fact it's a named function.

### Real anonymous function

> _see: [test.js#L284-L289](https://github.com/tunnckoCore/parse-function/blob/master/test.js#L284-L289) and [Result](#result) section_

Only if you pass really an anonymous function you will get `result.name` equal to `null`, 
`result.isAnonymous` equal to `true` and `result.isNamed` equal to `false`.

## API

### [parseFunction](index.js#L64)
> Initializes with optional `opts` object which is passed directly to the desired parser and returns an object with `.use` and `.parse` methods. The default parse which is used is [babylon][]'s `.parseExpression` method from `v7`.

**Params**

* `opts` **{Object}**: optional, merged with options passed to `.parse` method    
* `returns` **{Object}** `app`: object with `.use` and `.parse` methods  

**Example**

```js
const parseFunction = require('parse-function')

const app = parseFunction({
  ecmaVersion: 2017
})

const fixtureFn = (a, b, c) => {
  a = b + c
  return a + 2
}

const result = app.parse(fixtureFn)
console.log(result)

// see more
console.log(result.name) // => null
console.log(result.isNamed) // => false
console.log(result.isArrow) // => true
console.log(result.isAnonymous) // => true

// array of names of the arguments
console.log(result.args) // => ['a', 'b', 'c']

// comma-separated names of the arguments
console.log(result.params) // => 'a, b, c'
```

### [.parse](index.js#L107)
> Parse a given `code` and returns a `result` object with useful properties - such as `name`, `body` and `args`. By default it uses Babylon parser, but you can switch it by passing `options.parse` - for example `options.parse: acorn.parse`. In the below example will show how to use `acorn` parser, instead of the default one.

**Params**

* `code` **{Function|String}**: any kind of function or string to be parsed    
* `options` **{Object}**: directly passed to the parser - babylon, acorn, espree    
* `options.parse` **{Function}**: by default `babylon.parseExpression`, all `options` are passed as second argument to that provided function    
* `returns` **{Object}** `result`: see [result section](#result) for more info  

**Example**

```js
const acorn = require('acorn')
const parseFn = require('parse-function')
const app = parseFn()

const fn = function foo (bar, baz) { return bar * baz }
const result = app.parse(fn, {
  parse: acorn.parse,
  ecmaVersion: 2017
})

console.log(result.name) // => 'foo'
console.log(result.args) // => ['bar', 'baz']
console.log(result.body) // => ' return bar * baz '
console.log(result.isNamed) // => true
console.log(result.isArrow) // => false
console.log(result.isAnonymous) // => false
console.log(result.isGenerator) // => false
```

### [.use](index.js#L179)
> Add a plugin `fn` function for extending the API or working on the AST nodes. The `fn` is immediately invoked and passed with `app` argument which is instance of `parseFunction()` call. That `fn` may return another function that accepts `(node, result)` signature, where `node` is an AST node and `result` is an object which will be returned [result](#result) from the `.parse` method. This retuned function is called on each node only when `.parse` method is called.

**Params**

* `fn` **{Function}**: plugin to be called    
* `returns` **{Object}** `app`: instance for chaining  

**Example**

```js
// plugin extending the `app`
app.use((app) => {
  app.define(app, 'hello', (place) => `Hello ${place}!`)
})

const hi = app.hello('World')
console.log(hi) // => 'Hello World!'

// or plugin that works on AST nodes
app.use((app) => (node, result) => {
  if (node.type === 'ArrowFunctionExpression') {
    result.thatIsArrow = true
  }
  return result
})

const result = app.parse((a, b) => (a + b + 123))
console.log(result.name) // => null
console.log(result.isArrow) // => true
console.log(result.thatIsArrow) // => true

const result = app.parse(function foo () { return 123 })
console.log(result.name) // => 'foo'
console.log(result.isArrow) // => false
console.log(result.thatIsArrow) // => undefined
```

### [.define](index.js#L239)
> Define a non-enumerable property on an object. Just a convenience mirror of the [define-property][] library, so check out its docs. Useful to be used in plugins.

**Params**

* `obj` **{Object}**: the object on which to define the property    
* `prop` **{String}**: the name of the property to be defined or modified    
* `val` **{Any}**: the descriptor for the property being defined or modified    
* `returns` **{Object}** `obj`: the passed object, but modified  

**Example**

```js
const parseFunction = require('parse-function')
const app = parseFunction()

// use it like `define-property` lib
const obj = {}
app.define(obj, 'hi', 'world')
console.log(obj) // => { hi: 'world' }

// or define a custom plugin that adds `.foo` property
// to the end result, returned from `app.parse`
app.use((app) => {
  return (node, result) => {
    // this function is called
    // only when `.parse` is called

    app.define(result, 'foo', 123)

    return result
  }
})

// fixture function to be parsed
const asyncFn = async (qux) => {
  const bar = await Promise.resolve(qux)
  return bar
}

const result = app.parse(asyncFn)

console.log(result.name) // => null
console.log(result.foo) // => 123
console.log(result.args) // => ['qux']

console.log(result.isAsync) // => true
console.log(result.isArrow) // => true
console.log(result.isNamed) // => false
console.log(result.isAnonymous) // => true
```

### Result
> In the result object you have `name`, `args`, `params`, `body` and few hidden properties
that can be useful to determine what the function is - arrow, regular, async/await or generator.

* `name` **{String|null}**: name of the passed function or `null` if anonymous
* `args` **{Array}**: arguments of the function
* `params` **{String}**: comma-separated list representing the `args`
* `defaults` **{Object}**: key/value pairs, useful when use ES2015 default arguments
* `body` **{String}**: actual body of the function, respects trailing newlines and whitespaces
* `isValid` **{Boolean}**: is the given value valid or not, that's because it never throws!
* `isAsync` **{Boolean}**: `true` if function is ES2015 async/await function
* `isArrow` **{Boolean}**: `true` if the function is arrow function
* `isNamed` **{Boolean}**: `true` if function has name, or `false` if is anonymous
* `isGenerator` **{Boolean}**: `true` if the function is ES2015 generator function
* `isAnonymous` **{Boolean}**: `true` if the function don't have name

## Related
- [acorn](https://www.npmjs.com/package/acorn): ECMAScript parser | [homepage](https://github.com/ternjs/acorn "ECMAScript parser")
- [always-done](https://www.npmjs.com/package/always-done): Handle completion and errors with elegance! Support for streams, callbacks, promises, child processes, async/await and sync functions. A drop-in replacement… [more](https://github.com/hybridables/always-done#readme) | [homepage](https://github.com/hybridables/always-done#readme "Handle completion and errors with elegance! Support for streams, callbacks, promises, child processes, async/await and sync functions. A drop-in replacement for [async-done][] - pass 100% of its tests plus more")
- [babylon](https://www.npmjs.com/package/babylon): A JavaScript parser | [homepage](https://babeljs.io/ "A JavaScript parser")
- [each-promise](https://www.npmjs.com/package/each-promise): Iterate over promises, promise-returning or async/await functions in series or parallel. Support settle (fail-fast), concurrency (limiting) and hooks system (start… [more](https://github.com/tunnckocore/each-promise#readme) | [homepage](https://github.com/tunnckocore/each-promise#readme "Iterate over promises, promise-returning or async/await functions in series or parallel. Support settle (fail-fast), concurrency (limiting) and hooks system (start, beforeEach, afterEach, finish)")
- [espree](https://www.npmjs.com/package/espree): An Esprima-compatible JavaScript parser built on Acorn | [homepage](https://github.com/eslint/espree "An Esprima-compatible JavaScript parser built on Acorn")
- [minibase](https://www.npmjs.com/package/minibase): Minimalist alternative for Base. Build complex APIs with small units called plugins. Works well with most of the already existing… [more](https://github.com/node-minibase/minibase#readme) | [homepage](https://github.com/node-minibase/minibase#readme "Minimalist alternative for Base. Build complex APIs with small units called plugins. Works well with most of the already existing [base][] plugins.")
- [parse-semver](https://www.npmjs.com/package/parse-semver): Parse, normalize and validate given semver shorthand (e.g. gulp@v3.8.10) to object. | [homepage](https://github.com/tunnckocore/parse-semver#readme "Parse, normalize and validate given semver shorthand (e.g. gulp@v3.8.10) to object.")
- [try-catch-core](https://www.npmjs.com/package/try-catch-core): Low-level package to handle completion and errors of sync or asynchronous functions, using [once][] and [dezalgo][] libs. Useful for and… [more](https://github.com/hybridables/try-catch-core#readme) | [homepage](https://github.com/hybridables/try-catch-core#readme "Low-level package to handle completion and errors of sync or asynchronous functions, using [once][] and [dezalgo][] libs. Useful for and used in higher-level libs such as [always-done][] to handle completion of anything.")

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/parse-function/issues/new).  
Please read the [contributing guidelines](CONTRIBUTING.md) for advice on opening issues, pull requests, and coding standards.  
If you need some help and can spent some cash, feel free to [contact me at CodeMentor.io](https://www.codementor.io/tunnckocore?utm_source=github&utm_medium=button&utm_term=tunnckocore&utm_campaign=github) too.

**In short:** If you want to contribute to that project, please follow these things

1. Please DO NOT edit [README.md](README.md), [CHANGELOG.md](CHANGELOG.md) and [.verb.md](.verb.md) files. See ["Building docs"](#building-docs) section.
2. Ensure anything is okey by installing the dependencies and run the tests. See ["Running tests"](#running-tests) section.
3. Always use `npm run commit` to commit changes instead of `git commit`, because it is interactive and user-friendly. It uses [commitizen][] behind the scenes, which follows Conventional Changelog idealogy.
4. Do NOT bump the version in package.json. For that we use `npm run release`, which is [standard-version][] and follows Conventional Changelog idealogy.

Thanks a lot! :)

## Building docs
Documentation and that readme is generated using [verb-generate-readme][], which is a [verb][] generator, so you need to install both of them and then run `verb` command like that

```
$ npm install verbose/verb#dev verb-generate-readme --global && verb
```

_Please don't edit the README directly. Any changes to the readme must be made in [.verb.md](.verb.md)._

## Running tests
Clone repository and run the following in that cloned directory

```
$ npm install && npm test
```

## Author
**Charlike Mike Reagent**

+ [github/tunnckoCore](https://github.com/tunnckoCore)
+ [twitter/tunnckoCore](https://twitter.com/tunnckoCore)
+ [codementor/tunnckoCore](https://codementor.io/tunnckoCore)

## Logo
The logo is [Menorah Emoji](https://cdn.jsdelivr.net/emojione/assets/svg/1f54e.svg) from [EmojiOne.com](http://emojione.com/). Released under the [CC BY 4.0](http://emojione.com/licensing/) license.

## License
Copyright © 2015, 2017, [Charlike Mike Reagent](https://i.am.charlike.online). Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.3, on March 07, 2017._  
_Project scaffolded using [charlike][] cli._

[acorn]: https://github.com/ternjs/acorn
[always-done]: https://github.com/hybridables/always-done
[async-done]: https://github.com/gulpjs/async-done
[babylon]: https://babeljs.io/
[base]: https://github.com/node-base/base
[charlike]: https://github.com/tunnckocore/charlike
[commitizen]: https://github.com/commitizen/cz-cli
[define-property]: https://github.com/jonschlinkert/define-property
[dezalgo]: https://github.com/npm/dezalgo
[espree]: https://github.com/eslint/espree
[function-arguments]: https://github.com/tunnckocore/function-arguments
[once]: https://github.com/isaacs/once
[standard-version]: https://github.com/conventional-changelog/standard-version
[verb-generate-readme]: https://github.com/verbose/verb-generate-readme
[verb]: https://github.com/verbose/verb

[downloads-url]: https://www.npmjs.com/package/parse-function
[downloads-img]: https://img.shields.io/npm/dt/parse-function.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/parse-function
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/parse-function.svg

[travis-url]: https://travis-ci.org/tunnckoCore/parse-function
[travis-img]: https://img.shields.io/travis/tunnckoCore/parse-function/master.svg?label=linux

[appveyor-url]: https://ci.appveyor.com/project/tunnckoCore/parse-function
[appveyor-img]: https://img.shields.io/appveyor/ci/tunnckoCore/parse-function/master.svg?label=windows

[coverage-url]: https://codecov.io/gh/tunnckoCore/parse-function
[coverage-img]: https://img.shields.io/codecov/c/github/tunnckoCore/parse-function/master.svg

[david-url]: https://david-dm.org/tunnckoCore/parse-function
[david-img]: https://img.shields.io/david/tunnckoCore/parse-function.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

