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
    user: Math.random(),
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
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    list: state => {
      return state.list
    },
    order: state => {
      return state.order
    },
    orderLength: state => {
      return state.orderLength
    },
    recommend: state => {
      return state.list.filter(item => item.recommend)
    },
    user: state => {
      return state.user
    }
  },
  mutations: {
    addOrder (state, {item}) {
      socket.emit('addOrder', {item: item, user: state.user})

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
    },
    removeOrder (state, { item }) {
      socket.emit('removeOrder', {item: item, user: state.user})

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
    },
    addOrderSocket (state, { data }) {
      let item = data.item

      if (state.user !== data.user ) {
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
    },
    removeOrderSocket (state, { data }) {
      let item = data.item

      if (state.user !== data.user) {
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
