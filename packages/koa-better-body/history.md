## v1.0.3 / July 03, 2014
- Pretty styling
- auto badges
- add history
- add [`extend`][extend-url], because of options merging bug.
- add better tests - only 7, for all use cases.
- need suggestions for `error 413` handling, maybe [`raw-body`][rawbody-url] problem/logic?
- when upload, always returned type is `application/octet-stream`, not `image/png`, `image/gif`, etc - maybe [`formidable`][formidable-url] problem/logic?
- deprecation message also comes from `formidable`
- always `json` and `urlencoded` bodies will be pushed to request `.body.fields` object.

---

## v1.0.0 / June 08, 2014
- initial release

---



[npmjs-url]: http://npm.im/koa-better-body
[npmjs-shields]: http://img.shields.io/npm/v/koa-better-body.svg
[npmjs-install]: https://nodei.co/npm/koa-better-body.svg?mini=true

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

[author-dlau-github]: https://github.com/dlau
[author-dlau-twitter]: https://twitter.com/daryllau
[author-dlau-npmjs]: https://npmjs.org/~dlau
[author-dlau-website]: http://weak.io/

[cobody-url]: https://github.com/visionmedia/co-body
[mocha-url]: https://github.com/visionmedia/mocha
[rawbody-url]: https://github.com/stream-utils/raw-body
[multer-url]: https://github.com/expressjs/multer
[koa-router-url]: https://github.com/alexmingoia/koa-router
[koa-url]: https://github.com/koajs/koa
[formidable-url]: https://github.com/felix
[co-url]: https://github.com/visionmedia/co
[extend-url]: https://github.com/justmoon/node-extend