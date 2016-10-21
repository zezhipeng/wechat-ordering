import Vue from 'vue'
import App from './App.vue'
import FastClick from 'fastclick'

$(function() {
    FastClick.attach(document.body);
})

new Vue({
  el: '#app',
  render: h => h(App)
})
