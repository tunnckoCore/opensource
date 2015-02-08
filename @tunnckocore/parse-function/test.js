/**
 * parse-function <https://github.com/tunnckoCore/parse-function>
 *
 * Copyright (c) 2014-2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var assert = require('assert');
var parseFunction = require('./index');
var coverageCodeRegex = require('coverage-code-regex');
var cleanupCoverageCode = require('cleanup-coverage-code');

function hackExpected(expected) {
  expected = expected.split('var').filter(Boolean);
  expected = expected.map(function(val) {
    return val.replace(/\s+/g,'');
  }).map(function(val) {
    return val.replace(/(function|return)(?:t|f)*?(?!\{)/g,'$1 ');
  });
  expected = expected.filter(Boolean).join('var ');
  expected = 'var ' + expected;

  return expected;
}

describe('parse-function:', function() {
  it('should parse given string to object', function(done) {
    var fixture = 'function testing(val, re, beta) { return true; }';
    var actual = parseFunction(fixture);
    var expected = {
      name: 'testing',
      params: 'val, re, beta',
      parameters: 'val, re, beta',
      args: ['val', 're', 'beta'],
      arguments: ['val', 're', 'beta'],
      body: ' return true; '
    };

    assert.deepEqual(actual, expected);
    done();
  });

  it('should parse given function to object', function(done) {
    var fixture = function yeah(cmd, params, cb) {
      var fn = function beta() {};
      var obj = {
        one: 'two',
        fix: 'delta'
      };
      return false;
    };

    var actual = parseFunction(fixture);
    var expected = {
      name: 'yeah',
      params: 'cmd, params, cb',
      parameters: 'cmd, params, cb',
      args: ['cmd', 'params', 'cb'],
      arguments: ['cmd', 'params', 'cb'],
      body: '\n      var fn = function beta() {};\n      var obj = {\n        one: \'two\',\n        fix: \'delta\'\n      };\n      return false;\n    '
    };

    // hack for coverage only
    if (coverageCodeRegex().test(actual.body)) {
      actual.parameters = actual.parameters.replace(/\s*/g, '');
      expected.parameters = expected.parameters.replace(/\s*/g, '');
      actual.body = cleanupCoverageCode(actual.body);
      expected.body = hackExpected(expected.body);
    }


    assert.deepEqual(actual.args, expected.args);
    assert.strictEqual(actual.name, expected.name);
    assert.strictEqual(actual.parameters, expected.parameters);
    assert.deepEqual(actual.arguments, expected.arguments);
    assert.strictEqual(actual.body, expected.body);
    done();
  });

  it('should parse given anonymous function', function(done) {
    var fixture = function(cmd, params, cb) {
      var fn = function beta() {};
      var obj = {
        one: 'two',
        fix: 'delta'
      };
      return false;
    };

    var actual = parseFunction(fixture);
    var expected = {
      name: 'anonymous',
      params: 'cmd, params, cb',
      parameters: 'cmd, params, cb',
      args: ['cmd', 'params', 'cb'],
      arguments: ['cmd', 'params', 'cb'],
      body: '\n      var fn = function beta() {};\n      var obj = {\n        one: \'two\',\n        fix: \'delta\'\n      };\n      return false;\n    '
    };

    // hack for coverage only
    if (coverageCodeRegex().test(actual.body)) {
      actual.parameters = actual.parameters.replace(/\s*/g, '');
      expected.parameters = expected.parameters.replace(/\s*/g, '');
      actual.body = cleanupCoverageCode(actual.body);
      expected.body = hackExpected(expected.body);
    }

    assert.deepEqual(actual.args, expected.args);
    assert.strictEqual(actual.name, expected.name);
    assert.strictEqual(actual.parameters, expected.parameters);
    assert.deepEqual(actual.arguments, expected.arguments);
    assert.strictEqual(cleanupCoverageCode(actual.body), expected.body);
    done();
  });

  it('should have `.args` empty array and `.arguments` empty string', function(done) {
    var fixture = function named() {
      var obj = {
        one: 'two',
        fix: 'delta'
      };
      return false;
    };

    var actual = parseFunction(fixture);
    var expected = {
      name: 'named',
      params: '',
      parameters: '',
      args: [],
      arguments: [],
      body: '\n      var obj = {\n        one: \'two\',\n        fix: \'delta\'\n      };\n      return false;\n    '
    };

    // hack for coverage only
    if (coverageCodeRegex().test(actual.body)) {
      actual.parameters = actual.parameters.replace(/\s*/g, '');
      expected.parameters = expected.parameters.replace(/\s*/g, '');
      actual.body = cleanupCoverageCode(actual.body);
      expected.body = hackExpected(expected.body);
    }

    assert.deepEqual(actual.args, expected.args);
    assert.strictEqual(actual.name, expected.name);
    assert.strictEqual(actual.parameters, expected.parameters);
    assert.deepEqual(actual.arguments, expected.arguments);
    assert.strictEqual(cleanupCoverageCode(actual.body), expected.body);
    done();
  });

  it('should have default empty properties, except `.name` which is "anonymous"', function(done) {
    var fixture = function() {};

    var actual = parseFunction(fixture);
    var expected = {
      name: 'anonymous',
      params: '',
      parameters: '',
      args: [],
      arguments: [],
      body: ''
    };

    // hack for coverage only
    if (coverageCodeRegex().test(actual.body)) {
      actual.body = cleanupCoverageCode(actual.body);
    }

    assert.deepEqual(actual.args, expected.args);
    assert.strictEqual(actual.name, expected.name);
    assert.strictEqual(actual.parameters, expected.parameters);
    assert.deepEqual(actual.arguments, expected.arguments);
    assert.strictEqual(actual.body, expected.body);
    done();
  });
});
