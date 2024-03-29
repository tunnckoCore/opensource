# @tunnckocore/execa [![npm version][npmv-img]][npmv-url] [![License][license-img]][license-url] [![Libera Manifesto][libera-manifesto-img]][libera-manifesto-url]

> Thin layer on top of `execa` that allows executing multiple commands in
> parallel or in sequence with control for concurrency

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

## Table of Contents

- [Install](#install)
- [API](#api)
  - [.exec](#exec)
    - [Signature](#signature)
    - [Params](#params)
    - [Examples](#examples)
  - [.shell](#shell)
    - [Signature](#signature-1)
    - [Params](#params-1)
    - [Examples](#examples-1)
  - [all exports from `execa`](#execa)
    - [Signature](#signature-2)
    - [Params](#params-2)
    - [Examples](#examples-2)
- [Contributing](#contributing)
  - [Guides and Community](#guides-and-community)
  - [Support the project](#support-the-project)
- [Contributors](#contributors)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using
[markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## Install

This project requires [**Node.js**](https://nodejs.org) **>=10.13** _(see
[Support & Release Policy](https://github.com/tunnckoCoreLabs/support-release-policy))_.
Install it using [**yarn**](https://yarnpkg.com) or
[**npm**](https://npmjs.com).<br> _We highly recommend to use Yarn when you
think to contribute to this project._

```bash
$ yarn add @tunnckocore/execa
```

## API

<!-- docks-start -->

_Generated using [jest-runner-docs](https://ghub.now.sh/jest-runner-docs)._

### [.exec](./src/index.js#L39)

Uses [execa][], `{ execaCommand }` method. As stated there, think of it as mix
of `child_process`'s `.execFile` and `.spawn`. It is pretty similar to the
`.shell` method too, but only visually because it does not uses the system's
shell, meaning it does not have access to the system's environment variables.
You also can control concurrency by passing `options.concurrency` option. For
example, pass `concurrency: 1` to run in series instead of in parallel which is
the default behavior.

<span id="exec-signature"></span>

#### Signature

```ts
function(cmds, options)
```

<span id="exec-params"></span>

#### Params

- `cmds` **{Array&lt;string&gt;}** - a string or array of string commands to
  execute in parallel or series
- `[options]` **{object}** - directly passed to [execa][] and so to
  `child_process`
- `returns` **{Promise}** - resolved or rejected promises

> It also can accept array of multiple strings of commands that will be executed
> in series or in parallel (default).

<span id="exec-examples"></span>

#### Examples

```js
import { exec } from '@tunnckocore/execa';
// or
// const { exec } = require('@tunnckocore/execa');

async function main() {
  await exec('echo "hello world"', { stdio: 'inherit' });

  // executes in series (because `concurrency` option is set to `1`)
  await exec(
    [
      'prettier-eslint --write foobar.js',
      'eslint --format codeframe foobar.js --fix',
    ],
    { stdio: 'inherit', preferLocal: true, concurrency: 1 },
  );
}

main();
```

### [.shell](./src/index.js#L95)

Similar to `exec`, but also **can** access the system's environment variables
from the command.

<span id="shell-signature"></span>

#### Signature

```ts
function(cmds, options)
```

<span id="shell-params"></span>

#### Params

- `cmds` **{Array&lt;string&gt;}** - a commands to execute in parallel or series
- `options` **{object}** - directly passed to `execa`
- `returns` **{Promise}** - resolved or rejected promises

<span id="shell-examples"></span>

#### Examples

```js
import { shell } from '@tunnckocore/execa';
// or
// const { shell } = require('@tunnckocore/execa');

async function main() {
  // executes in series
  await shell(['echo unicorns', 'echo "foo-$HOME-bar"', 'echo dragons'], {
    stdio: 'inherit',
  });

  // exits with code 3
  try {
    await shell(['exit 3', 'echo nah']);
  } catch (er) {
    console.error(er);
    // => {
    //  message: 'Command failed: /bin/sh -c exit 3'
    //  killed: false,
    //  code: 3,
    //  signal: null,
    //  cmd: '/bin/sh -c exit 3',
    //  stdout: '',
    //  stderr: '',
    //  timedOut: false
    // }
  }
}

main();
```

### [.execa](./src/index.js#L121)

All [execa][] named exports, see its documentation. Think of this as a mix of
`child_process.execFile()` and `child_process.spawn()`.

<span id="execa-signature"></span>

#### Signature

```ts
function(file, args, options)
```

<span id="execa-params"></span>

#### Params

- `file` **{string}** - executable to run
- `args` **{Array&lt;string&gt;}** - arguments / flags to be passed to `file`
- `options` **{object}** - optional options, passed to `child_process`'s methods

<span id="execa-examples"></span>

#### Examples

```js
import { execa, execaCommand, execaNode } from '@tunnckocore/execa';
// or
// const { execa } = require('@tunnckocore/execa');

async function main() {
  await execa('npm', ['install', '--save-dev', 'react'], { stdio: 'inherit' });
}

main();
```

<!-- docks-end -->

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
[yarnpkg.com](https://yarnpkg.com/en/package/@tunnckocore/execa) sites too!
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

Copyright (c) 2017-present, [Charlike Mike Reagent](https://tunnckocore.com)
`<opensource@tunnckocore.com>` & [contributors](#wonderful-contributors).<br>
Released under the [MPL-2.0 License][license-url].

<!-- badges -->

<!-- prettier-ignore-start -->

[contributing-url]: https://github.com/tunnckoCore/opensource/blob/master/CONTRIBUTING.md
[code_of_conduct-url]: https://github.com/tunnckoCore/opensource/blob/master/CODE_OF_CONDUCT.md

<!-- Heading badges -->

[npmv-url]: https://www.npmjs.com/package/@tunnckocore/execa
[npmv-img]: https://badgen.net/npm/v/@tunnckocore/execa?icon=npm&cache=300

[license-url]: https://github.com/tunnckoCore/opensource/blob/master/@tunnckocore/execa/LICENSE
[license-img]: https://badgen.net/npm/license/@tunnckocore/execa?cache=300

[libera-manifesto-url]: https://liberamanifesto.com
[libera-manifesto-img]: https://badgen.net/badge/libera/manifesto/grey

<!-- Front line badges -->

[codecoverage-img]: https://badgen.net/badge/coverage/86.01%25/99CC09?icon=codecov&cache=300

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

[nodejs-img]: https://badgen.net/badge/node/>=10.13/green?cache=300

[downloads-weekly-img]: https://badgen.net/npm/dw/@tunnckocore/execa?icon=npm&cache=300
[downloads-monthly-img]: https://badgen.net/npm/dm/@tunnckocore/execa?icon=npm&cache=300
[downloads-total-img]: https://badgen.net/npm/dt/@tunnckocore/execa?icon=npm&cache=300

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
[twitter-share-url]: https://twitter.com/intent/tweet?text=https://ghub.now.sh/@tunnckocore/execa&via=tunnckoCore
[twitter-share-img]: https://badgen.net/badge/twitter/share/1da1f2?icon=twitter
[open-issue-url]: https://github.com/tunnckoCore/opensource/issues/new
[tunnckocore_legal]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/legal/tunnckocore?label&color=A56016&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_consulting]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/consulting/tunnckocore?label&color=07ba96&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_security]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/security/tunnckocore?label&color=ed1848&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_opensource]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/opensource/tunnckocore?label&color=ff7a2f&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_newsletter]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/newsletter/tunnckocore?label&color=5199FF&icon=https://svgshare.com/i/Dt6.svg

<!-- prettier-ignore-end -->

[execa]: https://github.com/sindresorhus/execa
