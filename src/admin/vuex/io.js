export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('msg', data => {
      store.commit('receiveData', {data})
    })
  }
}
