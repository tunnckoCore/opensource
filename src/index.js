/*!
 * gibon <https://github.com/tunnckoCore/gibon>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

export default function gibon (routes, onRoute, onClick) {
  let el = document.createElement('p')

  onRoute = onRoute || ((view, state) => view(state))
  onClick = onClick || ((e, loc) => {
    if (e.metaKey || e.shiftKey || e.ctrlKey || e.altKey) {
      return
    }
    let t = e.target

    while (t && t.localName !== 'a') {
      t = t.parentNode
    }

    loc = window.location
    if (t && t.host === loc.host && !t.hasAttribute('data-no-routing')) {
      render(t.pathname)
      e.preventDefault()
    }
  })

  function start (handle) {
    handle = () => render(window.location.pathname)

    handle()
    window.addEventListener('onpopstate', handle)
    window.onclick = (e) => onClick(e, render)
  }

  function render (view, state) {
    view = typeof view === 'string' ? getView(view) : view
    return (el = onRoute(view, state || {}, el))
  }

  function getView (pathname) {
    pathname = pathname.replace(/^\/+/, '/').replace(/\/+$/, '') || '/'
    window.history.pushState({}, '', pathname)
    return getRoute(routes, pathname)
  }

  return {
    start,
    render
  }
}

function getRoute (routes, pathname, _re) {
  if (typeof routes === 'function') {
    return routes
  }

  if (routes[pathname]) {
    return routes[pathname]
  }

  for (let route in routes) {
    _re = regexify(route)
    if (_re.regex.test(pathname)) {
      const params = {}
      pathname.replace(_re.regex, function () {
        for (let i = 1; i < arguments.length - 2; i++) {
          params[_re.keys.shift()] = arguments[i]
        }
        _re.match = 1
      })

      if (_re.match) {
        // if arrow function, buble throws
        return function (state, actions) {
          actions = actions || params
          return routes[route](state, actions, params)
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
