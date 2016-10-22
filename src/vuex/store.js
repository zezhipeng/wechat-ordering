import Vuex from 'vuex'
import Vue from 'vue'
import createWebSocketPlugin from './socket'
// import * as getters from './getters'
// import count from './modules/count'

Vue.use(Vuex)

const socket = io()

const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  },
  mutations: {
    addTodo (state, { item }) {
      state.todos.push(item)
    },
    receiveData (state, data) {
      console.log('receiveData', data)
    }
  },
  plugins: [plugin]
})

module.exports = store
