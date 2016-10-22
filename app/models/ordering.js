const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

const OrderingSchema = new Schema ({
  tableNumber: Number,
  users:  [{
    type: ObjectId,
    ref: 'User'
  }],
  user: {
    type: ObjectId,
    ref: 'User'
  },
  totalFee: {
    type: Number,
    default: 0
  },
  list: [{
    name: String,
    price: Number,
    status: {
      type: String,
      default: '未处理'
    }
  }],
  status: {
    type: String,
    default: '未处理完成'
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

mongoose.model('Ordering', OrderingSchema);
