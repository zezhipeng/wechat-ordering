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
console.log('trader', trader)
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
    theFilter: {
      start: '',
      end: ''
    },
    chartFilter: [
      {label: '今日', value: 'today'},
      {label: '本月', value: 'thisMonth'},
      {label: '今年', value: 'thisYear'}
    ],
    print: {
    },
    auth: {
      authorized: trader || false
    }
  },
  getters: {
    theFilter: state => state.theFilter,
    trader: state => state.trader,
    service: state => state.service,
    tables: state => state.trader.tables,
    classes: state => state.trader.classes,
    allOrdering: state => state.orderings,
    orderings: state => {
      var orderings = state.orderings.filter(v => v.status === '等待' || v.status === '已付款')

      if (state.theFilter.start) {
        orderings = orderings.filter(order => {
          var time = new Date(state.theFilter.start).getTime()

          return new Date(order.meta.createdAt).getTime() > time
        })
      }

      if (state.theFilter.end) {
        orderings = orderings.filter(order => {
          var time = new Date(state.theFilter.end).getTime()
          return new Date(order.meta.createdAt).getTime() < time
        })
      }

      return orderings
    },
    done: state => {
      var orderings = state.orderings.filter(v => v.status === '完成')

      if (state.theFilter.start) {
        orderings = orderings.filter(order => {
          var time = new Date(state.theFilter.start).getTime()

          return new Date(order.meta.createdAt).getTime() > time
        })
      }

      if (state.theFilter.end) {
        orderings = orderings.filter(order => {
          var time = new Date(state.theFilter.end).getTime()
          return new Date(order.meta.createdAt).getTime() < time
        })
      }

      return orderings

    },
    coupon: state => state.coupon,
    chartFilter: state => state.chartFilter,
    users: state => state.users,
    print: state => state.print,
    todayPercent: state => {
      var month = new Date().getDate()
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getDate()
        return month === _month
      })

      var total = _.reduce(data, (c, item) => {
        var t = item.dishes.map(dish => dish.price * dish.number)
        t = _.sum(t)
        c = c + t
        console.log(c)
        return c
      }, 0)

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

        var m = state.dishes[i].price * count

        r.push(Math.floor(m / total * 100))
      }

      return r
    },
    thisMonthPercent: state => {
      var month = new Date().getMonth()
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getMonth()
        return month === _month
      })

      var total = _.reduce(data, (c, item) => {
        var t = item.dishes.map(dish => dish.price * dish.number)
        t = _.sum(t)
        c = c + t
        console.log(c)
        return c
      }, 0)

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

        var m = state.dishes[i].price * count

        r.push(Math.floor(m / total * 100))
      }

      return r
    },
    thisYearPercent: state => {
      var month = new Date().getYear()
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getYear()
        return month === _month
      })

      var total = _.reduce(data, (c, item) => {
        var t = item.dishes.map(dish => dish.price * dish.number)
        console.log('t', t)
        t = _.sum(t)
        c = c + t

        return c
      }, 0)

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

        var m = state.dishes[i].price * count

        r.push(Math.floor(m / total * 100))
      }

      return r
    },
    thisMonth: state => {
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

      return r
    },
    thisYear: state => {
      var month = new Date().getYear()
      var data = _.filter(state.orderings, order => {
        var _month = new Date(order.meta.createdAt).getYear()
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

      return r
      // var month = new Date().getYear()
      // var data = _.filter(state.orderings, order => {
      //   var _month = new Date(order.meta.createdAt).getYear()
      //   return month === _month
      // })
      // var r
      //
      // r = _.reduce(data, (sum, item) => {
      //   item.dishes.forEach(dish => {
      //     sum = sum + dish.price * dish.number
      //   })
      //
      //   return sum
      // }, 0)
      //
      // return r
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

      return r
    },
    // today: state => {
    //   var month = new Date().getDate()
    //   var data = _.filter(state.orderings, order => {
    //     var _month = new Date(order.meta.createdAt).getDate()
    //     return month === _month
    //   })
    //   var r
    //
    //   r = _.reduce(data, (sum, item) => {
    //     item.dishes.forEach(dish => {
    //       sum = sum + dish.price * dish.number
    //     })
    //
    //     return sum
    //   }, 0)
    //
    //   return r
    // },
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
    theFilterStart(state, data) {
      state.theFilter.start = data
    },
    theFilterEnd(state, data) {
      state.theFilter.end = data
    },
    toggleCheck(state, data) {
      state.coupon[data].checked = !state.coupon[data].checked
    },
    service (state, data) {
      var table

      _.filter(state.trader.tables, _table => {
        if (_table._id === data.table) table = _table
      })

      state.service = `${table.name}号桌${data.user.nickname}需要服务.   ${new Date().getHours()}:${new Date().getMinutes()}`
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
    editDish({commit}, req) {
      $.ajax({
        type: 'put',
        url: '/api/model/dishes',
        data: req
      }).then(res => {
        store.dispatch('reflash', req)
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

function init(trader) {
  trader = trader || ''
  $.get(`/api/init?trader=${trader}`)
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
