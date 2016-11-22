import Vue from 'vue'
import App from './App.vue'
import store from './vuex/store'
import VueRouter from 'vue-router'
// import { Vue2Dragula } from 'vue2-dragula'
import { sync } from 'vuex-router-sync'

import '../assets/css/base.css'
import '../assets/css/project.css'

import '../assets/js/bootstrap'
import '../assets/js/form-floating-label'
import '../assets/js/form-textarea'
import '../assets/js/header'
import '../assets/js/menu'
import '../assets/js/modal'
import '../assets/js/picker'
import '../assets/js/snackbar'
import '../assets/js/tab'
import '../assets/js/tile'

Vue.use(VueRouter)
// Vue.use(Vue2Dragula, {
//   logging: {
//     plugin: true,
//     service: true
//   }
// })

const routes = [
  {
    path: '/login',
    meta: {
      auth: false
    },
    component: require('./components/login.vue')
  },
  {
    path: '/signUp',
    meta: {
      auth: false
    },
    component: require('./components/signUp.vue')
  },
  {
    path: '/',
    name: 'home',
    meta: {
      auth: true
    },
    component: require('./components/home.vue'),
    children: [
      {
        path: 'orderings',
        meta: {
          auth: true
        },
        component: require('./components/orderings.vue')
      },
      {
        path: 'done',
        meta: {
          auth: true
        },
        component: require('./components/done.vue')
      },
      {
        path: 'dishes',
        meta: {
          auth: true
        },
        component: require('./components/dishes.vue')
      },
      {
        path: 'classes',
        meta: {
          auth: true
        },
        component: require('./components/classes.vue')
      },
      {
        path: 'tables',
        meta: {
          auth: true
        },
        component: require('./components/tables.vue')
      },
      {
        path: 'coupon',
        meta: {
          auth: true
        },
        component: require('./components/coupon.vue')
      },
      {
        path: 'cheer',
        meta: {
          auth: true
        },
        component: require('./components/cheer.vue')
      },
      {
        path: 'users',
        meta: {
          auth: true
        },
        component: require('./components/users.vue')
      }
    ]
  },
  {
    path: '*',
    meta: {auth: false},
    component: require('./components/login.vue')
  }
]

const router = new VueRouter({
  routes
})

sync(store, router)

router.beforeEach((to, from, next) => {
  let auth = to.matched[0].meta.auth
  let authorized = store.state.auth.authorized

  if (auth && !authorized) {
    // router.abort()

    next({path: '/login'})
  }
  // else if (to.path === '/login')
  next()
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
