

## 2.0.1 - 2016-05-05
- Release v2.0.1 / npm@v2.0.1
- fix typo
- switch to use `mukla` for testing, instead of `assertit` - it is drop in replacement
- add downloads badge
- bump deps (lazy-cache to v2)

## 2.0.0 - 2016-04-15
- Release v2.0.0 / npm@v2.0.0
- in general, much things was changed and was added new and wanted features - review [the v2 PR](https://github.com/tunnckoCore/koa-better-body/pull/34)
- closed all of the issues marked as `todo` and `v2` (the v2 milestone)
- in short:
  + cleared all issues marked as `todo` and `v2`
  + still using `formidable`
  + still can pass custom property names for `fields` and `files` - e.g. pass `options.files: 'foobar'`
    * defaults to `this.request.fields` and `this.request.files`
    * *almost* always `this.body` is equal to `this.request.fields` (when it make sense)
    * `this.request.files` not exist always
  + more flexible
    * can pass `formidable.IncomingForm` instance through options to handle events and etc
    * all `options` are directly passed to `formidable.IncomingForm`
  + change `options.multipart` to be `true` be default - pass `false` if you want to disallow it
  + add support for `text` bodies
  + add `options.buffer` to get the body as buffer (when text type), defaults to `false`
  + add `options.strict` mode to disallow GET, HEAD, DELETE requests, defaults to `true`
  + add `options.jsonStrict` JSON parser will only accept arrays and objects, defaults to `true`
    * same as [co-body's options.strict](https://github.com/cojs/co-body#options) and
    * same as [koa-bodyparser's options.strict](https://github.com/koajs/bodyparser#options)
    * passed to [koa-body-parsers](https://github.com/koajs/body-parsers/blob/master/index.js#L33-L39)
  + add `options.detectJSON` #16 - same as in [koa-bodyparser]
  + simplified tests
  + simplify a lot of the codebase using `koa-body-parsers` under the hood

## 1.0.17 - 2015-02-06
- Release v1.0.17 / npm@v1.0.17
- fix license range
- run update readme
- update keywords
- bump deps, actually ranges to `~` only which means `only latest patch version`

## 1.0.16 - 2015-01-19
- Release v1.0.16 / npm@v1.0.16
- add `opts.extendTypes`

## 1.0.15 - 2015-01-19
- Release v1.0.15 / npm@v1.0.15
- add `encode` alias for `encoding` option

## 1.0.14 - 2015-01-18
- Release v1.0.14 / npm@v1.0.14
- istanbul ignore
- coverage tweaks
- increase max statements to 20
- closes #10, update/add tests

## 1.0.13 - 2015-01-17
- Release v1.0.13 / npm@v1.0.13
- update dotfiles and jscs rules
- revert back `filesKey` option

## 1.0.12 - 2014-11-27
- Release v1.0.12 / npm@v1.0.12
- bump to `jscs >= 1.8.0` and `jscs-doc >= 0.2.0`
- update semver range

## 1.0.11 - 2014-11-27
- Release v1.0.11 / npm@v1.0.11
- fix code style collisions

## 1.0.10 - 2014-11-27
- Release v1.0.10 / npm@v1.0.10
- docs, readme, coveralls
- edit safeContext in `.jscsrc`

## 1.0.9 - 2014-11-27
- Release v1.0.9 / npm@v1.0.9
- bump `jscs-jsdoc` to `v0.1.0`
- update jscs config `.jscsrc`

## 1.0.8 - 2014-11-26
- Release v1.0.8 / npm@v1.0.8
- normalize (dot)files
- update all to apply jshint/jscs code style
  - add .jscsrc and .jshintignore
- update makefile and scripts in package.json

## 1.0.7 - 2014-10-26
- Release v1.0.7 / npm@v1.0.7
- update names of some tests (rfc7231) "Request Entity Too Large" -> "Payload Too Large"
- add doc blocks

## 1.0.6 - 2014-10-25
- Release v1.0.6 / npm@v1.0.6
- update automation
- improve code coverage
- add Makefile
- add `npm run` scripts

## 1.0.5 - 2014-10-25
- Release v1.0.5 / npm@v1.0.5
- add support for `application/csp-report` header (fixes #3) ref: https://mathiasbynens.be/notes/csp-reports
- add complete name of the request headers to not lead to conflicts

## 1.0.4 - 2014-10-21
- Release v1.0.4 / npm@v1.0.4
- add `fieldsKey` optional options property (closes https://github.com/tunnckoCore/koa-better-body/issues/1) that allows custom key name if string, or false if you want field's to be in the `.body` not in `.body.fields`

## 1.0.3 - 2014-07-03
- Release v1.0.3 / npm@v1.0.3
- Pretty styling
- auto badges
- add history
- add [`extend`][extend-url], because of options merging bug.
- add better tests - only 7, for all use cases.
- need suggestions for `error 413` handling, maybe [`raw-body`][rawbody-url] problem/logic?
- when upload, always returned type is `application/octet-stream`, not `image/png`, `image/gif`, etc - maybe [`formidable`][formidable-url] problem/logic?
- deprecation message also comes from `formidable`
- ~~always `json` and `urlencoded` bodies will be pushed to request `.body.fields` object.~~ (fixed in v1.0.4)

## 1.0.0 - 2014-06-08
- Release v1.0.0 / npm@v1.0.0
- initial release

## 0.0.0 - 2014-06-08
- Initial commits