'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

// const oAuthTypes = [
//   'github',
//   'twitter',
//   'facebook',
//   'google',
//   'linkedin'
// ];

/**
 * User Schema
 */

const UserSchema = new Schema({
   coupon: [
     {
       type: ObjectId,
       ref: 'Coupon'
     }
   ],
   order: {
     type: ObjectId,
     ref: 'Order'
   },
   message: [
    {
      text: String,
      time: Date,
      from: {
        type: Number,
        default: 0
      }
    }
   ],
   openid: String,
   nickname: String,
   sex: Number,
   province: String,
   city: String,
   country: String,
   headimgurl: String,
   privilege: Schema.Types.Mixed, //用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
   unionid: String // 只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。详见：获取用户个人信息（UnionID机制）
});


UserSchema.pre('save', function (next) {
  if (global.socket) {
    global.socket.emit('mongoose:save', this)
  }

  next()
})

mongoose.model('User', UserSchema);
