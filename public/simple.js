'use strict'

const html = require('bel')

const mainView = ({ params, pathname }, msg) => {
  return html`<div>
    <h1>${pathname}</h1>
    <h2>${JSON.stringify(params)}</h2>
  </div>`
}

const start = gibon({
  '/': mainView,
  '/about': mainView,
  '/users/:user': mainView,
  '/users/:user/edit': mainView,
  '/groups/:group/users/:user/edit': mainView
})

// returns what the view returns
const el = start()
const main = document.querySelector('#app')

main.appendChild(el)
