const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

const OrderSchema = new Schema ({
  table: String,
  user: {
    type: ObjectId,
    ref: 'User'
  },
  trader: {
    type: ObjectId,
    ref: 'Trader'
  },
  totalFee: {
    type: Number,
    default: 0
  },
  fee: {
    type: Number,
    default: 0
  },
  assess: {
    text: String,
    stars: {
      type: Number,
      default: 0
    }
  },
  dishes: [
    {
      price: Number,
      src: String,
      name: String,
      number: Number
    }
  ],
  //
  status: {
    type: String,
    default: '等待'
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
})

OrderSchema.pre('save', function(next) {
  let req = {
    model: 'order'
  }
  if (global.socket) {
    global.socket.emit('mongoose:save', req)
  }

  next()
})

mongoose.model('Order', OrderSchema);
