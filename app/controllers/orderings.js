const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const Ordering = mongoose.model('Ordering')
const _ = require('lodash')

exports.create = async(function* (req, res) {
  let body = req.body
  let user = body.user
  let list = body.ordering
  let totalFee = _.reduce(list, (result, val, key) => {
    if (key === price) result += val[key]
    return result
  }, 0)
  console.log(totalFee)

  let ordering = new Ordering(body)

  try {
    yield ordering.save()
    res.json({
      success: 1,
      data: ordering,
      msg: '订单已提交'
    })
  } catch (e) {
    res.json({
      success: 0,
      msg: '订单创建错误'
    })
    console.log('ordering:', e)
  }
})
