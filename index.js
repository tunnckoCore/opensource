/*!
 * gibon <https://github.com/tunnckoCore/gibon>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

export default (routes, hash) => function start () {
  hash = !(history && history.pushState) // eslint-disable-line no-undef
  if (hash) throw new Error('Not supported')

  let dom = document.createElement('p')
  const handler = (_re) => {
    let loc = window.location
    let pathname = normalize(loc.pathname)
    let context = {
      loc,
      params: {},
      pathname
    }

    for (let route in routes) {
      if (routes[pathname]) {
        return (dom = routes[pathname](context))
      }
      _re = regexify(route)
      if (_re.regex.test(pathname)) {
        pathname.replace(_re.regex, function () {
          for (let i = 1; i < arguments.length - 2; i++) {
            context.params[_re.keys.shift()] = arguments[i]
          }
          _re.match = true
        })

        if (_re.match) {
          return (dom = routes[route](context))
        }
      }
    }
  }

  window.onpopstate = handler
  handler()

  return dom
}

function normalize (s) {
  return s === '/' ? s : s.replace(/^\/+/, '/').replace(/\/+$/, '')
}

function regexify (route, _regex) {
  const keys = []
  _regex = '^' + route
    .replace(/\//g, '\\/')
    .replace(/:(\w+)/g, (_, name) => {
      keys.push(name)
      return '(\\w+)'
    }) + '$'

  return {
    regex: new RegExp(_regex, 'i'),
    keys
  }
}

