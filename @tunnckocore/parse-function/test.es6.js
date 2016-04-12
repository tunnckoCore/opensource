/*!
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2015-2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var test = require('assertit')
var parseFunction = require('./index')

test('should work for ES6 class methods - parse method from instance (issue #15)', function (done) {
  class EqualityChecker {
    isEqual (a, b) { /* istanbul ignore next */ return a === b }
  }

  var checker = new EqualityChecker()
  var actual = parseFunction(checker.isEqual)

  test.strictEqual(actual.name, 'isEqual')
  test.strictEqual(actual.params, 'a, b')
  test.strictEqual(/return a\s?===\s?b/.test(actual.body), true)
  done()
})

test('should work for ES6 class methods - parse method from prototype (issue #15)', function (done) {
  class Baz {
    qux (x, y) { /* istanbul ignore next */ return x + y }
  }

  var actual = parseFunction(Baz.prototype.qux)

  test.strictEqual(actual.name, 'qux')
  test.strictEqual(actual.params, 'x, y')
  test.strictEqual(/return x\s?\+\s?y/.test(actual.body), true)
  done()
})

test('should parse correctly ES6 method in `function-less` notation (issue #15)', function (done) {
  var obj = {
    foobar (abc, def) { /* istanbul ignore next */ return abc * def }
  }

  var actual = parseFunction(obj.foobar)
  test.strictEqual(actual.name, 'foobar')
  test.strictEqual(actual.params, 'abc, def')
  test.strictEqual(/return abc\s?\*\s?def/.test(actual.body), true)
  done()
})
