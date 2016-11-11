const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

const ClassSchema = new Schema ({
  trader: {
    type: ObjectId,
    ref: 'Trader'
  },
  name: String,
  dishes: [
    {
      type: ObjectId,
      ref: 'Dish'
    }
  ]
})

mongoose.model('Class', ClassSchema)
