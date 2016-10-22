import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import FastClick from 'fastclick'
import Vuex from 'vuex'
import store from './vuex/store'

$(function() {
    FastClick.attach(document.body);
})

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
