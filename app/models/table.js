const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

const TableSchema = new Schema ({
  name: String,
  size: Number,
  trader: {
    type: ObjectId,
    ref: 'Trader'
  }
})

mongoose.model('Table', TableSchema)
