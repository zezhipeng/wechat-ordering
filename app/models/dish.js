const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

const DishSchema = new Schema ({
  trader: {
    type: ObjectId,
    ref: 'Trader'
  },
  name: String,
  class: String,
  price: Number,
  online: {
    type: Boolean,
    default: true
  },
  stars: Number,
  src: String,
  thumb: Number,
  recommend: {
    type: Boolean,
    default: false
  },
  recommendVt: String,
  vt: String,
  unit: String
})

mongoose.model('Dish', DishSchema)
