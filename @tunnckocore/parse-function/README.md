# [parse-function][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Parse a function, arrow function or string to object with `name`, `args`, `params` and `body` properties.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

**Please read the [CHANGELOG](./CHANGELOG.md)!**

## Pro Tips (What version to use?)
There's no breaking changes between versions, the only version that have partial breaking change is `v2.1.x`, so don't use it.

- use `v2.0.x` - if you don't need support for `arrow functions` and `es6 default params`.
- use `v2.2.x` - if you just want basic support for `es6 features` like `ES6 Arrow Functions` (faster than `v2.3.x`)
- use `v2.3.x` - if you want full support of `es6 arrow functions` and `es6 default params` (this uses `acorn`)



## Install
```
npm i parse-function --save
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
const parseFunction = require('parse-function')
```

### [parseFunction](./index.js#L45)
> Parse function, arrow function or string to object. 

- `[val]` **{Function|ArrowFunction|String}** function or string to parse    
- `returns` **{Object}** with `name`, `args`, `params` and `body` properties  
  + `name` **{String}** name of the function or `anonymous`
  + `body` **{String}** body of the function or `''`
  + `params` **{String}** arguments names as string (as is) or empty string `''`
  + `parameters` **{String}** hidden property, alias of `params`
  + `args` **{Array}** arguments names as array, or empty array `[]`
  + `arguments` **{Array}** hidden property, alias of `args`
  + `value` **{String}** hidden property, string representation of the given `val`
  + `orig` **{Function|ArrowFunction|String}** hidden property, original given `val`
  + `valid` **{Boolean}** hidden property, `true` when `val` is function or string, `false` otherwise
  + `invalid` **{Boolean}** hidden property, opposite of `opts.valid`
  + `defaults` **{Object}** hidden property, empty object or ES6 default params

**Example**

```js
const parseFunction = require('parse-function')

const fixture = 'function testing (a, b, callback) { callback(null, a + b) }'
const obj = parseFunction(fixture)
// => {
//   name: 'testing',
//   body: ' callback(null, a + b) ',
//   params: 'a, b, callback',
//   args: ['a', 'b', 'callback']
// }

const withoutName = function (x, y) {}
const res = parseFunction(withoutName)
// => {
//   name: 'anonymous',
//   body: '',
//   params: 'x, y',
//   args: ['x', 'y']
// }
```


## Related
- [function-regex](https://github.com/regexps/function-regex): Function regex. Regular expression for matching function parts. Expose match groups for function name, arguments and function body.
- [gulp-di](https://github.com/cmtt/gulp-di): Dependency injection framework for the Gulp streaming build system
- [is-empty-function](https://github.com/tunnckocore/is-empty-function): Check that given string, function or arrow function have empty body, using `parse-function`.
- [is-installed](https://github.com/tunnckoCore/is-installed): Checks that given package is installed on the system - globally or locally.
- [is-missing](https://github.com/tunnckocore/is-missing): Check that given `name` or `user/repo` exists in npm registry or in github as user repository.


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/parse-function/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.


## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckocore.tk][author-www-img]][author-www-url] [![keybase tunnckocore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]


[npmjs-url]: https://www.npmjs.com/package/parse-function
[npmjs-img]: https://img.shields.io/npm/v/parse-function.svg?label=parse-function

[license-url]: https://github.com/tunnckoCore/parse-function/blob/master/LICENSE
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg


[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/parse-function
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/parse-function.svg

[travis-url]: https://travis-ci.org/tunnckoCore/parse-function
[travis-img]: https://img.shields.io/travis/tunnckoCore/parse-function.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/parse-function
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/parse-function.svg

[david-url]: https://david-dm.org/tunnckoCore/parse-function
[david-img]: https://img.shields.io/david/tunnckoCore/parse-function.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg


[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg