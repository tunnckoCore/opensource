/*!
 * gibon <https://github.com/tunnckoCore/gibon>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

'use strict'

import dush from 'dush'
import router from 'dush-router'

export default function gibon (routes) {
  return dush().use(router()).use((app) => {
    // A bit backward compatibility
    Object.keys(routes).forEach((route) => {
      app.addRoute(route, routes[route])
    })

    onHistoryChange((node, e) => {
      app.emit('historyChange', node, e)
    })
    onHrefChange((node, e) => {
      app.emit('hrefChange', node, e)
    })
  })
}

/**
 * Utils
 */

function onHistoryChange (cb) {
  window.addEventListener('popstate', function onpopstate (e) {
    const obj = {
      pathname: window.location.pathname,
      search: window.location.search,
      href: window.location.href,
      hash: window.location.hash
    }

    cb(obj, e)
  })
}

function onHrefChange (cb) {
  window.addEventListener('click', function onclick (e) {
    if (which(e) !== 1) {
      return
    }
    // clicks with combination
    // of some common meta keys
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.defaultPrevented
    ) {
      return
    }

    // ensure link
    // use shadow dom when available
    var el = e.path ? e.path[0] : e.target
    while (el && el.nodeName !== 'A') {
      el = el.parentNode
    }

    if (!el || el.nodeName !== 'A') {
      return
    }

    // allow mailto links to work normally
    var link = el.getAttribute('href')
    if (link && link.indexOf('mailto:') > -1) {
      return
    }

    // allow external links to work normally
    var sameHost = el.host === window.location.host
    if (!sameHost) {
      return
    }

    // prevent default behaviour on internal links
    if (sameHost || el.pathname === window.location.pathname) {
      e.preventDefault()
    }

    // allow opt out when custom attribute
    if (!el.hasAttribute('data-no-routing')) {
      cb(el, e)
      return
    }
  })
}

function which (e) {
  e = e || window.event
  return e.which === null ? e.button : e.which
}
