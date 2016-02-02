'use strict'

var defineProp = require('define-property')

module.exports = function parseFunction (val) {
  var type = typeof val
  if (type !== 'string' && type !== 'function') {
    return hiddens(defaults(), val, '', false)
  }
  var orig = val
  /* istanbul ignore next */
  if (type === 'function') {
    val = Function.prototype.toString.call(val)
  }

  return hiddens(parseFn(val), orig, val, true)
}

function parseFn (val) {
  var re = /(?:function\s*([\w$]*)\s*)*\(*([\w\s,$]*)\)*(?:[\s=>]*)([\s\S]*)/
  var match = re.exec(val)

  var params = match[2] && match[2].length ? match[2].replace(/\s$/, '') : ''
  var args = params.length && params.replace(/\s/g, '').split(',') || []
  var body = getBody(match[3] || '') || ''

  return {
    name: match[1] || 'anonymous',
    body: body,
    args: args,
    params: params
  }
}

function getBody (a) {
  var len = a.length - 1
  if (a.charCodeAt(0) === 123 && a.charCodeAt(len) === 125) {
    return a.slice(1, -1)
  }
  var m = /^\{([\s\S]*)\}[\s\S]*$/.exec(a)
  return m ? m[1] : a
}

function defaults () {
  return {
    name: 'anonymous',
    body: '',
    args: [],
    params: ''
  }
}

function hiddens (data, orig, val, valid) {
  defineProp(data, 'orig', orig)
  defineProp(data, 'value', val)
  defineProp(data, 'arguments', data.args)
  defineProp(data, 'parameters', data.params)
  defineProp(data, 'valid', valid)
  defineProp(data, 'invalid', !valid)
  return data
}
