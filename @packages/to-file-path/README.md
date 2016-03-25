# [to-file-path][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Create a filepath from an object path (dot notation), list of arguments, array, number or Arguments object.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

You might also be interested in [ip-filter][] or [to-object-path][].

## Install
```
npm i to-file-path --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const toFilePath = require('to-file-path')
```

### [toFilePath](index.js#L33)
> Create filepath from different type of arguments.

**Params**

* `args` **{String|Array|Arguments|Number|Boolean}**: Pass any type and any number of arguments.    
* `returns` **{String}**: always slash separated filepath  

**Example**

```js
var toFilePath = require('to-file-path')

console.log(toFilePath('foo.bar.baz')) // => 'foo/bar/baz'
console.log(toFilePath('foo.bar', 'qux.baz', 'xxx')) // => 'foo/bar/qux/baz/xxx'
console.log(toFilePath('foo', 'qux', 'baz')) // => 'foo/qux/baz'
console.log(toFilePath([1, 2, 3], 'foo', 4, 'bar')) // => '1/2/3/foo/4/bar'
console.log(toFilePath(null, true)) // => 'null/true'
console.log(toFilePath(1, 2, 3)) // => '1/2/3'
```

## Related
* [arr-includes](https://www.npmjs.com/package/arr-includes): Return true if any of passed values exists in array. Using [in-array][]. | [homepage](https://github.com/tunnckocore/arr-includes)
* [arr-map](https://www.npmjs.com/package/arr-map): Faster, node.js focused alternative to JavaScript's native array map. | [homepage](https://github.com/jonschlinkert/arr-map)
* [get-fn-name](https://www.npmjs.com/package/get-fn-name): Get function name with strictness and correctness in mind. Also works for… [more](https://www.npmjs.com/package/get-fn-name) | [homepage](https://github.com/tunnckocore/get-fn-name)
* [in-array](https://www.npmjs.com/package/in-array): Return true if a value exists in an array. Faster than using… [more](https://www.npmjs.com/package/in-array) | [homepage](https://github.com/jonschlinkert/in-array)
* [ip-filter](https://www.npmjs.com/package/ip-filter): Filter valid IPv4 or IPv6 IP against glob pattern, array, string, regexp… [more](https://www.npmjs.com/package/ip-filter) | [homepage](https://github.com/tunnckocore/ip-filter)
* [to-object-path](https://www.npmjs.com/package/to-object-path): Create an object path from a list or array of strings. | [homepage](https://github.com/jonschlinkert/to-object-path)

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/to-file-path/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[ip-filter]: https://github.com/tunnckocore/ip-filter
[to-object-path]: https://github.com/jonschlinkert/to-object-path
[in-array]: https://github.com/jonschlinkert/in-array

[npmjs-url]: https://www.npmjs.com/package/to-file-path
[npmjs-img]: https://img.shields.io/npm/v/to-file-path.svg?label=to-file-path

[license-url]: https://github.com/tunnckoCore/to-file-path/blob/master/LICENSE
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/to-file-path
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/to-file-path.svg

[travis-url]: https://travis-ci.org/tunnckoCore/to-file-path
[travis-img]: https://img.shields.io/travis/tunnckoCore/to-file-path/master.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/to-file-path
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/to-file-path.svg

[david-url]: https://david-dm.org/tunnckoCore/to-file-path
[david-img]: https://img.shields.io/david/tunnckoCore/to-file-path.svg

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

