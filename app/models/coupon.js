const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

const CouponSchema = new Schema ({
  trader: {
    type: ObjectId,
    ref: 'Trader'
  },
  due: Date,
  minus: Number,
  limit: Number,
  counter: Number
})

mongoose.model('Coupon', CouponSchema)
