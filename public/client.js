'use strict'

const html = require('bel')
const gibon = require('../dist/gibon.cjs')

const start = gibon({
  '/': mainView,
  '/about': mainView,
  '/users/:user': mainView,
  '/users/:user/edit': mainView,
  '/groups/:group/users/:user/edit': mainView
})

function mainView ({ params, pathname }) {
  return html`<div>
    <h1>${pathname}</h1>
    <h2>params: ${JSON.stringify(params, null, 2)}</h2>
  </div>`
}

const el = start() // start listening on routes
const main = document.querySelector('#app')

// mount
main.appendChild(el)
