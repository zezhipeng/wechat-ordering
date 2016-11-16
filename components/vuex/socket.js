export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('msg', data => {
      store.commit('receiveData', data)
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
