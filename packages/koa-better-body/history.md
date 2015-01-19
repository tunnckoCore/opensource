## v1.0.15 / January 19, 2015
- add `encode` alias for `encoding` option

## v1.0.14 / January 18, 2015
- istanbul ignore
- coverage tweaks
- increase max statements to 20
- closes #10, update/add tests

## v1.0.13 / January 17, 2015
- update dotfiles and jscs rules
- revert back `filesKey` option

## v1.0.12 / November 27, 2014
- bump to `jscs >= 1.8.0` and `jscs-doc >= 0.2.0`
- update semver range

## v1.0.11 / November 27, 2014
- fix code style collisions

## v1.0.10 / November 27, 2014
- docs, readme, coveralls
- edit safeContext in `.jscsrc`

## v1.0.9 / November 27, 2014
- bump `jscs-jsdoc` to `v0.1.0`
- update jscs config `.jscsrc`

## v1.0.8 / November 26, 2014
- normalize (dot)files
- update all to apply jshint/jscs code style
  - add .jscsrc and .jshintignore
- update makefile and scripts in package.json

## v1.0.7 / October 26, 2014
- update names of some tests (rfc7231) "Request Entity Too Large" -> "Payload Too Large"
- add doc blocks

## v1.0.6 / October 25, 2014
- update automation
- improve code coverage
- add Makefile
- add `npm run` scripts

## v1.0.5 / October 25, 2014
- add support for `application/csp-report` header (fixes #3) ref: https://mathiasbynens.be/notes/csp-reports
- add complete name of the request headers to not lead to conflicts

## v1.0.4 / October 21, 2014
- add `fieldsKey` optional options property (closes https://github.com/tunnckoCore/koa-better-body/issues/1) that allows custom key name if string, or false if you want field's to be in the `.body` not in `.body.fields`

## v1.0.3 / July 03, 2014
- Pretty styling
- auto badges
- add history
- add [`extend`][extend-url], because of options merging bug.
- add better tests - only 7, for all use cases.
- need suggestions for `error 413` handling, maybe [`raw-body`][rawbody-url] problem/logic?
- when upload, always returned type is `application/octet-stream`, not `image/png`, `image/gif`, etc - maybe [`formidable`][formidable-url] problem/logic?
- deprecation message also comes from `formidable`
- ~~always `json` and `urlencoded` bodies will be pushed to request `.body.fields` object.~~ (fixed in v1.0.4)

## v1.0.0 / June 08, 2014
- initial release



[npmjs-url]: http://npm.im/koa-better-body
[npmjs-shields]: http://img.shields.io/npm/v/koa-better-body.svg
[npmjs-install]: https://nodei.co/npm/koa-better-body.svg?mini=true

[coveralls-url]: https://coveralls.io/r/tunnckoCore/koa-better-body?branch=master
[coveralls-shields]: https://img.shields.io/coveralls/tunnckoCore/koa-better-body.svg

[license-url]: https://github.com/tunnckoCore/koa-better-body/blob/master/license.md
[license-img]: http://img.shields.io/badge/license-MIT-blue.svg

[travis-url]: https://travis-ci.org/tunnckoCore/koa-better-body
[travis-img]: https://travis-ci.org/tunnckoCore/koa-better-body.svg?branch=master

[depstat-url]: https://david-dm.org/tunnckoCore/koa-better-body
[depstat-img]: https://david-dm.org/tunnckoCore/koa-better-body.svg

[author-gittip-img]: http://img.shields.io/gittip/tunnckoCore.svg
[author-gittip]: https://www.gittip.com/tunnckoCore
[author-github]: https://github.com/tunnckoCore
[author-twitter]: https://twitter.com/tunnckoCore

[author-website]: http://www.whistle-bg.tk
[author-npmjs]: https://npmjs.org/~tunnckocore

[cobody-url]: https://github.com/visionmedia/co-body
[mocha-url]: https://github.com/visionmedia/mocha
[rawbody-url]: https://github.com/stream-utils/raw-body
[multer-url]: https://github.com/expressjs/multer
[koa-router-url]: https://github.com/alexmingoia/koa-router
[koa-url]: https://github.com/koajs/koa
[formidable-url]: https://github.com/felixge/node-formidable
[co-url]: https://github.com/visionmedia/co
[extend-url]: https://github.com/justmoon/node-extend
[csp-report]: https://mathiasbynens.be/notes/csp-reports
