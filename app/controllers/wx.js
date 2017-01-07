const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const client = require('../../config').client
const APIService = require('../../config/wx/service');
const sha1 = require('sha1')
const Promise = require('bluebird')
const path = require('path')
const Order = mongoose.model('Order')
const fs = require('fs')
const config = require('../../config')

var Payment = require('wechat-pay').Payment;
var initConfig = {
  partnerKey: config.partnerKey || "youcanyouupnocannobb1000NIAN1HUI",
  appId: config.appId || "wx3c3c10b371693534",
  mchId: config.mchId || "1416397002",
  notifyUrl: config.notifyUrl || "http://jimdream.com/wx/n",
  pfx: fs.readFileSync(path.join(__dirname, '../../libs/apiclient_cert.p12'))
}

var payment = new Payment(initConfig)

function getUserByCode(code) {
  return new Promise((resolve, reject) => {
    client.getUserByCode(code, (err, cb) => {
      if (err) reject(err)
      resolve(cb)
    })
  })
}

exports.hear = async(function* (req, res) {
  console.log(req.query)
  console.log(req.body)
  let token = 'Ruarua2016'
  let signature = req.query.signature || req.body.signature
  let nonce = req.query.nonce || req.body.nonce
  let timestamp = req.query.timestamp || req.body.timestamp
  let echostr = req.query.echostr || req.query.openid
  let str = [token, timestamp, nonce].sort().join('')
  let sha = sha1(str)
  console.log(sha)
  if (sha === signature) {
    console.log(echostr)
    res.send(echostr + '')
  }
})

exports.pay = async(function* (req, res) {
  var _id = req.query.orderId
  var order = yield Order.findById(_id).populate('user trader').exec()
  var ip = req.ip.replace('::ffff:', '')

  var total_fee = order.totalFee

  if (order.user.openid === 'ohie2vwWiN49QlqAsrQABcVXRvkA') {
    total_fee = 0.1
  }

  var _order = {
    body: `总费用 ${order.totalFee} 元`,
    attach: `总计 ${order.dishes.length} 件`,
    out_trade_no: order.trader.name + (+new Date),
    total_fee: total_fee,
    spbill_create_ip: ip,
    openid: order.user.openid,
    trade_type: 'JSAPI'
  }


  // var _order = {
  //   body: '吮指原味鸡 * 1',
  //   attach: '{"部位":"三角"}',
  //   out_trade_no: 'kfc' + (+new Date),
  //   total_fee: 10 * 100,
  //   spbill_create_ip: ip,
  //   openid: order.user.openid,
  //   trade_type: 'JSAPI'
  // }
  console.log(_order)
  payment.getBrandWCPayRequestParams(_order, function(err, payargs){
    if (err) console.log(err)
    console.log(payargs)
    return res.json(payargs)
  })
})

exports.user = async(function* (req, res) {
  var code = req.query.code || req.body.code

  if (code) {
    let cb = yield getUserByCode(code)

    console.log('user:', cb)
    if (cb) {
      var openid = cb.openid

      var exitUser = yield User.findOne({openid: openid}).exec()
      console.log('exitUser', exitUser)
      if (exitUser) {
        req.session.user = exitUser
        res.redirect(`/index/${req.session.trader}/${req.session.table}`)
      } else {
        var user = new User(cb)

        console.log('newUser', user)
        try {
          user = yield user.save()
          console.log('saveUser', user)
          req.session.user = user
          res.redirect(`/index/${req.session.trader}/${req.session.table}`)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
})

exports.signature = function (req, res) {
  let url = req.query.url
  APIService
    .getSignature(url)
    .then(signature => {
      console.log('then:', signature)
      res.json(signature)
    })
}
