## [![npm][npmjs-img]][npmjs-url] [![mit license][license-img]][license-url] [![build status][travis-img]][travis-url] [![deps status][daviddm-img]][daviddm-url]

> Parse a given function or string (fn.toString()) to object with `name`, `args` and `body` properties.

## Install
```bash
npm install parse-function
npm test
```


## API
> For more use-cases see the [tests](./test.js)

### [parseFunction](./index.js#L45)
> Parse given function or string to object with properties `name`, `args`, `arguments` and `body`

- `[fn]` **{Function|String}**
- `return` **{Object}**
  + `name` function name or `anonymous`
  + `args` function arguments names as array (`['val', 're', 'beta']`) or `''`
  + `arguments` function arguments as string (`val, re, beta`) or `''`
  + `body` function body as string or `''`

**Example:**

```js
var parseFunction = require('parse-function');

var fixture = 'function testing(val, re, beta) { return true; }';
var actual = parseFunction(fixture);
//=> actual = {
//  name: 'testing',
//  args: ['val', 're', 'beta'],
//  arguments: 'val, re, beta',
//  body: ' return true; '
//};

var unnamed = function() {};
var res = parseFunction(unnamed);
//=> res = {
//  name: 'anonymous',
//  args: [],
//  arguments: '',
//  body: ''
//};
```


## Author
**Charlike Mike Reagent**
+ [gratipay/tunnckoCore][author-gratipay]
+ [twitter/tunnckoCore][author-twitter]
+ [github/tunnckoCore][author-github]
+ [npmjs/tunnckoCore][author-npmjs]
+ [more ...][contrib-more]


## License [![MIT license][license-img]][license-url]
Copyright (c) 2014-2015 [Charlike Mike Reagent][contrib-more], [contributors][contrib-graf].  
Released under the [`MIT`][license-url] license.


[npmjs-url]: http://npm.im/parse-function
[npmjs-img]: https://img.shields.io/npm/v/parse-function.svg?style=flat&label=parse-function

[coveralls-url]: https://coveralls.io/r/tunnckoCore/parse-function?branch=master
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/parse-function.svg?style=flat

[license-url]: https://github.com/tunnckoCore/parse-function/blob/master/license.md
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat

[travis-url]: https://travis-ci.org/tunnckoCore/parse-function
[travis-img]: https://img.shields.io/travis/tunnckoCore/parse-function.svg?style=flat

[daviddm-url]: https://david-dm.org/tunnckoCore/parse-function
[daviddm-img]: https://img.shields.io/david/tunnckoCore/parse-function.svg?style=flat

[author-gratipay]: https://gratipay.com/tunnckoCore
[author-twitter]: https://twitter.com/tunnckoCore
[author-github]: https://github.com/tunnckoCore
[author-npmjs]: https://npmjs.org/~tunnckocore

[contrib-more]: http://j.mp/1stW47C
[contrib-graf]: https://github.com/tunnckoCore/parse-function/graphs/contributors

***

_Powered and automated by [kdf](https://github.com/tunnckoCore), January 26, 2015_