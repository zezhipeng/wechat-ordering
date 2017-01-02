const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

const SuperAdminSchema = new Schema ({
  name: String,
  password: String
})

mongoose.model('SuperAdmin', SuperAdminSchema)
