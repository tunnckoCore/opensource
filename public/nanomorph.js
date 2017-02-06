'use strict'

const gibon = require('../dist/gibon-umd')
const nanomorph = require('nanomorph/update')
const html = require('bel')

const routes = {
  '/': (ctx) => html`<div><h1>home</h1><h2>${ctx.title}</h2></div>`,
  '/about': (ctx) => html`<div><h1>about</h1><h2>${ctx.title}</h2></div>`,
  '/users/:user': (ctx, params) => html`<div>
    <h1>user</h1>
    <h2>${params.user}</h2>
    <h3>${ctx.title}</h3>
  </div>`,
  '/users/:user/edit': (ctx, params) => html`<div>
    <h1>user edit</h1>
    <h2>${params.user}</h2>
    <h3>${ctx.title}</h3>
  </div>`,
  '/groups/:group/users/:user/edit': (ctx, params) => html`<div>
    <h1>edit user from group ${params.group}</h1>
    <h2>${params.user}</h2>
    <h3>${ctx.title}</h3>
  </div>`
}

const main = document.querySelector('#app div')
const update = nanomorph(main)

const state = {
  title: 'hello world'
}

const onRoute = (view, ctx, oldEl) => update(view(state), oldEl)
const router = gibon(routes, onRoute)

router.start()
