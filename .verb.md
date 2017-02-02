# {%= name %} {%= badge('npm') %} {%= badge('downloads') %} [![npm total downloads][downloads-img]][downloads-url]

> {%= description %}

[![code climate][codeclimate-img]][codeclimate-url] 
[![standard code style][standard-img]][standard-url] 
[![linux build status][travis-img]][travis-url] 
[![windows build status][appveyor-img]][appveyor-url] 
[![coverage status][coveralls-img]][coveralls-url] 
[![dependency status][david-img]][david-url]

{%= include('highlight') %}

## Table of Contents
<!-- toc -->

## Install
Install with [npm](https://www.npmjs.com/)

```
$ npm install {%= name %} --save
```

or install using [yarn](https://yarnpkg.com)

```
$ yarn add {%= name %}
```

## Usage
> For more use-cases see the [tests](test.js)

```js
const {%= varname %} = require('{%= name %}')
```

## API
{%= apidocs('index.js') %}

{% if (verb.related && verb.related.list && verb.related.list.length) { %}
## Related
{%= related(verb.related.list, {words: 20}) %}
{% } %}

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/{%= repository %}/issues/new).  
Please read the [contributing guidelines](CONTRIBUTING.md) for advice on opening issues, pull requests, and coding standards.  
If you need some help and can spent some cash, feel free to [contact me at CodeMentor.io](https://www.codementor.io/tunnckocore?utm_source=github&utm_medium=button&utm_term=tunnckocore&utm_campaign=github) too.

**In short:** If you want to contribute to that project, please follow these things

1. Please DO NOT edit [README.md](README.md), [CHANGELOG.md](CHANGELOG.md) and [.verb.md](.verb.md) files. See ["Building docs"](#building-docs) section.
2. Ensure anything is okey by installing the dependencies and run the tests. See ["Running tests"](#running-tests) section.
3. Always use `npm run commit` to commit changes instead of `git commit`, because it is interactive and user-friendly. It uses [commitizen][] behind the scenes, which follows Conventional Changelog idealogy.
4. Do NOT bump the version in package.json. For that we use `npm run release`, which is [standard-version][] and follows Conventional Changelog idealogy.

Thanks a lot! :)

## Building docs
Documentation and that readme is generated using [verb-generate-readme][], which is a [verb][] generator, so you need to install both of them and then run `verb` command like that

```
$ npm install verbose/verb#dev verb-generate-readme --global && verb
```

_Please don't edit the README directly. Any changes to the readme must be made in [.verb.md](.verb.md)._

## Running tests
Clone repository and run the following in that cloned directory

```
$ npm install && npm test
```

## Author
{%= includeEither('authors', 'author') %}
+ [codementor/tunnckoCore](https://codementor.io/tunnckoCore)

## License
{%= copyright({ start: 2016, linkify: true, prefix: 'Copyright', symbol: '©' }) %} {%= license %}

***

{%= include('footer') %}  
_Project scaffolded using [charlike][] cli._

{%= reflinks(verb.reflinks) %}

[downloads-url]: https://www.npmjs.com/package/{%= name %}
[downloads-img]: https://img.shields.io/npm/dt/{%= name %}.svg

[codeclimate-url]: https://codeclimate.com/github/{%= repository %}
[codeclimate-img]: https://img.shields.io/codeclimate/github/{%= repository %}.svg

[travis-url]: https://travis-ci.org/{%= repository %}
[travis-img]: https://img.shields.io/travis/{%= repository %}/master.svg?label=linux

[appveyor-url]: https://ci.appveyor.com/project/tunnckoCore/{%= name %}
[appveyor-img]: https://img.shields.io/appveyor/ci/tunnckoCore/{%= name %}/master.svg?label=windows

[coveralls-url]: https://coveralls.io/r/{%= repository %}
[coveralls-img]: https://img.shields.io/coveralls/{%= repository %}.svg

[david-url]: https://david-dm.org/{%= repository %}
[david-img]: https://img.shields.io/david/{%= repository %}.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg