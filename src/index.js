/*!
 * gibon <https://github.com/tunnckoCore/gibon>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

export default function gibon (routes, dom) {
  return function app (model, onRoute) {
    onRoute = onRoute || ((view, context) => view(context))

    return model ? _start : _start()

    function _start () {
      window.onpopstate = handler
      handler()
      return dom
    }

    function handler (_re) {
      let loc = window.location
      let pathname = loc.pathname.replace(/^\/+/, '/').replace(/\/+$/, '')
      pathname = pathname || '/'

      let context = {
        loc,
        params: {},
        pathname
      }

      if (routes[pathname]) {
        dom = onRoute(routes[pathname], context, dom, model)
      }

      for (let route in routes) {
        _re = regexify(route)
        if (_re.regex.test(pathname)) {
          pathname.replace(_re.regex, function () {
            for (let i = 1; i < arguments.length - 2; i++) {
              context.params[_re.keys.shift()] = arguments[i]
            }
            _re.match = 1
          })

          if (_re.match) {
            dom = onRoute(routes[route], context, dom, model)
            break
          }
        }
      }
    }
  }
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
