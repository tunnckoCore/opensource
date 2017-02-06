'use strict'

const html = require('bel')

const routes = {
  '/': (ctx) => html`<h1>home</h1>`,
  '/about': (ctx) => html`<h1>about</h1>`,
  '/users/:user': (ctx, params) => html`<div>
    <h1>user</h1>
    <h2>${params.user}</h2>
  </div>`,
  '/users/:user/edit': (ctx, params) => html`<div>
    <h1>user edit</h1>
    <h2>${params.user}</h2>
  </div>`,
  '/groups/:group/users/:user/edit': (ctx, params) => html`<div>
    <h1>edit user from group ${params.group}</h1>
    <h2>${params.user}</h2>
  </div>`
}

const helper = (parent, child) => {
  return parent.replaceChild(child, parent.childNodes[0])
}

const main = document.querySelector('#app')
const onRoute = (view, ctx, el) => helper(main, view(ctx))
const router = gibon(routes, onRoute)

router.start()
