# recommended-bump [![npm version][npmv-img]][npmv-url] [![License][license-img]][license-url] [![Libera Manifesto][libera-manifesto-img]][libera-manifesto-url]

CLI for the `recommended-bump` package, calculate next version based on Conventional Commits.

## Usage

Just run

```
bunx recommended-bump-cli
npx recommended-bump-cli
pnpm dlx recommended-bump-cli
```

You can also pass custom `--from`, `--to`, and `--cwd` flags. Any flags are directly passed to `git-raw-commits` thus to `git` too so you can use `--from HEAD~10` to get past 10 commits.

## License

Copyright (c) 2018-present, [Charlike Mike Reagent](https://tunnckocore.com)
`<opensource@tunnckocore.com>` & [contributors](#wonderful-contributors).<br> Released under the
[MPL-2.0 License][license-url].

<!-- badges -->

<!-- prettier-ignore-start -->

[contributing-url]: https://github.com/tunnckoCore/opensource/blob/master/CONTRIBUTING.md
[code_of_conduct-url]: https://github.com/tunnckoCore/opensource/blob/master/CODE_OF_CONDUCT.md

<!-- Heading badges -->

[npmv-url]: https://www.npmjs.com/package/recommended-bump
[npmv-img]: https://badgen.net/npm/v/recommended-bump?icon=npm

[license-url]: https://github.com/tunnckoCore/opensource/blob/master/packages/recommended-bump/LICENSE
[license-img]: https://badgen.net/npm/license/recommended-bump?cache=300

[libera-manifesto-url]: https://liberamanifesto.com
[libera-manifesto-img]: https://badgen.net/badge/libera/manifesto/grey

<!-- Front line badges -->

[codecoverage-img]: https://badgen.net/badge/coverage/100%25/green?icon=codecov
[codecoverage-url]: https://codecov.io/gh/tunnckoCore/opensource

[codestyle-url]: https://github.com/airbnb/javascript
[codestyle-img]: https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb

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

[nodejs-img]: https://badgen.net/badge/node/>=20/green?cache=300

[downloads-weekly-img]: https://badgen.net/npm/dw/recommended-bump?icon=npm
[downloads-monthly-img]: https://badgen.net/npm/dm/recommended-bump?icon=npm
[downloads-total-img]: https://badgen.net/npm/dt/recommended-bump?icon=npm

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
[twitter-img]: https://badgen.net/twitter/follow/tunnckoCore?icon=twitter&color=1da1f2
[patreon-url]: https://www.patreon.com/bePatron?u=5579781
[patreon-img]: https://badgen.net/badge/Become/a%20patron/F96854?icon=patreon

<!-- [patreon-img]: https://badgen.net/badge/Patreon/tunnckoCore/F96854?icon=patreon -->

[patreon-sponsor-img]: https://badgen.net/badge/become/a%20sponsor/F96854?icon=patreon
[twitter-share-url]: https://twitter.com/intent/tweet?text=https://ghub.now.sh/recommended-bump&via=tunnckoCore
[twitter-share-img]: https://badgen.net/badge/twitter/share/1da1f2?icon=twitter
[open-issue-url]: https://github.com/tunnckoCore/opensource/issues/new
[tunnckocore_legal]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/legal/tunnckocore?label&color=A56016&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_consulting]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/consulting/tunnckocore?label&color=07ba96&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_security]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/security/tunnckocore?label&color=ed1848&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_opensource]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/opensource/tunnckocore?label&color=ff7a2f&icon=https://svgshare.com/i/Dt6.svg
[tunnckocore_newsletter]: https://badgen.net/https/liam-badge-daknys6gadky.runkit.sh/com/newsletter/tunnckocore?label&color=5199FF&icon=https://svgshare.com/i/Dt6.svg

<!-- prettier-ignore-end -->

[babylon]: https://babeljs.io/
[cacache]: https://github.com/npm/cacache
[collect-mentions]: https://github.com/olstenlarck/collect-mentions
[define-property]: https://github.com/jonschlinkert/define-property
[execa]: https://github.com/sindresorhus/execa
[fast-glob]: https://github.com/mrmlnc/fast-glob
[glob]: https://github.com/isaacs/node-glob
[globby]: https://github.com/sindresorhus/globby
[jest-runner-docs]: https://tunnckocore.com/opensource
[koa-convert]: https://github.com/gyson/koa-convert
[koa]: https://github.com/koajs/koa
[parse-github-url]: https://github.com/jonschlinkert/parse-github-url
[tiny-glob]: https://github.com/terkelg/tiny-glob
