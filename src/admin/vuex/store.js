import Vuex from 'vuex'
import Vue from 'vue'
import createWebSocketPlugin from './io'
import _ from 'lodash'
// import * as getters from './getters'
// import count from './modules/count'

Vue.use(Vuex)

const socket = io()

const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state: {
    orderings: []
  },
  getters: {
    allOrderings: state => {
      let allOrderings = _.reduce(state.orderings, (result, item) => {
        result = _.concat(result, item.orderings)
        
        return result
      }, [])
      console.log('allOrderings', allOrderings)
      return allOrderings
    }
  },
  mutations: {
    receiveData (state, {data}) {
      console.log('admin:', data)
    },
    newOrdering (state, data) {
      console.log(data)
      state.orderings.push(data)
    }
  },
  plugins: [plugin]
})


module.exports = store
