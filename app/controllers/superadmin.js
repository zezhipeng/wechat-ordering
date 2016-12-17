const { wrap: async } = require('co')

const mongoose = require('mongoose')
const Dish = mongoose.model('Dish')
const Trader = mongoose.model('Trader')
const Order = mongoose.model('Order')


exports.index = async(function* (req, res) {
  var traders = yield Trader.find({}).exec()

  res.render('superAdmin/index', {
    traders: traders
  })
})

exports.delete = async(function* (req, res) {
  yield Trader.findByIdAndRemove(req.query._id).exec()

  res.json({
    success: 1
  })
})
