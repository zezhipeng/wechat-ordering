export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('msg', data => {
      store.commit('receiveData', {data})
    })
    socket.on('mongoose:save', data => {
      let req = {
        model: data.model
      }

      store.dispatch('reflash', req)
    })
  }
}
