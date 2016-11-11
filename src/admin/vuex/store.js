import Vuex from 'vuex'
import Vue from 'vue'
import createWebSocketPlugin from './io'
import _ from 'lodash'
// import * as getters from './getters'
// import count from './modules/count'
import Cookies from 'js-cookie'
// import * as getters from './getters'
// import count from './modules/count'

Vue.use(Vuex)

const socket = io()
const plugin = createWebSocketPlugin(socket)
const store = new Vuex.Store({
  state: {
    trader: {},
    dishes: [],
    orderings: [],
    auth: {
      authorized: false
    }
  },
  getters: {
    trader: state => {
      return state.trader
    },
    tables: state => {
      return state.trader.tables
    },
    classes: state => {
      return state.trader.classes
    },
    orderings: state => {
      return state.orderings
    },
    dishes: state => {
      return state.dishes
    }
  },
  mutations: {
    trader (state, data) {
      state.auth.authorized = true
      state.trader = data
      console.log(state)
    },
    tables (state, data) {
      state.user.tables = data
    },
    classes (state, data) {
      state.user.classes = data
    },
    orderings (state, data) {
      state.orderings = data
    },
    dishes (state, data) {
      state.dishes = data
    },
    receiveData (state, {data}) {
      console.log('admin:', data)
    },
    newOrdering (state, data) {
      state.orderings.push(data)
    },
    update(state, req) {
      state.user[req.key] = req.data
    },
    login(state, res) {
      if (res.success) {
        state.auth.authorized = true
      }
    }
  },
  actions: {
    init ({commit}) {
      $.ajax({
        url: '/api/init'
      })
      .then(res => {
        commit('trader', res.trader)
        commit('dishes', res.dishes)
        commit('orderings', res.orderings)
      })
    },
    update ({commit}, req) {
      let model = req.model
      req._id = store.state[model]._id

      $.ajax({
        type: 'PUT',
        url: `/api/model/${model}`,
        data: req,
        dataType: 'json'
      })
      .then(res => {
        commit(model, res)
      })
    },
    create ({commit}, req) {
      let model = req.model
      req.body.trader = store.state.trader._id

      $.ajax({
        type: 'POST',
        url: `/api/model/${model}`,
        data: req.body,
        dataType: 'json'
      })
      .then(res => {
        init()
      })
    },
    login ({commit}, res) {
      $.ajax({
        type: 'POST',
        url: '/admin/login',
        data: data,
        dataType: 'json'
      })
      .then(res => {
        if (res.success) {
          commit('login', res)
        }
      })
    },
    del ({commit}, req) {
      $.ajax({
        url: `/api/${req.api}`,
        type: 'delete',
        data: req.data,
        dataType: 'json'
      })
      .then(res => {
        console.log(res)
        commit(req.api, res.data)
      })
    }
  },
  plugins: [plugin]
})

init()

function init() {
  $.get('/api/init')
  .then(res => {
    console.log(res)
    store.state.trader = res.trader
    store.state.orderings = res.orderings
    store.state.dishes = res.dishes
    store.state.auth.authorized = true
  })
}

module.exports = store
