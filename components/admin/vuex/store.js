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
    coupon: [],
    users: [],
    auth: {
      authorized: false
    }
  },
  getters: {
    trader: state => state.trader,
    tables: state => state.trader.tables,
    classes: state => state.trader.classes,
    orderings: state => state.orderings.filter(v => v.status === '等待'),
    done: state => state.orderings.filter(v => v.status === '完成'),
    coupon: state => state.coupon,
    users: state => state.users,
    dishes: state => state.dishes
  },
  mutations: {
    trader (state, data) {
      state.auth.authorized = true
      state.trader = data
    },
    orderings (state, data) {
      state.orderings = data
    },
    coupon (state, data) {
      state.coupon = data
    },
    tables (state, data) {
      state.user.tables = data
    },
    classes (state, data) {
      state.user.classes = data
    },
    order (state, data) {
      state.orderings = data
    },
    dishes (state, data) {
      state.dishes = data
    },
    receiveData (state, {data}) {
      console.log('admin:', data)
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
    reflash({commit}, req) {
      $.ajax({
        url: `/api/reflash/${req.model}`
      })
      .then(res => {
        if (res.success) {
          console.log(res.data)
          commit(req.model, res.data)
        }
      })
    },
    update ({commit}, req) {
      let model = req.model
      req._id = req._id || store.state[model]._id

      $.ajax({
        type: 'PUT',
        url: `/api/model/${model}`,
        data: req,
        dataType: 'json'
      })
      .then(res => {
        if (model === 'user') {
          init()
        } else {
          commit(model, res)
        }
      })
    },
    updateOrder({commit}, req) {
      let model = req.model

      $.ajax({
        type: 'PUT',
        url: `/api/updateOrder`,
        data: req,
        dataType: 'json'
      })
      .then(res => {
        console.log(res)
        // commit(model, res)
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
        commit(req.model, res.data)
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
    deleteItem ({commit}, req) {
      let model = req.model

      $.ajax({
        url: `/api/model/${req.model}?_id=${req.body._id}`,
        type: 'DELETE'
      })
      .then(res => {
        console.log(res)
        commit(model, res[model])
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
    Object.keys(res).forEach(key => {
      store.state[key] = res[key]
    })

    store.state.auth.authorized = true
  })
}

module.exports = store
