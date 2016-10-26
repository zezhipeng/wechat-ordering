const io = require("socket.io")()
// const ios = require('socket.io-express-session')
// const session = require('express-session')
const mongoose = require("mongoose")
const db = mongoose.connection
const fs = require("fs")
// const mongoStore = require("connect-mongo")(session)
const pkg = require('../package.json');
const config = require('./index')
// //socket-session中间件
// io.use(ios({
//   resave: false,
//   saveUninitialized: true,
//   secret: pkg.name,
//   store: new mongoStore({
//     url: config.db,
//     collection : 'sessions'
//   })
// }))

io.on("connection", function (socket) {
  global.socket = io
  socket.emit('msg', 'hello')

  socket.on('addOrder', data => {
    io.emit('addOrder', data)
  })

  socket.on('removeOrder', data => {
    io.emit('removeOrder', data)
  })
  // console.log(socket)
  // socket.on('mongoose:save', (e) => {
  //   console.log(e)
  // })
    // socket.on("join", function (uid) {
    //     socket.roomId = uid
    //     socket.join(socket.roomId)
    //     method.method.users
    //         .findOne({uid: uid})
    //         .select("channels")
    //         .exec(function (err, cb) {
    //             if (cb) {
    //                 socket.channelId = cb.channels
    //                 method.method.channels
    //                     .findOneAndUpdate({_id: cb.channels}, {$inc: {viewers: 1}})
    //                     .exec(function (err, cb) {
    //                         //console.log("人数添加",err,cb)
    //                         if (socket.handshake.session.user) {
    //                             io.sockets.in(socket.roomId).emit("system", socket.handshake.session.user.name)
    //                         }
    //                     })
    //             }
    //         })
    //
    //     //console.log(socket.client)
    // })
    // //监听消息
    // socket.on("msg", function (msg) {
    //     const message = {}
    //     message.msg = msg
    //     message.user = socket.handshake.session.user
    //     io.sockets.in(socket.roomId).emit("msg", message)
    // })
    // //admin监听，查看硬件信息
    // socket.on("monitor", function () {
    //     monitor().then(function (cb) {
    //         io.sockets.in("admin").emit("monitor", cb)
    //     })
    // })
    //
    // socket.on("disconnect", function () {
    //     method.method.channels
    //         .findOneAndUpdate({_id: socket.channelId}, {$inc: {viewers: -1}})
    //         .exec()
    // })
    //
    //
    // //音频监听
    // socket.on("audio", function (audio) {
    //     fs.writeFile(__dirname + "/public/audio/test.wav", audio, function (err) {
    //         socket.emit("audio", "/audio/test.wav")
    //     })
    // })
})

module.exports = io
