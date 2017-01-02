const { wrap: async } = require('co')

const mongoose = require('mongoose')
const Dish = mongoose.model('Dish')
const Trader = mongoose.model('Trader')
const Order = mongoose.model('Order')
const sha1 = require('sha1')
const SuperAdmin = mongoose.model('SuperAdmin')





exports.index = async(function* (req, res) {
  if (req.session.superAdmin) {
    var traders = yield Trader.find({}).exec()
    var orders = yield Order.find().populate('trader user').exec()

    res.render('superAdmin/index', {
      traders: traders,
      orders: orders
    })
  }
  else {
    res.redirect('/superAdminLogin')
  }

})

exports.superAdminLogin = async(function* (req, res) {
  res.render('superAdmin/login')
})

exports.superAdminSignIn = async(function* (req, res) {
  console.log(req.body)
  console.log(req.query)
  if (req.body.name === 'admin' && req.body.password === 'hzjm2016') {
    req.session.superAdmin = true
    res.redirect('/superAdmin')
  } else {
    res.send('账号或密码错误')
  }
})

exports.update = async(function* (req, res) {
  var _id = req.body._id
  var password = sha1(req.body.password)
  var trader = yield Trader.findOneAndUpdate({_id: _id, password: password}).exec()

  res.json({
    success: 1
  })
})

exports.updateTo = async(function* (req, res) {
  var _id = req.body._id
  var online = req.body.online

  yield Trader.findOneAndUpdate({_id, _id}, {online, online}).exec()


  res.json({
    success: 1
  })
})

exports.delete = async(function* (req, res) {
  yield Trader.findByIdAndRemove(req.query._id).exec()

  res.json({
    success: 1
  })
})
