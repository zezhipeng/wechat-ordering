import Vuex from 'vuex'
import Vue from 'vue'
import createWebSocketPlugin from './socket'
import Cookies from 'js-cookie'
// import * as getters from './getters'
// import count from './modules/count'
Vue.use(Vuex)

let user = Cookies.getJSON('user')
// user = JSON.parse(user)
user = user.split('j:')[1]
user = JSON.parse(user)

const socket = io()
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state: {
    user: user,
    trader: {},
    order: [],
    orderCache: [],
    orderLength: 0,
    list: [
      {
        _id: 1,
        name: '烤乳猪',
        price: 69,
        stars: 3,
        src: 'images/10.jpg',
        thumb: 55,
        unit: '份'
      },
      {
        _id: 3,
        name: '广州文昌鸡',
        price: 56,
        stars: 1,
        src: 'images/11.jpg',
        thumb: 40,
        unit: '份'
      },
      {
        _id: 4,
        name: '白切鸡',
        price: 44,
        src: 'images/12.jpg',
        thumb: 30,
        unit: '份'
      },
      {
        _id: 5,
        name: '童年香肉',
        price: 22,
        stars: 2,
        src: 'images/13.jpg',
        thumb: 29,
        recommend: true,
        recommendVt: '天啊，在洛杉矶居然能找到性价比这么高的食物啊，简直难以置信',
        unit: '份',
        vt: '天啊，在洛杉矶居然能找到性价比这么高的食物啊，简直难以置信'
      },
      {
        _id: 6,
        name: '童茶香肉',
        price: 23,
        src: 'images/14.jpg',
        thumb: 9,
        unit: '份'
      },
      {
        _id: 7,
        name: '茶香肉',
        price: 12,
        stars: 4,
        thumb: 0,
        src: 'images/15.jpg',
        unit: '份',
        recommend: true,
        recommendVt: '天啊，在洛杉矶居然能找到性价比这么高的食物啊，简直难以置信',

        vt: '天啊，在美国居然能找到这么好吃的东西，简直难以置信'

      },
      {
        _id: 8,
        name: '童年茶香',
        price: 32,
        src: 'images/16.jpg',
        thumb: 1,
        unit: '份'
      },
      {
        _id: 9,
        name: '童年茶肉',
        price: 55,
        src: 'images/17.jpg',
        thumb: 2,
        unit: '份'
      }
    ]
  },
  getters: {
    list: state => {
      return state.list
    },
    order: state => {
      return state.order
    },
    orderLength: state => {
      return state.orderLength
    },
    totalFee: state => {
      return _.reduce(state.order, (total, item) => {
        return total += item.price * item.number
      }, 0)
    },
    recommend: state => {
      return state.list.filter(item => item.recommend)
    },
    user: state => {
      return state.user
    },
    coupon: state => {
      return state.user.coupon.filter(i => {
        let due = new Date(i.due).getTime()

        return !i.used && (now < due + 1000 * 60 * 60 * 24)
      })
    }
  },
  mutations: {
    addOrder (state, {item}) {
      socket.emit('addOrder', {item: item, user: state.user})
      addOrder(state, item)
    },
    removeOrder (state, { item }) {
      socket.emit('removeOrder', {item: item, user: state.user})
      removeOrder(state, item)
    },
    addOrderSocket (state, { data }) {
      let item = data.item

      if (state.user !== data.user ) {
        addOrder(state, item)
      }
    },
    removeOrderSocket (state, { data }) {
      let item = data.item

      if (state.user !== data.user) {
        removeOrder(state, item)
      }
    },
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


function init() {
  $.get(`/api/init?_id=${user._id}`)
  .then(res => {
    store.state.list = res.dishes
    store.state.trader = res.trader
  })
}

function addOrder(state, item) {
  let exit = false
  let index

  state.order.forEach((i, $index) => {
    if (i._id === item._id) {
      exit = true
      index = $index
    }
  })

  if (!exit) {
    item.number = 1
    state.order.push(item)
  } else {
    state.order = state.order.filter((o, i) => {
      if (i === index) {
        o.number++
      }
      return o
    })
  }

  setTimeout(function() {
    state.orderLength++
  }, 600)
}

function removeOrder(state, item) {
  let stay = false
  let index

  state.order.forEach((i, $index) => {
    if (i._id === item._id) {
      if (i.number > 1) {
        stay = true
      }
      index = $index
    }
  })


  if (!stay) {
    state.order.splice(index, 1)
  } else {
    state.order = state.order.filter((o, i) => {
      if (i === index) {
        o.number--
      }
      return o
    })
  }

  setTimeout(function() {
    state.orderLength--
  }, 600)
}

// <script type="text/x-template" id="grid-template">
//   <table>
//     <thead>
//       <tr>
//         <th v-for="key in columns"
//           @click="sortBy(key)"
//           :class="{ active: sortKey == key }">
//           {{ key | capitalize }}
//           <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
//           </span>
//         </th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr v-for="entry in filteredData">
//         <td v-for="key in columns">
//           {{entry[key]}}
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </script>
//
// <!-- demo root element -->
// <div id="demo">
//   <form id="search">
//     Search <input name="query" v-model="searchQuery">
//   </form>
//   <demo-grid
//     :data="gridData"
//     :columns="gridColumns"
//     :filter-key="searchQuery">
//   </demo-grid>
// </div>
//
// Vue.component('demo-grid', {
//   template: '#grid-template',
//   replace: true,
//   props: {
//     data: Array,
//     columns: Array,
//     filterKey: String
//   },
//   data: function () {
//     var sortOrders = {}
//     this.columns.forEach(function (key) {
//       sortOrders[key] = 1
//     })
//     return {
//       sortKey: '',
//       sortOrders: sortOrders
//     }
//   },
//   computed: {
//     filteredData: function () {
//       var sortKey = this.sortKey
//       var filterKey = this.filterKey && this.filterKey.toLowerCase()
//       var order = this.sortOrders[sortKey] || 1
//       var data = this.data
//       if (filterKey) {
//         data = data.filter(function (row) {
//           return Object.keys(row).some(function (key) {
//             return String(row[key]).toLowerCase().indexOf(filterKey) > -1
//           })
//         })
//       }
//       if (sortKey) {
//         data = data.slice().sort(function (a, b) {
//           a = a[sortKey]
//           b = b[sortKey]
//           return (a === b ? 0 : a > b ? 1 : -1) * order
//         })
//       }
//       return data
//     }
//   },
//   filters: {
//     capitalize: function (str) {
//       return str.charAt(0).toUpperCase() + str.slice(1)
//     }
//   },
//   methods: {
//     sortBy: function (key) {
//       this.sortKey = key
//       this.sortOrders[key] = this.sortOrders[key] * -1
//     }
//   }
// })
//
// // bootstrap the demo
// var demo = new Vue({
//   el: '#demo',
//   data: {
//     searchQuery: '',
//     gridColumns: ['name', 'power'],
//     gridData: [
//       { name: 'Chuck Norris', power: Infinity },
//       { name: 'Bruce Lee', power: 9000 },
//       { name: 'Jackie Chan', power: 7000 },
//       { name: 'Jet Li', power: 8000 }
//     ]
//   }
// })
