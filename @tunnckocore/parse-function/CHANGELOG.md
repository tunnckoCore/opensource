

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