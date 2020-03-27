# koa-better-body [![npm version][npmv-img]][npmv-url] [![License][license-img]][license-url] [![Libera Manifesto][libera-manifesto-img]][libera-manifesto-url]

> Full-featured [koa][] body parser! Support parsing text, buffer, json, json
> patch, json api, csp-report, multipart, form and urlencoded bodies. Works for
> koa@1, koa@2 and will work for koa@3.

Please consider following this project's author,
[Charlike Mike Reagent](https://github.com/tunnckoCore), and :star: the project
to show your :heart: and support.

<div id="readme"></div>

[![Code style][codestyle-img]][codestyle-url]
[![CircleCI linux build][linuxbuild-img]][linuxbuild-url]
[![CodeCov coverage status][codecoverage-img]][codecoverage-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]
[![Time Since Last Commit][last-commit-img]][last-commit-url]

<!-- [![Semantically Released][standard-release-img]][standard-release-url] -->

If you have any _how-to_ kind of questions, please read the [Contributing
Guide][contributing-url] and [Code of Conduct][code_of_conduct-url] documents.
For bugs reports and feature requests, [please create an issue][open-issue-url]
or ping [@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

[![Conventional Commits][ccommits-img]][ccommits-url]
[![Minimum Required Nodejs][nodejs-img]][npmv-url]
[![NPM Downloads Monthly][downloads-monthly-img]][npmv-url]
[![NPM Downloads Total][downloads-total-img]][npmv-url]
[![Share Love Tweet][twitter-share-img]][twitter-share-url]
[![Twitter][twitter-img]][twitter-url]

Project is [semantically](https://semver.org) versioned & automatically released
from [GitHub Actions](https://github.com/features/actions) with
[Lerna](https://github.com/lerna/lerna).

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

## Features

- Work for `koa@1` and `koa@2` (with deprecation messages), will also work in
  `koa@3` with [koa-convert][]
- Totally flexible through `options` and absolutely lightweight using
  [lazy-cache][]
- Accept few JSON types
- Accept [JSON Patch [RFC6902]](https://tools.ietf.org/html/rfc6902)
  ([koajs/bodyparser#8](https://github.com/koajs/bodyparser/pull/8))
- Accept [JSON API v1](http://jsonapi.org/)
  ([koajs/bodyparser#7](https://github.com/koajs/bodyparser/pull/7))
- Accept [JSON csp-report](https://mathiasbynens.be/notes/csp-reports)
  ([#3](https://github.com/tunnckoCore/koa-better-body/issues/3))
- Accept text and buffer bodies
- Accept urlencoded and forms bodies
- Accept multipart form data files and fields
- Can parse correctly array data from forms - e.g. multiple fields to have same
  name - [dlau/koa-body#15](https://github.com/dlau/koa-body/pull/15)
- Can parse correctly forms that accept multiple files - see
  [#26](https://github.com/tunnckoCore/koa-better-body/issues/26) and
  [dlau/koa-body#15](https://github.com/dlau/koa-body/pull/15)
- Strict mode by default - see why on
  [IETF Message Semantics: Section 6.1](https://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-19#section-6.1)
- Custom JSON request detect function -
  [koajs/bodyparser#f6a5ff](https://github.com/koajs/bodyparser/commit/f6a5ff7ef6162702540b101de5dde71ee5ad19cd)
- Custom error handling function -
  [koajs/bodyparser#19418129](https://github.com/koajs/bodyparser/commit/194181298fe3bffce6b5fcf3cfebc35b8cda6c89)
- Extending types of request that your app can accept -
  [koajs/bodyparser#ba7479b](https://github.com/koajs/bodyparser/commit/ba7479baf893fc3391fcdb88d3d8173ac4df05e7)
- Using awesome [formidable][] package -
  [„battle-tested against hundreds of GB of file uploads“](https://github.com/felixge/node-formidable#current-status)
- Passing a custom `formidable.IncomingForm` instance, allowing awesome
  customization
- Passing all options to `formidable.IncomingForm`, allowing awesome control

## Table of Contents

- [Install](#install)
- [API](#api)
  - [koaBetterBody](#koabetterbody)
- [Working with `koa-router`](#working-with-koa-router)
- [Options](#options)
- [Note about `options.extendTypes`](#note-about-optionsextendtypes)
- [Note about advanced `querystring` parsing](#note-about-advanced-querystring-parsing)
- [Note about `strict` mode](#note-about-strict-mode)
- [See Also](#see-also)
- [Contributing](#contributing)
  - [Guides and Community](#guides-and-community)
  - [Support the project](#support-the-project)
- [Contributors](#contributors)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using
[markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## Install

This project requires [**Node.js**](https://nodejs.org) **>=8.11** _(see
[Support & Release Policy](https://github.com/tunnckoCoreLabs/support-release-policy))_.
Install it using [**yarn**](https://yarnpkg.com) or
[**npm**](https://npmjs.com).<br> _We highly recommend to use Yarn when you
think to contribute to this project._

```bash
$ yarn add koa-better-body
```

## API

<!-- docks-start -->

_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [koaBetterBody](./src/index.js#L36)

> Robust body parser for [koa][]@1, also works for `koa@2` (with deprecations).
> Will also work for future `koa@3` with [koa-convert][].

<span id="koabetterbody-signature"></span>

#### Signature

```ts
function(options)
```

<span id="koabetterbody-params"></span>

#### Params

- `options` **{object}** - see more on [options section](#options)
- `returns` **{GeneratorFunction}** - plugin for Koa

<span id="koabetterbody-examples"></span>

#### Examples

```js
var koa = require('koa');
var body = require('koa-better-body');
var app = koa();

app
  .use(body())
  .use(function* () {
    console.log(this.request.body); // if buffer or text
    console.log(this.request.files); // if multipart or urlencoded
    console.log(this.request.fields); // if json
  })
  .listen(8080, function () {
    console.log('koa server start listening on port 8080');
  });
```

<!-- docks-end -->

## Working with `koa-router`

using [koa-router][]

```js
'use strict';

var app = require('koa')();
var body = require('koa-better-body');
var router = require('koa-router')();

router.post('/upload', body(), function* (next) {
  console.log(this.request.files);
  console.log(this.request.fields);

  // there's no `.body` when `multipart`,
  // `urlencoded` or `json` request
  console.log(this.request.body);

  // print it to the API requester
  this.body = JSON.stringify(
    {
      fields: this.request.fields,
      files: this.request.files,
      body: this.request.body || null,
    },
    null,
    2,
  );

  yield next;
});

app.use(router.routes());
app.listen(4292);

var format = require('util').format;
var host = 'http://localhost:4292';
var cmd = 'curl -i %s/upload -F "source=@%s/.editorconfig"';

console.log('Try it out with below CURL for `koa-better-body` repository.');
console.log(format(cmd, host, __dirname));
```

## Options

Sane defaults. :sparkles:

Accepts JSON, [JSON API v1](http://jsonapi.org/), text, buffer,
[csp-report](https://mathiasbynens.be/notes/csp-reports), multipart and
urlencoded/form bodies. If you want to disallow accepting and parsing multipart
body you should pass `multipart: false`. Most of the defaults you can see at
[utils.defaultOptions and utils.defaultTypes](./utils.js). **All `options` are
also been passed to [formidable][].IncomingForm!** Even you can pass
IncomingForm instance to be able to handle the different formidable events.

- `fields` **{Boolean|String}**: Default `false`, which means it will set fields
  on `this.request.fields`. If you pass a string, for example `'foo'`, you will
  have fields on `this.request.foo`.
- `files` **{Boolean|String}**: Default `false`, which means it will set files
  on `this.request.files`. If you pass a string, for example `'bar'`, you will
  have files on `this.request.bar`.
- `multipart` **{Boolean}**: Default `true`. If you pass `false` it won't
  accept/parse multipart bodies.
- `textLimit` **{String}**: Default `'100kb'`. Passed to [bytes][].parse method.
- `formLimit` **{String}**: Default `'100kb'`. Passed to [bytes][].parse method.
- `urlencodedLimit` **{String}**: Default `'100kb'`. Alias of `opts.formLimit`.
- `jsonLimit` **{String}**: Default `'100kb'`. Passed to [bytes][].parse method.
- `bufferLimit` **{String}**: Default `'1mb'`. Passed to [bytes][].parse method.
- `jsonStrict` **{Boolean}**: Default `true`. When set to true, JSON parser will
  only accept arrays and objects.
- `detectJSON` **{Function}**: Custom JSON request detect function -
  `detectJSON(ctx)`.
- `strict` **{Boolean}**: Default `true`. Pass `false` if you want to allow
  parsing GET, DELETE and HEAD requests.
- `onerror` **{Function}**: Custom error handle, if throw an error, you can
  customize the response - `onerror(err, ctx)`.
- `extendTypes` **{Object}**: Default accepting types can find on
  [utils.defaultTypes function](./utils.js#L83-L104). Allowing you to extend
  what your app can accept. By default works for JSON,
  [JSON API v1](http://jsonapi.org/), multipart, text, urlencoded and
  [csp-report](https://mathiasbynens.be/notes/csp-reports).
- `IncomingForm` **{IncomingForm}**: Pass an instance of
  `formidable.IncomingForm` to be able to handle formidable events.
- `handler` **{GeneratorFunction}**: Works with `options.extendTypes.custom` to
  handle custom types of content-type - `handler(ctx, options, next)`. More info
  below.
- `querystring` **{Object}**: Querystring module to be used. By default builtin
  [`querystring`](https://nodejs.org/api/querystring.html). More info below.
- `qs` **{Object}**: Alias of `opts.querystring`. All `opts` are also passed to
  [qs][] or [querystring module](https://nodejs.org/api/querystring.html).
- `delimiter` **{String}**: Default is `&`. Delimiter of key/value pairs, passed
  to querystring lib
- `sep` **{String}**: alias of `opts.delimiter`
- `buffer` **{Boolean}**: Default `false`, pass `true` if you want to get body
  as buffer.

## Note about `options.extendTypes`

ExandTypes option gives you a flexible way to handle different content-types and
modify the defaults which can be found
[at utils.defaultTypes function](./utils.js#L83-L104). In addition you can pass
combination of `options.extendTypes.custom` and `options.handler`. When the
request has some of the "custom" content type, this middleware will call the
`handler` **generator** function with `ctx, options, next`. You can see more at
[issue #52](https://github.com/tunnckoCore/koa-better-body/issues/52).

For example manually handle such content types `foo/bar-x`, `text/quix`:

```js
const app = require('koa')()
const body = require('koa-better-body')

app.use(body({
  textLimit: '300kb'
  extendTypes: {
    custom: [
      'foo/bar-x',
      'text/quix'
    ]
  },
  handler: function * (ctx, opts) {
    // `ctx` is equal to `this` and `app`
    // `opts` is current options object
    // passed to `koa-better-body`
    ctx.body = yield this.request.text(opts.textLimit)
  }
}))
app.use(function * showBody () {
  // `this.body` is text
  console.log(this.body)
})
```

## Note about advanced `querystring` parsing

Because this middleware is fully based and integrated with [koa-body-parsers][],
by default it uses Node's built-in module for that thing
[querystring](https://nodejs.org/api/querystring.html). So if you have some
issues with forms, think to add custom querystring module like [qs][] to
`options.querystring` or `app.querystring`. Related to this is
[issue #45](https://github.com/tunnckoCore/koa-better-body/issues/45).

**Example**

```js
const app = require('koa')()
const body = require('koa-better-body')

app.use(body({
  multipart: false
  querystring: require('qs')
}))
```

It's intentional that it's not included in the deps by default. In `v2` it was
also working by passing it to `app.querystring`, because [koa-body-parsers][]
works
[that way (index.js#L53)](https://github.com/koajs/body-parsers/blob/master/index.js#L53).

## Note about `strict` mode

We are trying to follow standards. :cat2:

You can pass `strict:false`, but see
[IETF HTTP/1.1 Message Semantics: Section 6.1](https://tools.ietf.org/html/draft-ietf-httpbis-p2-semantics-19#section-6.1)
to understand why we stay to _"strict mode"_ by default. GET, HEAD, and DELETE
requests have no defined semantics for the request body, but this doesn't mean
they may not be valid in certain use cases. Last two tests at
[test/options.js](./test/options.js) are showing usage on non-strict and strict
mode.

**[back to top](#readme)**

## See Also

Some of these projects are used here or were inspiration for this one, others
are just related. So, thanks for your existance!

- [formidable](https://www.npmjs.com/package/formidable): A node.js module for
  parsing form data, especially file uploads. |
  [homepage](https://github.com/node-formidable/formidable 'A node.js module for parsing form data, especially file uploads.')
- [ip-filter](https://www.npmjs.com/package/ip-filter): Validates valid IPs
  (IPv4 and IPv6) using [micromatch][] - glob…
  [more](https://tunnckocore.com/opensource) |
  [homepage](https://tunnckocore.com/opensource 'Validates valid IPs (IPv4 and IPv6) using [micromatch][] - glob patterns, RegExp, string or array of globs. If match returns the IP, otherwise null.')
- [koa-body-parsers](https://www.npmjs.com/package/koa-body-parsers): collection
  of koa body parsers |
  [homepage](https://github.com/koajs/body-parsers#readme 'collection of koa body parsers')
- [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser): a body parser
  for koa |
  [homepage](https://github.com/koajs/body-parser 'a body parser for koa')
- [koa-ip-filter](https://www.npmjs.com/package/koa-ip-filter): Middleware for
  [koa][] that filters IPs against glob patterns, RegExp…
  [more](https://github.com/tunnckocore/koa-ip-filter#readme) |
  [homepage](https://github.com/tunnckocore/koa-ip-filter#readme 'Middleware for [koa][] that filters IPs against glob patterns, RegExp, string or array of globs. Support custom `403 Forbidden` message and custom ID.')
- [koa](https://www.npmjs.com/package/koa): Koa web app framework |
  [homepage](https://github.com/koajs/koa#readme 'Koa web app framework')
- [koala](https://www.npmjs.com/package/koala): Koa Framework Suite |
  [homepage](https://github.com/koajs/koala#readme 'Koa Framework Suite')

**[back to top](#readme)**

## Contributing

### Guides and Community

Please read the [Contributing Guide][contributing-url] and [Code of
Conduct][code_of_conduct-url] documents for advices.

For bug reports and feature requests, please join our [community][community-url]
forum and open a thread there with prefixing the title of the thread with the
name of the project if there's no separate channel for it.

Consider reading the
[Support and Release Policy](https://github.com/tunnckoCoreLabs/support-release-policy)
guide if you are interested in what are the supported Node.js versions and how
we proceed. In short, we support latest two even-numbered Node.js release lines.

### Support the project

[Become a Partner or Sponsor?][kofi-url] :dollar: Check the **OpenSource**
Commision (tier). :tada: You can get your company logo, link & name on this
file. It's also rendered on package's page in [npmjs.com][npmv-url] and
[yarnpkg.com](https://yarnpkg.com/en/package/koa-better-body) sites too!
:rocket:

Not financial support? Okey!
[Pull requests](https://github.com/tunnckoCoreLabs/contributing#opening-a-pull-request),
stars and all kind of
[contributions](https://opensource.guide/how-to-contribute/#what-it-means-to-contribute)
are always welcome. :sparkles:

## Contributors

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind are welcome!

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)), consider showing
your [support](#support-the-project) to them:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://tunnckoCore.com"><img src="https://avatars3.githubusercontent.com/u/5038030?v=4" width="100px;" alt=""/><br /><sub><b>Charlike Mike Reagent</b></sub></a><br /><a href="#infra-tunnckoCore" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=tunnckoCore" title="Code">💻</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=tunnckoCore" title="Documentation">📖</a> <a href="#ideas-tunnckoCore" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-tunnckoCore" title="Maintenance">🚧</a> <a href="https://github.com/node-formidable/node-formidable/commits?author=tunnckoCore" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

**[back to top](#readme)**

## License

Copyright (c) 2014-present, [Charlike Mike Reagent](https://tunnckocore.com)
`<opensource@tunnckocore.com>` & [contributors](#wonderful-contributors).<br>
Released under the [MPL-2.0 License][license-url].

<!-- badges -->

<!-- prettier-ignore-start -->

[contributing-url]: https://github.com/tunnckoCore/opensource/blob/master/CONTRIBUTING.md
[code_of_conduct-url]: https://github.com/tunnckoCore/opensource/blob/master/CODE_OF_CONDUCT.md

<!-- Heading badges -->

[npmv-url]: https://www.npmjs.com/package/koa-better-body
[npmv-img]: https://badgen.net/npm/v/koa-better-body?icon=npm&cache=300

[license-url]: https://github.com/tunnckoCore/opensource/blob/master/packages/koa-better-body/LICENSE
[license-img]: https://badgen.net/npm/license/koa-better-body?cache=300

[libera-manifesto-url]: https://liberamanifesto.com
[libera-manifesto-img]: https://badgen.net/badge/libera/manifesto/grey

<!-- Front line badges -->

[codecoverage-img]: https://badgen.net/badge/coverage/95.56%25/99CC09?icon=codecov&cache=300

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

[nodejs-img]: https://badgen.net/badge/node/>=8.11/green?cache=300

[downloads-weekly-img]: https://badgen.net/npm/dw/koa-better-body?icon=npm&cache=300
[downloads-monthly-img]: https://badgen.net/npm/dm/koa-better-body?icon=npm&cache=300
[downloads-total-img]: https://badgen.net/npm/dt/koa-better-body?icon=npm&cache=300

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
[twitter-share-url]: https://twitter.com/intent/tweet?text=https://ghub.now.sh/koa-better-body&via=tunnckoCore
[twitter-share-img]: https://badgen.net/badge/twitter/share/1da1f2?icon=twitter
[open-issue-url]: https://github.com/tunnckoCore/opensource/issues/new
[tunnckocore_legal]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/legal/tunnckocore?label&color=A56016&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_consulting]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/consulting/tunnckocore?label&color=07ba96&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_security]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/security/tunnckocore?label&color=ed1848&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_opensource]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/opensource/tunnckocore?label&color=ff7a2f&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_newsletter]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/newsletter/tunnckocore?label&color=5199FF&icon=https://svgshare.com/i/Dt6.svg

<!-- prettier-ignore-end -->

[bytes]: https://github.com/visionmedia/bytes.js
[formidable]: https://github.com/node-formidable/formidable
[koa-body-parsers]: https://github.com/koajs/body-parsers
[koa-convert]: https://github.com/gyson/koa-convert
[koa-router]: https://github.com/koajs/router
[koa]: https://github.com/koajs/koa
[lazy-cache]: https://github.com/jonschlinkert/lazy-cache
[micromatch]: https://github.com/micromatch/micromatch
[qs]: https://github.com/ljharb/qs
[raw-body]: https://github.com/stream-utils/raw-body
