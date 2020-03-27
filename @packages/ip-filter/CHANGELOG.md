# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.3](https://github.com/tunnckoCore/opensource/compare/ip-filter@3.0.2...ip-filter@3.0.3) (2020-03-27)

**Note:** Version bump only for package ip-filter





## [3.0.2](https://github.com/tunnckoCore/opensource/compare/ip-filter@3.0.1...ip-filter@3.0.2) (2020-03-27)


### Bug Fixes

* upgrade prettier to v2 ([#131](https://github.com/tunnckoCore/opensource/issues/131)) ([8b9f668](https://github.com/tunnckoCore/opensource/commit/8b9f66828baf27d92ce704f0f3c3c9a706ff39ed))





## [3.0.1](https://github.com/tunnckoCore/opensource/compare/ip-filter@3.0.0...ip-filter@3.0.1) (2020-03-16)

**Note:** Version bump only for package ip-filter





# 3.0.0 (2020-03-16)


### chore

* import `ip-filter` package + v3 of it ([#127](https://github.com/tunnckoCore/opensource/issues/127)) ([da3e887](https://github.com/tunnckoCore/opensource/commit/da3e887af6242ab4180d985cad69f506463baf21))


### BREAKING CHANGES

* release v3, see #127 

- require `node >= 10.13`
- relicense to `MPL-2.0`
- switch to use `micromatch@4` directly instead of legacy `is-match`
- continuation of https://github.com/tunnckoCore/ip-filter/issues/8
- new home https://ghub.now.sh/ip-filter (`@packages/ip-filter`)







## 2.0.0 - 2016-10-06

- update repo style and dotfiles
- use standard-version
- follow semver and standards
- use npm scripts

**BREAKING CHANGES**

- make 3rd argument to be `options` object instead of boolean
- fixes #3 and add more tests

## 1.0.2 - 2015-03-26
- Release v1.0.2 / npm@v1.0.2
- use verb to generate docs
- update boilerplate and license year
- use pre-commit to guarantee workflow

## 1.0.1 - 2015-03-26
- Release v1.0.1 / npm@v1.0.1
- add more tests
- little refactor to use `to-file-path` in strict mode
  + forced to be done, because of `micromatch@2.2` that works only for filepaths
- update deps

## 1.0.0 - 2015-05-24
- Release v1.0.0 / npm@v1.0.0
- add support for no strict mode
- run npm-related(1)
- run keywords(1)
- Commits on May 23, 2015
- add test for when invalid ip
- implement

## 0.0.0 - 2015-05-23
- first commits
