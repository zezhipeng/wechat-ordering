export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('msg', data => {
      store.commit('receiveData', {data})
    })
    socket.on('mongoose:save', data => {
      console.log(data)
      store.commit('newOrdering', data)
    })
  }
}
