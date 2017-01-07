import Vuex from 'vuex'
import Vue from 'vue'
import createWebSocketPlugin from './io'
import _ from 'lodash'
// import * as getters from './getters'
// import count from './modules/count'
import Cookies from 'js-cookie'
// import * as getters from './getters'
// import count from './modules/count'

let trader = Cookies.getJSON('trader')
// user = JSON.parse(user)
if (trader) {
  trader = trader.split('j:')[1]
}
// trader = JSON.parse(trader)

Vue.use(Vuex)

const socket = io()
const plugin = createWebSocketPlugin(socket)
const store = new Vuex.Store({
  state: {
    trader: {},
    dishes: [],
    orderings: [],
    coupon: [],
    service: '',
    users: [],
    print: {
    },
    auth: {
      authorized: trader || false
    }
  },
  getters: {
    trader: state => state.trader,
    service: state => state.service,
    tables: state => state.trader.tables,
    classes: state => state.trader.classes,
    orderings: state => state.orderings.filter(v => v.status === '等待' || v.status === '已付款'),
    done: state => state.orderings.filter(v => v.status === '完成'),
    coupon: state => state.coupon,
    users: state => state.users,
    print: state => state.print,
    today: state => {
      var today = new Date().getDate()
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getDate()
        return month === _month
      })
      var r

      r = _.reduce(data, (sum, item) => {
        item.dishes.forEach(dish => {
          sum = sum + dish.price * dish.number
        })

        return sum
      }, 0)

      return r
    },
    thisMonth: state => {
      var month = new Date().getMonth()
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getMonth()
        return month === _month
      })
      var r

      r = _.reduce(data, (sum, item) => {
        item.dishes.forEach(dish => {
          sum = sum + dish.price * dish.number
        })

        return sum
      }, 0)

      return r
    },
    lastMonth: state => {
      var month = new Date().getMonth() - 1
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getMonth()
        return month === _month
      })
      var r

      r = _.reduce(data, (sum, item) => {
        item.dishes.forEach(dish => {
          sum = sum + dish.price * dish.number
        })

        return sum
      }, 0)

      return r
    },
    daily: state => {
      var month = new Date().getMonth() + 1
      var d= new Date()
      var y = new Date(d.getFullYear(), month, 0).getDate()
      var r = []

      for (var i = 0; i < y + 1; ++i) {
        var items = _.filter(state.orderings, order => {
          return new Date(order.meta.createdAt).getDate() === i
        })

        r[i] = _.reduce(items, (sum, item) => {
          _.forEach(item.dishes, dish => {
            sum = sum + dish.price * dish.number
          })

          return sum
        }, 0)
      }

      return r
    },
    today: state => {
      var month = new Date().getDate()
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getDate()
        return month === _month
      })
      var r

      r = _.reduce(data, (sum, item) => {
        item.dishes.forEach(dish => {
          sum = sum + dish.price * dish.number
        })

        return sum
      }, 0)

      return r
    },
    dishesLabels: state => {
      var r = []

      for (var i = 0; i < state.dishes.length; ++i) {
        r.push(state.dishes[i].name)
      }

      return r
    },
    dishesData: state => {
      var month = new Date().getMonth()
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getMonth()
        return month === _month
      })
      var r = []

      for (var i = 0; i < state.dishes.length; ++i) {
        var count = _.reduce(data, (c, item) => {
          let a = _.filter(item.dishes, dish => {

            return dish.name === state.dishes[i].name
          })
          var _a = {
            number: 0
          }
          a = a.length
            ? a[0]
            : _a

          c = c + a.number

          return c
        }, 0)

        r.push(count)
      }
      console.log(r)
      return r
    },
    dishes: state => state.dishes
  },
  mutations: {
    service (state, data) {
      var table

      _.filter(state.trader.tables, _table => {
        if (_table._id === data.table) table = _table
      })

      state.service = `${table.name}号桌${data.user.nickname}需要服务`
    },
    trader (state, data) {
      state.auth.authorized = true
      state.trader = data
    },
    print (state, data) {
      state.print = data
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
    users (state, data) {
      state.users = data
    },
    dishes (state, data) {
      state.dishes = data
    },
    receiveData (state, {data}) {
      console.log('admin:', data)
    },
    update(state, req) {
      state.user[req.key] = req.data
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
        console.log(res)

        init()
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
        if (!res.success) {
          window.alert(res.msg)
        } else {
          state.auth.authorized = true

          Object.keys(res).forEach(key => {
            if (key !== 'success') {
              store.state[key] = res[key]
            }
          })
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

function init() {
  $.get('/api/init')
  .then(res => {
    Object.keys(res).forEach(key => {
      store.state[key] = res[key]
    })

    store.state.auth.authorized = true
  })
}

if (trader) {
  init()
}
module.exports = store
