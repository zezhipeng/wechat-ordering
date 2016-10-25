import Vuex from 'vuex'
import Vue from 'vue'
import createWebSocketPlugin from './io'
// import * as getters from './getters'
// import count from './modules/count'

Vue.use(Vuex)

const socket = io()

const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state: {

  },
  getters: {},
  mutations: {
    receiveData (state, {data}) {
      console.log('admin:', data)
    }
  },
  plugins: [plugin]
})


module.exports = store
