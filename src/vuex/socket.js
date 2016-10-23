export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('msg', data => {
      store.commit('receiveData', data)
    })
    socket.on('addOrder', data => {
      console.log(data)
      store.commit('addOrderSocket', {data})
    })
    socket.on('removeOrder', data => {
      let user = store.getters.user
      store.commit('removeOrderSocket', {data})
    })
    // store.subscribe(mutation => {
    //   if (mutation.type === 'UPDATE_DATA') {
    //     socket.emit('update', mutation.payload)
    //   }
    // })
  }
}
