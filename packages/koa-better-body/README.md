# [koa-better-body][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url] 

> Full-featured [koa][] body parser! Support parsing text, buffer, json, json patch, json api, csp-report, multipart, form and urlencoded bodies. Works for koa@1, koa@2 and will work for koa@3.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

You might also be interested in our [recipes](./recipes) - working examples, answers, tips & tricks. [Contribute a recipe?](#contributing-recipes)

## Install
```
npm i koa-better-body --save
```

## Features
- Work for `koa@1` and `koa@2` (with deprecation messages), will also work in `koa@3` with [koa-convert][]
- Totally flexible through `options` and absolutely lightweight using [lazy-cache][]
- Accept few JSON types
- Accept [JSON Patch [RFC6902]](https://tools.ietf.org/html/rfc6902) ([koajs/bodyparser#8](https://github.com/koajs/bodyparser/pull/8))
- Accept [JSON API v1](http://jsonapi.org/) ([koajs/bodyparser#7](https://github.com/koajs/bodyparser/pull/7))
- Accept [JSON csp-report](https://mathiasbynens.be/notes/csp-reports) ([#3](https://github.com/tunnckoCore/koa-better-body/issues/3))
- Accept text and buffer bodies
- Accept urlencoded and forms bodies
- Accept multipart form data files and fields
- Can parse correctly array data from forms - e.g. multiple fields to have same name - [dlau/koa-body#15](https://github.com/dlau/koa-body/pull/15)
- Can parse correctly forms that accept multiple files - see [#26](https://github.com/tunnckoCore/koa-better-body/issues/26) and [dlau/koa-body#15](https://github.com/dlau/koa-body/pull/15)
- Strict mode by default - see why on [IETF Message Semantics: Section 6.1](https://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-19#section-6.1)
- Custom JSON request detect function - [koajs/bodyparser#f6a5ff](https://github.com/koajs/bodyparser/commit/f6a5ff7ef6162702540b101de5dde71ee5ad19cd)
- Custom error handling function - [koajs/bodyparser#19418129](https://github.com/koajs/bodyparser/commit/194181298fe3bffce6b5fcf3cfebc35b8cda6c89)
- Extending types of request that your app can accept - [koajs/bodyparser#ba7479b](https://github.com/koajs/bodyparser/commit/ba7479baf893fc3391fcdb88d3d8173ac4df05e7)
- Using awesome [formidable][] package - [„battle-tested against hundreds of GB of file uploads“](https://github.com/felixge/node-formidable#current-status)
- Passing a custom `formidable.IncomingForm` instance, allowing awesome customization
- Passing all options to `formidable.IncomingForm`, allowing awesome control

## Usage
> For more use-cases see the [tests](./test.js)

```js
const koaBetterBody = require('koa-better-body')
```

### [koaBetterBody](index.js#L38)
> Robust body parser for [koa][]@1, also works for `koa@2` (with deprecations). Will also work for future `koa@3` with [koa-convert][].

**Params**

* `options` **{Object}**: see more on [options section](#options)    
* `returns` **{GeneratorFunction}**  

**Example**

```js
var koa = require('koa')
var body = require('koa-better-body')
var app = koa()

app
  .use(body())
  .use(function * () {
    console.log(this.body)
  })
  .listen(8080, function () {
    console.log('koa server start listening on port 8080')
  })
```

## Options
Sane defaults. :sparkles:

Accepts JSON, [JSON API v1](http://jsonapi.org/), text, buffer, [csp-report](https://mathiasbynens.be/notes/csp-reports), multipart and urlencoded/form bodies. If you want to disallow accepting and parsing multipart body you should pass `multipart: false`. Most of the defaults you can see at [utils.defaultOptions and utils.defaultTypes](./utils.js). **All `options` are also been passed to [formidable][].IncomingForm!** Even you can pass IncomingForm instance to be able to handle the different formidable events.

- `fields` **{Boolean|String}**: Default `false`, which means it will set fields on `this.request.fields` and directly on `this.body`. If you pass a string, for example `'foo'`, you will have fields on `this.body` and on `this.request.foo`.
- `files` **{Boolean|String}**: Default `false`, which means it will set files on `this.request.files` and `this.body.files`, if you pass a string, for example `'bar'`, it will set files on `this.request.bar` and `this.body.bar`.
- `multipart` **{Boolean}**: Default `true`. If you pass `false` it won't accept/parse multipart bodies.
- `textLimit` **{String}**: Default `'100kb'`. Passed to [bytes][].parse method.
- `formLimit` **{String}**: Default `'100kb'`. Passed to [bytes][].parse method.
- `jsonLimit` **{String}**: Default `'100kb'`. Passed to [bytes][].parse method.
- `bufferLimit` **{String}**: Default `'1mb'`. Passed to [bytes][].parse method.
- `jsonStrict` **{Boolean}**: Default `true`. When set to true, JSON parser will only accept arrays and objects.
- `detectJSON` **{Function}**: Custom JSON request detect function - `detectJSON(ctx)`.
- `strict` **{Boolean}**: Default `true`. Pass `false` if you want to allow parsing GET, DELETE and HEAD requests.
- `onerror` **{Function}**: Custom error handle, if throw an error, you can customize the response - `onerror(err, ctx)`.
- `extendTypes` **{Object}**: Default accepting types can find on [utils.defaultTypes function](./utils.js). Allowing you to extend what your app can accept. By default works for JSON, [JSON API v1](http://jsonapi.org/), multipart, text, urlencoded and [csp-report](https://mathiasbynens.be/notes/csp-reports).
- `IncomingForm` **{IncomingForm}**: Pass an instance of `formidable.IncomingForm` to be able to handle formidable events.

## A note about `strict` mode
We are trying to follow standards. :cat2:

You can pass `strict:false`, but see [IETF HTTP/1.1 Message Semantics: Section 6.1](https://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-19#section-6.1) to understand why we stay to _"strict mode"_ by default. GET, HEAD, and DELETE requests have no defined semantics for the request body, but this doesn't mean they may not be valid in certain use cases. Last two tests at [test/options.js](./test/options.js) are showing usage on non-strict and strict mode. 

## Related
You might also be interested in these packages:
* [formidable](https://www.npmjs.com/package/formidable): A node.js module for parsing form data, especially file uploads. | [homepage](https://github.com/felixge/node-formidable)
* [ip-filter](https://www.npmjs.com/package/ip-filter): Filters valid IPv4 or IPv6 against glob pattern, array, string and etc. If match… [more](https://www.npmjs.com/package/ip-filter) | [homepage](https://github.com/tunnckocore/ip-filter)
* [koa-body-parsers](https://www.npmjs.com/package/koa-body-parsers): collection of koa body parsers | [homepage](https://github.com/koajs/body-parsers)
* [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser): a body parser for koa | [homepage](https://github.com/koajs/body-parser)
* [koa-ip-filter](https://www.npmjs.com/package/koa-ip-filter): koa middleware to filter request IPs or custom ID with glob patterns, array, string,… [more](https://www.npmjs.com/package/koa-ip-filter) | [homepage](https://github.com/tunnckocore/koa-ip-filter)
* [koa](https://www.npmjs.com/package/koa): Koa web app framework | [homepage](https://github.com/koajs/koa)
* [koala](https://www.npmjs.com/package/koala): Koa Framework Suite | [homepage](https://github.com/koajs/koala)

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/koa-better-body/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

### Contributing Recipes
Recipes are just different use cases, written in form of README in human language. Showing some "Pro Tips" and tricks, answering common questions and so on. They look like [tests](./test.js), but in more readable and understandable way for humans - mostly for beginners that not reads or understand enough the README or API and tests.

- They are in form of folders in the root [`recipes/`](./recipes) folder: for example `recipes/[short-meaningful-recipe-name]/`.
- In recipe folder should exist `README.md` file: see [recipes/multipart/README.md](./recipes/multipart/README.md).
- The examples from the recipe README.md should also exist as separate `.js` files.
- Examples in recipe folder also should be working and actual.

It would be great if you follow these steps when you want to _fix, update or create_ a recipes. :sunglasses:

- Title for recipe idea should start with `[recipe]`: for example`[recipe] my awesome recipe`
- Title for new recipe (PR) should also start with `[recipe]`.
- Titles of Pull Requests or Issues for fixing/updating some existing recipes should start with `[recipe-fix]`.

It will help a lot, thanks in advance! :yum:

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[bytes]: https://github.com/visionmedia/bytes.js
[formidable]: https://github.com/felixge/node-formidable
[koa]: https://github.com/koajs/koa
[koa-body-parsers]: https://github.com/koajs/body-parsers
[koa-convert]: https://github.com/gyson/koa-convert
[lazy-cache]: https://github.com/jonschlinkert/lazy-cache
[raw-body]: https://github.com/stream-utils/raw-body

[npmjs-url]: https://www.npmjs.com/package/koa-better-body
[npmjs-img]: https://img.shields.io/npm/v/koa-better-body.svg?label=koa-better-body

[license-url]: https://github.com/tunnckoCore/koa-better-body/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/koa-better-body.svg

[downloads-url]: https://www.npmjs.com/package/koa-better-body
[downloads-img]: https://img.shields.io/npm/dm/koa-better-body.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/koa-better-body
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/koa-better-body.svg

[travis-url]: https://travis-ci.org/tunnckoCore/koa-better-body
[travis-img]: https://img.shields.io/travis/tunnckoCore/koa-better-body/master.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/koa-better-body
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/koa-better-body.svg

[david-url]: https://david-dm.org/tunnckoCore/koa-better-body
[david-img]: https://img.shields.io/david/tunnckoCore/koa-better-body.svg

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