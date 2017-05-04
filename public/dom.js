'use strict'

const gibon = require('../dist/gibon.common')
const html = require('bel')

const routes = {
  '/': (ctx) => html`<h1>home</h1>`,
  '/about': (ctx) => html`<h1>about</h1>`,
  '/users/:user': (ctx) => html`<div>
    <h1>user</h1>
    <h2>${ctx.params.user}</h2>
  </div>`,
  '/users/:user/edit': (ctx) => html`<div>
    <h1>user edit</h1>
    <h2>${ctx.params.user}</h2>
  </div>`,
  '/groups/:group/users/:user/edit': (ctx) => html`<div>
    <h1>edit user from group ${ctx.params.group}</h1>
    <h2>${ctx.params.user}</h2>
  </div>`
}

// const helper = (parent, child) => {
//   return parent.replaceChild(child, parent.childNodes[0])
// }

let tree = document.querySelector('#app')
const state = {}
const data = {}
const router = gibon(routes)

router.start = function () {
  tree = router.navigate(window.location.pathname, state)

  router.on('render', function (node, hist) {
    if (hist) {
      window.history.replaceState(data, '', node.pathname)
    } else {
      window.history.pushState(data, '', node.pathname)
    }
    router.navigate(node.pathname, state)
  })

  router.on('historyChange', function (node) {
    router.emit('render', node, true)
  })
  router.on('hrefChange', function (node) {
    if (node.href === window.location.href) return

    router.emit('render', node)
  })

  return tree
}

// const onRoute = (view, ctx, el) => helper(main, view(ctx))
// const router = gibon(routes, onRoute)

router.start()
