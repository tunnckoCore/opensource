## [![npm][npmjs-img]][npmjs-url] [![mit license][license-img]][license-url] [![build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![deps status][daviddm-img]][daviddm-url]

> A [koa][koa-url] body parser middleware with support for `multipart`, `json`, [`csp-report`][csp-report] and `urlencoded` request bodies. Via [`formidable`][formidable-url] and [`co-body`][cobody-url].

## Install
```bash
npm install koa-better-body
npm test
```


## Usage
> For more use-cases see the [tests](./test.js) or [examples](./examples) folder.

- [`examples/multer`](./examples/multer.js) - usage like Express's bodyParser - [multer][multer-url] `npm run examples-multer`
- [`examples/koa-router`](./examples/koa-router.js) - usage with Alex's [koa-router][koa-router-url] `npm run examples-koa-router`


## [.koaBetterBody](index.js#L45)
> However, `koa-better-body` have few custom options, see also [co-body][cobody-url], [raw-body][rawbody-url], [formidable][formidable-url]

* `[options]` **{Object}**  
  - `patchNode` **{Boolean}** Patch request body to Node's `ctx.req` object, default `false`
  - `patchKoa` **{Boolean}** Patch request body to Koa's `ctx.request` object, default `true`
  - `jsonLimit` **{String|Number}** The byte limit of the JSON body, default `1mb`
  - `formLimit` **{String|Number}** The byte limit of the form body, default `56kb`
  - `encoding` **{String}** Sets encoding for incoming form fields, default `utf-8`
  - `multipart` **{Boolean}** Support `multipart/form-data` request bodies, default `false`
  - `fieldsKey` **{String|Boolean}** Name of the key for fields in the body object or `false`
  - `filesKey` **{String|Boolean}** Name of the key for files in the body object or `false`
  - `formidable` **{Object}** Options that are passing to `formidable`
    + `formidable.maxFields` **{Number}** See [formidable-options](./readme.md#formidable-options). our default `10`
    + `formidable.multiples` **{Boolean}** See [formidable-options](./readme.md#formidable-options), our default `true`
    + `formidable.keepExtensions` **{Boolean}** See [formidable-options](./readme.md#formidable-options), our default `true`
* `return` **{GeneratorFunction}** That you can use with [koa][koa-url] or [co][co-url]

### formidable options
> See [node-formidable][formidable-url] for a full list of options

- `bytesExpected` **{Integer}** The expected number of bytes in this form, default `null`
- `maxFields` **{Integer}** Limits the number of fields that the querystring parser will decode, default `1000`
- `maxFieldsSize` **{Integer}** Limits the amount of memory a field can allocate _in bytes_, default `2mb`
- `uploadDir` **{String}** Sets the directory for placing file uploads in, default `os.tmpDir()`
- `hash` **{String}** If you want checksums calculated for incoming files - `'sha1'` or `'md5'`, default `false`
- `multiples` **{Boolean}** Multiple file uploads or no, default `false`


## Author
**Charlike Mike Reagent**
+ [gratipay/tunnckoCore][author-gratipay]
+ [twitter/tunnckoCore][author-twitter]
+ [github/tunnckoCore][author-github]
+ [npmjs/tunnckoCore][author-npmjs]
+ [more ...][contrib-more]


## License [![MIT license][license-img]][license-url]
Copyright (c) 2015 [Charlike Mike Reagent][contrib-more], [contributors][contrib-graf].  
Released under the [`MIT`][license-url] license.


[npmjs-url]: http://npm.im/koa-better-body
[npmjs-img]: https://img.shields.io/npm/v/koa-better-body.svg?style=flat&label=koa-better-body

[coveralls-url]: https://coveralls.io/r/tunnckoCore/koa-better-body?branch=master
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/koa-better-body.svg?style=flat

[license-url]: https://github.com/tunnckoCore/koa-better-body/blob/master/license.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat

[travis-url]: https://travis-ci.org/tunnckoCore/koa-better-body
[travis-img]: https://img.shields.io/travis/tunnckoCore/koa-better-body.svg?style=flat

[daviddm-url]: https://david-dm.org/tunnckoCore/koa-better-body
[daviddm-img]: https://img.shields.io/david/tunnckoCore/koa-better-body.svg?style=flat

[author-gratipay]: https://gratipay.com/tunnckoCore
[author-twitter]: https://twitter.com/tunnckoCore
[author-github]: https://github.com/tunnckoCore
[author-npmjs]: https://npmjs.org/~tunnckocore

[contrib-more]: http://j.mp/1stW47C
[contrib-graf]: https://github.com/tunnckoCore/koa-better-body/graphs/contributors

***

_Powered and automated by [kdf](https://github.com/tunnckoCore), January 17, 2015_

[cobody-url]: https://github.com/visionmedia/co-body
[rawbody-url]: https://github.com/stream-utils/raw-body
[multer-url]: https://github.com/expressjs/multer
[koa-router-url]: https://github.com/alexmingoia/koa-router
[koa-url]: https://github.com/koajs/koa
[formidable-url]: https://github.com/felixge/node-formidable
[co-url]: https://github.com/visionmedia/co
[csp-report]: https://mathiasbynens.be/notes/csp-reports
