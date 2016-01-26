# [parse-function][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Parse a function, arrow function or string to object with `name`, `args`, `params` and `body` properties.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]


## Install
```
npm i parse-function --save
```


## Usage
> For more use-cases see the [tests](./test.js)

```js
const parseFunction = require('parse-function')
```

### [parseFunction](./index.js#L48)
> Parse a given function or string to object.

- `[fn]` **{Function|String}** function or string to parse    
- `returns` **{Object}** with `name`, `args`, `params` and `body` properties  

**Example**

```js
const parseFunction = require('parse-function')

const fixture = 'function testing (a, b, callback) { callback(null, a + b) }'
const obj = parseFunction(fixture)
// => {
//   name: 'testing',
//   params: 'a, b, callback',
//   parameters: 'a, b, callback',
//   args: ['a', 'b', 'callback'],
//   arguments: ['a', 'b', 'callback'],
//   body: ' callback(null, a + b) '
// }

const withoutName = function (x, y) {}
const res = parseFunction(withoutName)
// => {
//   name: 'anonymous',
//   params: 'x, y',
//   parameters: 'x, y',
//   args: ['x', 'y'],
//   arguments: ['x', 'y'],
//   body: ''
// }
```


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