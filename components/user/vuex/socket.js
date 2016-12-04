export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('initOrder', data => {
      store.state.orderLength = data.length

      store.state.order = data
    })
    socket.on('commitOrder', data => {
      console.log('commit', store.state.order)
      socket.emit('commitOrder', store.state.order)
    })
    socket.on('addOrder', data => {
      store.commit('addOrderSocket', {data})
    })
    socket.on('removeOrder', data => {
      let user = store.getters.user
      store.commit('removeOrderSocket', {data})
    })
  }
}
