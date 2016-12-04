'use strict'

/*
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

// require('dotenv').config()
const http = require('http')
const fs = require('fs')
const join = require('path').join
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const config = require('./config')

const models = join(__dirname, 'app/models')
const port = process.env.PORT || 3000
const app = express()
const ws = require("./config/webSocket")

/**
 * Expose
 */

module.exports = app

// // Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(join(models, file)))

// Bootstrap routes
// require('./config/passport')(passport)
require('./config/express')(app)
require('./config/routes')(app)

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen)

function listen () {
  // if (app.get('env') === 'test') return

  const server = http.createServer(app)

  ws(server, app)

  server.listen(config.port, function () {
      console.log("server started on ", config.port)
  })
}

function connect () {
  var options = { server: { socketOptions: { keepAlive: 1 } } }
  return mongoose.connect(config.db, options).connection
}
