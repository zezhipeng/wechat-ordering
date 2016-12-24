const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const Order = mongoose.model('Order')
const client = require('../../config').client
const APIService = require('../../config/wx/service');
const _ = require('lodash')
const Coupon = mongoose.model('Coupon')
const Trader = mongoose.model('Trader')

exports.create = async(function* (req, res) {
  const user = req.session.user
  const orderings = req.body.orderings
  const table = req.session.table
  const trader = req.session.trader
  const coupon = req.body.coupon

  var fee = _.reduce(orderings, (total, item) => {
    return total += item.price * item.number
  }, 0)

  var couponNow

  if (coupon && coupon._id) {
    couponNow = yield Coupon.findOne({trader: trader, _id: coupon._id}).exec()
  }

  var totalFee = fee

  if (couponNow && typeof totalFee !== 'undefined') {
    if (couponNow.due > Date.now()) {
      totalFee = totalFee - couponNow.minus
    }
  }

  var dishes = _.reduce(orderings, (report, item) => {
    let i = {
      price: item.price,
      src: item.src,
      name: item.name,
      number: item.number
    }
    report.push(i)

    return report
  }, [])
  let _trader = yield Trader.findById(trader).exec()
  let _table = _.find(_trader.tables, v => v._id == table)

  if (!_table) {
    return res.json({
      success: 0,
      msg: '桌位不存在'
    })
  }

  var ordering = {
    table: _table.name,
    user: user._id,
    fee: fee,
    totalFee: totalFee,
    dishes: dishes,
    trader: trader
  }

  ordering = new Order(ordering)

  try {
    let saveOrder = ordering.save()

    return res.json({
      success: 1,
      data: ordering,
      msg: '订单已提交'
    })
  } catch (e) {
    return res.json({
      success: 0,
      msg: '订单创建错误'
    })
    console.log('ordering:', e)
  }
})

exports.edit = async(function* (req, res) {
  let _id = req.params._id
  let body = req.body

  try {
    let ordering = yield Order.findByIdAndUpdate(_id, body).exec()
    console.log('ordering', ordering)
    res.json({
      success: 1,
      data: ordering
    })
  } catch (e) {
    res.json({
      success: 0,
      msg: e
    })
  }
})

exports.del = async(function* (req, res) {
  let _id = req.params._id

  try {
    let ordering = yield Order.findByIdAndRemove(_id).exec()

    res.json({
      success: 1
    })
  } catch (e) {
    res.json({
      success: 0,
      msg: e
    })
  }
})

exports.get = async(function* (req, res) {
  let _id = req.params._id

  try {
    let ordering = yield Order.findById(_id).exec()

    res.json({
      success: 1,
      data: ordering
    })
  } catch (e) {
    res.json({
      success: 0,
      msg: e
    })
  }
})

exports.getAll = async(function* (req, res) {
  try {
    let orderings = yield Order.find().exec()

    res.json({
      success: 1,
      data: orderings
    })
  } catch (e) {
    res.json({
      success: 0,
      msg: e
    })
  }
})
