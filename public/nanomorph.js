'use strict'

const gibon = require('../dist/gibon.common')
const nanomorph = require('nanomorph')
const html = require('nanohtml')

/**
 * Some sample App with optional `initialState`
 * and optional `routes` objects. You can use `.addRoute`
 * method instead passing `routes` object
 *
 * @param {any} initialState
 * @param {object} routes
 */

function GibonApp (initialState, routes) {
  var router = gibon(routes)
  var tree = null
  var data = {}

  router.off('route')
  router.on('route', (view, context) => {
    return (tree = nanomorph(tree, view(context.state, context.params)))
  })

  router.start = () => {
    tree = router.navigate(window.location.pathname, initialState)

    router.on('render', (node, hist) => {
      if (hist) {
        window.history.replaceState(data, '', node.pathname)
      } else {
        window.history.pushState(data, '', node.pathname)
      }
      router.navigate(node.pathname, initialState)
    })

    router.on('historyChange', (node) => {
      router.emit('render', node, true)
    })
    router.on('hrefChange', (node) => {
      if (node.href === window.location.href) return

      router.emit('render', node)
    })

    return tree
  }

  router.mount = function mount_ (selector) {
    var newTree = router.start()
    var main = document.querySelector(selector)
    tree = nanomorph(main, newTree)
  }

  // Server-side rendering?
  router.toString = function toString_ (_pathname, _state) {
    return router.navigate(_pathname, _state).toString()
  }

  return router
}

/**
 * App Usage
 */

var app = GibonApp(
  // initialState
  { title: 'Hello World!!' },
  // routes
  {
    '/': (state) => html`<div><h1>home</h1><h2>${state.title}</h2></div>`,
    '/about': (state) => html`<div><h1>about</h1><h2>${state.title}</h2></div>`,
    '/users/:user': (state, params) => html`<div>
    <h1>user</h1>
    <h2>${params.user}</h2>
    <h3>${state.title}</h3>
  </div>`,
    '/users/:user/edit': (state, params) => html`<div>
    <h1>user edit</h1>
    <h2>${params.user}</h2>
    <h3>${state.title}</h3>
  </div>`,
    '/groups/:group/users/:user/edit': (state, params) => html`<div>
    <h1>edit user from group ${params.group}</h1>
    <h2>${params.user}</h2>
    <h3>${state.title}</h3>
  </div>`
  }
)

app.mount('#app div')

// try out:
// app.toString('/users/barry/edit', { title: 'hello my user friend' })
