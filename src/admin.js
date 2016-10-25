import Vue from 'vue'
import App from './admin/App.vue'
import store from './admin/vuex/store'

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

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
