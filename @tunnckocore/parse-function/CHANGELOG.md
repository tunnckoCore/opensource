# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="4.0.1"></a>
## [4.0.1](https://github.com/tunnckocore/parse-function/compare/v4.0.0...v4.0.1) (2017-03-08)


### Bug Fixes

* **arrows:** bug when found arrow on function body ([3f6db26](https://github.com/tunnckocore/parse-function/commit/3f6db26)), closes [#30](https://github.com/tunnckocore/parse-function/issues/30)
* **package:** include files in npm package ([9f1bc4f](https://github.com/tunnckocore/parse-function/commit/9f1bc4f)), closes [#29](https://github.com/tunnckocore/parse-function/issues/29)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/tunnckocore/parse-function/compare/v3.0.0...v4.0.0) (2017-03-07)


### Bug Fixes

* **.use:** allow plugins that just extends the core api and not return a function to work ([efa6b72](https://github.com/tunnckocore/parse-function/commit/efa6b72))
* **codeclimate:** analize lib folder ([1db83ff](https://github.com/tunnckocore/parse-function/commit/1db83ff))
* **codeclimate:** xx ([957e994](https://github.com/tunnckocore/parse-function/commit/957e994))
* **package:** bump to babylon[@next](https://github.com/next) ([0e54780](https://github.com/tunnckocore/parse-function/commit/0e54780))
* **package:** fix linting ([707e7e1](https://github.com/tunnckocore/parse-function/commit/707e7e1))
* **package:** force update yarn ([d85a25b](https://github.com/tunnckocore/parse-function/commit/d85a25b))
* **package:** update deps and npm scripts, fix travis/appveyor ([f4414d0](https://github.com/tunnckocore/parse-function/commit/f4414d0))
* **style:** codeclimate issues ([8f38ad1](https://github.com/tunnckocore/parse-function/commit/8f38ad1))


### Code Refactoring

* **index:** plugins api, more tests, support es6 method notation ([8dbfa15](https://github.com/tunnckocore/parse-function/commit/8dbfa15)), closes [#27](https://github.com/tunnckocore/parse-function/issues/27)


### Features

* **methods:** reorganize repo, introduce ".use" and ".parse" methods ([91e1b4c](https://github.com/tunnckocore/parse-function/commit/91e1b4c))


### BREAKING CHANGES

* methods: main export is singleton function that returns an object with ".use" and ".parse"
methods; so to parse a function or string use "app.parse(fn)", where "app" is result of calling
"parseFunction()" which is the main export
* index: result.name is now "null" if function is real anonymous and "anonymous" if the name

of the function is exactly that; switch to use babylon.parseExpression, so maybe it would be faster;



<a name="3.0.0"></a>
# [3.0.0](https://github.com/tunnckocore/parse-function/compare/v2.3.2...v3.0.0) (2016-12-09)


* v3 (#24) ([a428b90](https://github.com/tunnckocore/parse-function/commit/a428b90))


### Bug Fixes

* **options:** rename "parser" options to -> "parse" - make more sense ([ee75cb7](https://github.com/tunnckocore/parse-function/commit/ee75cb7))
* **package:** add engines field ([c11669a](https://github.com/tunnckocore/parse-function/commit/c11669a))
* **rename:** rename "result.valid" to "result.isValid" ([2959f06](https://github.com/tunnckocore/parse-function/commit/2959f06))
* **rename:** the "result.orig" to "result.value" ([080a720](https://github.com/tunnckocore/parse-function/commit/080a720))


### Features

* **benchmarks:** add benchmarks ([e3030a1](https://github.com/tunnckocore/parse-function/commit/e3030a1))


### BREAKING CHANGES

* Drop support for node < v4; use babylon as default parser instead of acorn; expose

options param, that is directly passed to the given options.parser parser

* fix(*): small tweak

* fix(else): don't like "else"es, so remove it

* test(start): start rewriting tests

* test(update): improve tests, add over 130+ tests

tests against babylon, acorn, and acorn_loose parsers

* style(chore): es2015ify var -> const

* docs(readme): generate

* docs(api): docs





## 2.3.2 - 2016-04-19
- Release v2.3.2 / npm@v2.3.2
- update acorn version to 3.1.0
- fixes #15
- add tests to close #12
- add test to close #11

## 2.3.1 - 2016-02-13
- Release v2.3.1 / npm@v2.3.1
- codeclimate ignore `benchmark` folder
- use `ecmaVersion: 7`
- update to acorn@3.0.2

## 2.3.0 - 2016-02-02
- Release v2.3.0 / npm@v2.3.0
- update docs
- update (simplify) tests
- add benchmarks
- use `acorn`

> ### Pro Tips (What version to use?)
> There's no breaking changes between versions, the only version that have partial breaking change is `v2.1.x`, don't use it.
> 
> - use `v2.0.x` - if you don't need support for `arrow functions` and `es6 default params`.
> - use `v2.2.x` - if you just want basic support for `es6 features` like `ES6 Arrow Functions` (faster than `v2.3.x`)
> - use `v2.3.x` - if you want full support of `es6 arrow functions` and `es6 default params` (this uses `acorn`)

## 2.2.2 - 2016-02-01
- Release v2.2.2 / npm@v2.2.2
- add related libs
- add more tests
- back to `regex` approach, it's 40x faster than `string looping` thing from `v2.1.0`
  + using custom regex that match regular and arrow functions

## 2.2.1 - 2016-01-29
- Release v2.2.1 / npm@v2.2.1
- resolves [#3](https://github.com/tunnckoCore/parse-function/issues/3 "failing when something after CLOSE_CURLY")

## 2.2.0 - 2016-01-29
- Release v2.2.0 / npm@v2.2.0
- update docs
- add new tests for `valid/invalid`
- add two new properties in result object that are hidden by default: `valid` and `invalid`
  + `valid` **{Boolean}** it is `true` when `val` is function, arrow function or string, `false` otherwise
  + `invalid` **{Boolean}** opposite of `opts.valid`, when `true` the `opts.valid` is `false`
- always return result object with default values, instead of empty object
  + in `v2.0.1` was like that, in `v2.1.0` release that was broken by returning empty `{}` object

## 2.1.0 - 2016-01-27
- Release v2.1.0 / npm@v2.1.0
- update tests
- add two new properties in result object that are hidden by default: `value` and `orig`
  + `value` **{String}** string representation of the given `val`
  + `orig` **{Function|ArrowFunction|String}** original given `val`
- change `arguments` and `parameters` properties to be hidden by default
- add support for arrow functions: now can accept ES2015 arrow functions
- change to now use string looping instead of regex (performance impact?)

> **This release DO NOT have breaking changes!** But because switching from "regex matching" to "string looping" logic it may have performance differences - lower or higher performance. You are encouraged to consider alone which version to use. If you need arrow function support and feel performance hit please open an issue.
> 
> You are encouraged to use this version, because I think it is more stable and faster than previous.  
> If you feel any performance diffs, please open an issue and I will try to solve it.

## 2.0.1 - 2015-02-09
- Release v2.0.1 / npm@v2.0.1
- remove `mocha-lcov-reporter`.. needless
- cov stuff
- fix tests for coverage
- faster travis and iojs + v0.12 support

## 2.0.0 - 2015-01-27
- Release v2.0.0 / npm@v2.0.0
- add `parameters` and `params` properties, which are arguments as string
- change `arguments` to be arguments as array, with `args` alias
- add/fix tests

## 1.0.1 - 2015-01-26
- Release v1.0.1 / npm@v1.0.1
- fix typo in readme

## 1.0.0 - 2015-01-26
- Release v1.0.0 / npm@v1.0.0
- add keywords
- update travis

## 0.0.0 - 2015-01-26
- Initial commit
