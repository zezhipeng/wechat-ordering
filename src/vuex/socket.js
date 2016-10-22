export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('msg', data => {
      console.log(data)
      store.commit('receiveData', data)
    })
    // store.subscribe(mutation => {
    //   if (mutation.type === 'UPDATE_DATA') {
    //     socket.emit('update', mutation.payload)
    //   }
    // })
  }
}
