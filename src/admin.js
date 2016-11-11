import Vue from 'vue'
import App from './admin/App.vue'
import store from './admin/vuex/store'
import VueRouter from 'vue-router'

import './assets/sass/base.scss'
import './assets/sass-project/project.scss'

import './assets/js/bootstrap'
import './assets/js/form-floating-label'
import './assets/js/form-textarea'
import './assets/js/header'
import './assets/js/menu'
import './assets/js/modal'
import './assets/js/picker'
import './assets/js/snackbar'
import './assets/js/tab'
import './assets/js/tile'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    meta: {
      auth: false
    },
    component: require('./admin/components/login.vue')
  },
  {
    path: '/signUp',
    meta: {
      auth: false
    },
    component: require('./admin/components/signUp.vue')
  },
  {
    path: '/',
    name: 'home',
    meta: {
      auth: true
    },
    component: require('./admin/components/home.vue'),
    children: [
      {
        path: 'orderings',
        meta: {
          auth: true
        },
        component: require('./admin/components/orderings.vue')
      },
      {
        path: 'dishes',
        meta: {
          auth: true
        },
        component: require('./admin/components/dishes.vue')
      },
      {
        path: 'classes',
        meta: {
          auth: true
        },
        component: require('./admin/components/classes.vue')
      },
      {
        path: 'tables',
        meta: {
          auth: true
        },
        component: require('./admin/components/tables.vue')
      }
    ]
  },
  {
    path: '*',
    meta: {auth: false},
    component: require('./admin/components/login.vue')
  }
]

const router = new VueRouter({
  routes
})

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
