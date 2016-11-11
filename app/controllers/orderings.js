const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const Order = mongoose.model('Order')
const client = require('../../config').client
const APIService = require('../../config/wx/service');
const _ = require('lodash')

exports.create = async(function* (req, res) {
  let user = req.session.user
  let orderings = req.body.orderings
  let tableNumber = req.body.tableNumber

  try {
    let totalFee = _.reduce(orderings, (total, item) => {
      return total += item.price * item.number
    }, 0)

    var ordering = {
      tableNumber: tableNumber,
      user: user._id,
      totalFee: totalFee,
      orderings: orderings,
    }
  } catch (e) {
    yield res.json({
      success: 0,
      msg: e
    })
  }


  ordering = new Order(ordering)

  try {
    let saveOrder = yield ordering.save()

    res.json({
      success: 1,
      data: ordering,
      msg: '订单已提交'
    })
  } catch (e) {
    yield res.json({
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
