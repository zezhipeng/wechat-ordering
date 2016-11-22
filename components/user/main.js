import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import FastClick from 'fastclick'
import Vuex from 'vuex'
import store from './vuex/store'
import 'sweetalert/dist/sweetalert.css'
import 'sweetalert'
import VueRouter from 'vue-router'
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

function init() {
  const routes = [
    { path: '/account', component: require('./components/account.vue') },
    { path: '/menu', component: require('./components/menu.vue') },
    { path: '/order', component: require('./components/order.vue') },
    { path: '*', component: require('./components/menu.vue') }
  ]

  const router = new VueRouter({
    mode: 'history',
    routes
  })

  sync(store, router)

  new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
  })
}
init()

let url = window.location.href

// $.get('/wx/signature?url=' + url)
// .then(res => {
//   let config = {
//     debug: true,
//     appId: res.appId,
//     signature: res.signature,
//     timestamp: res.timestamp,
//     nonceStr: res.nonceStr,
//     jsApiList: [
//       'chooseImage',
//       'previewImage',
//       'uploadImage',
//       'downloadImage'
//     ]
//   }
//
//   wx.config(config)
//   wx.ready(() => {
//     init()
//   })
//
//   wx.error(function(res){
//   })
// })

//
$(function() {
    FastClick.attach(document.body);
})
