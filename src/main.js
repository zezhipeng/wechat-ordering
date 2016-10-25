import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import FastClick from 'fastclick'
import Vuex from 'vuex'
import store from './vuex/store'
import 'sweetalert/dist/sweetalert.css'
import 'sweetalert'

fetch('/wx/signature')
  .then(res => res.json())
  .then(res => {
    wx.config(res)
    wx.ready(() => {
      console.log('wx-sdk is ready')
    })
    wx.error(e => {
      console.log('wx-sdk error:', e)
    })
  })

$(function() {
    FastClick.attach(document.body);
})

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
