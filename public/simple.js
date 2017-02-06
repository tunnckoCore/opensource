'use strict'

const router = gibon({
  '/': (ctx) => console.log('home'),
  '/about': (ctx) => console.log('about'),
  '/users/:user': (ctx, params) => console.log('user:', params.user),
  '/users/:user/edit': (ctx, params) => console.log('edit user:', params.user),
  '/groups/:group/users/:user/edit': (ctx, params) => {
    console.log('edit user from group')
    console.log('group:', params.group)
    console.log('user:', params.user)
  }
})

router.start()


// html`<div>
//   <h1>${state.title}</h1>
//   <h2>${JSON.stringify(params)}</h2>
// </div>`
