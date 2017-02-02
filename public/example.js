'use strict'

// function app (model) {
//   let state = model.state
//   const routes = model.view || {}
//   const effects = model.effects || {}
//   const reducers = model.reducers || {}
//   const subscibes = model.subscibes || {}
//   const hooks = Object.assign({
//     onAction: () => {},
//     onUpdate: () => {},
//     onError: (er) => { throw er }
//   }, model.hooks)

//   const actions = {}
//   for (let name in Object.assign(reducers, effects)) {
//     actions[name] = (data) => {
//       hooks.onAction(name, data)

//       if (effects[name]) {
//         return effects[name](state, actions, data, hooks.onError)
//       }

//       const oldState = state
//       state = reducers[name](state, data)

//       // re-render view

//       hooks.onUpdate(oldState, state, data)
//     }
//   }
// }

// const html = require('bel')
// const gibon = require('../dist/gibon.cjs')

// const mainView = ({ params, pathname }, msg) => {
//   return html`<div>
//     <h1>${pathname}</h1>
//     <h2>${JSON.stringify(params)}</h2>
//   </div>`
// }

// const start = gibon({
//   '/': mainView,
//   '/about': mainView,
//   '/users/:user': mainView,
//   '/users/:user/edit': mainView,
//   '/groups/:group/users/:user/edit': mainView
// })

// start()


// const model = {
//   state: {
//     title: 'initial foo',
//   },
//   reducers: {
//     update: (state, data) => ({ title: data.title + Math.random() })
//   }
// }

// const onRoute = (view, context, oldEl, model) => {
//   context.state = model.state

//   let newEl = null
//   const actions = {}
//   const state = Object.freeze(model.state || {})
//   const reducers = model.reducers || {}
//   const effects = model.effects || {}
//   const hooks = Object.assign({
//     onAction: (name, data) => {},
//     onUpdate: () => {},
//     onError: (er) => { throw er }
//   }, model.hooks)

//   for (let name in Object.assign(reducers, effects)) {
//     actions[name] = (data) => {
//       hooks.onAction(name, data)

//       const effect = effects[name]
//       if (effect) {
//         return effect(state, actions, data, hooks.onError)
//       }
//       const reducer = reducers[name]
//       const oldState = state
//       const newState = reducer(oldState, data)
//       context.state = newState
//       newEl = view(context, actions)
//       oldEl = nanomorph(newEl, oldEl)
//       hooks.onUpdate(oldState, newState, data)
//     }
//   }
//   console.log('actions', actions)

//   newEl = newEl || view(context, actions)
//   return nanomorph(newEl, oldEl)
// }

// const onLoad = (el) => document.querySelector('#app').appendChild(el)

// start(onRoute, model)
