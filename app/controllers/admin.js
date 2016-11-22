const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const Order = mongoose.model('Order')
const client = require('../../config').client
const APIService = require('../../config/wx/service');
const Trader = mongoose.model('Trader')
// const Class = mongoose.model('Class')
const Dish = mongoose.model('Dish')
const sha1 = require('sha1')
const qiniu = require('qiniu')
const Coupon = mongoose.model('Coupon')

qiniu.conf.ACCESS_KEY = 'cw7SuaudV3y-NbqWLoyeMash8bo0SsZMVKj4O6l1'
qiniu.conf.SECRET_KEY = 'oryX3EukelCKUOBD-9vYKX7cKzhOTGFh_VVB8gmE'

const api = {
  trader: Trader,
  dishes: Dish,
  order: Order,
  user: User,
  coupon: Coupon
}

exports.index = async(function* (req, res) {
  respond(res, 'admin/index', {
    page: 'admin/main'
  })
})

exports.update = async(function* (req, res) {
  let body = req.body
  let operator = body.operator
  let key = body.key
  let value = body.value
  let model = req.params.model
  let _id = body._id
  console.log(body)
  try {
    let update = yield api[model].findById(_id).exec()
    if (operator === 'push') {
      update[key][operator](value)
    }
    else if (operator === 'splice') {
      update[key][operator](value, 1)
    }
    else {
      update[key] = value
    }
    update = yield update.save()

    res.json(update)
  } catch(e) {
    res.send(e)
  }
})

exports.updateOrder = async(function* (req, res) {
  let body = req.body
  let key = body.key
  let value = body.value
  let trader = req.session.trader._id
  let _id = body._id

  try {
    let order = yield Order.findOne({trader: trader, _id: _id}).exec()
    order[key] = value
    let _order = yield order.save()
    console.log(_order)
    res.json(_order)
  } catch(e) {
    res.send(e)
  }
})

exports.create = async(function* (req, res) {
  let body = req.body
  let model = req.params.model

  body.trader = req.session.trader._id
  try {
    let schema = new api[model](body)
    schema = yield schema.save()
    console.log(schema)
    let data = yield api[model].find({trader: body.trader}).exec()

    res.json({
      success: 1,
      data: data
    })
  } catch(e) {
    res.send(e)
  }
})

exports.delete = async(function* (req, res) {
  let _id = req.query._id
  let model = req.params.model

  if (_id) {
    try {
      yield api[model].findByIdAndRemove(_id).exec()

      let trader = yield Trader.findById(req.session.trader._id).exec()
      let dishes = yield Dish.find({trader: req.session.trader._id}).exec()
      let orderings = yield Order.find({trader: req.session.trader._id}).exec()

      res.json({
        trader: trader,
        dishes: dishes,
        orderings: orderings
      })
    } catch(e) {
      res.send(e)
    }
  }
})

exports.login = async(function* (req, res) {
  let body = req.body

  body.password = sha1(body.password)
  try {
    let trader = yield Trader.findOne(body).exec()

    req.session.trader = trader
    res.cookie('trader', trader)

    if (!trader) {
      return res.json({
        success: 0,
        msg: '用户不存在或密码错误'
      })
    }

    res.json({
      success: 1,
      data: trader
    })
  } catch(e) {
    res.send(e)
  }

})
exports.signUp = async(function* (req, res) {
  var body = req.body

  body.password = sha1(body.password)

  try {
    console.log('body', body)
    var trader = new Trader({
      name: body.name,
      password: body.password,
      tables: []
    })

    trader.save()
    req.session.trader = trader
    res.cookie('trader', trader)

    res.json({
      success: 1,
      data: trader
    })
  } catch(e) {
    console.log('signUp', e)

    res.send(e)
  }

})

exports.init = async(function* (req, res) {
  if (!req.session.trader) {
    res.json({
      success: 0,
      msg: '不存在 session'
    })
  }
  let _id = req.session.trader._id

  try {
    let trader = yield Trader.findById(_id).exec()
    let dishes = yield Dish.find({trader: _id}).exec()
    let orderings = yield Order.find({trader: _id}).populate('user').exec()
    let coupon = yield Coupon.find({trader: _id}).exec()
    let users = yield User.find({traders: {$in: [_id]}}).populate('coupon').exec()

    res.json({
      trader: trader,
      dishes: dishes,
      coupon: coupon,
      users: users,
      orderings: orderings
    })
  } catch(e) {
    res.send(e)
  }
})

exports.reflash = async(function* (req, res) {
  const model = req.params.model

  try {
    if (model === 'order') {
      var data = yield api[model].find({trader: req.session.trader._id}).populate('user').exec()
    } else {
      var data = yield api[model].find({trader: req.session.trader._id}).exec()
    }

    res.json({
      success: 1,
      data: data
    })
  } catch(e) {
    res.send(e)
  }
})

exports.tables = async(function* (req, res) {
  const userId = req.session.user._id
  if (req.method === 'GET') {
    let tables = yield Table.find({user: userId}).exec()
    res.json(tables)
  }
  else if (req.method === 'POST') {
    try {
      let body = req.body
      body.user = userId
      let table = new Table(req.body)

      yield table.save()

      let tables = yield Table.find({user: userId}).exec()

      res.json({
        success: 1,
        data: tables
      })
    } catch(e) {

      res.send(e)
    }
  }
  else if (req.method === 'DELETE') {
    let id = req.body._id

    try {
      yield Table.findByIdAndRemove(id).exec()
      let table = yield Table.find({user: req.session.user._id}).exec()

      res.json({
        success: 1,
        data: table
      })
    } catch(e) {
      console.log(e)
      res.send(e)
    }
  }
})

exports.user = async(function* (req, res) {
  if (req.method === 'GET') {
    let users = yield User.find().exec()
    console.log('users', users)
    res.json(users)
  }
})

exports.qiniu = async(function* (req, res) {
  try {
    let bucket = req.query.bucket
    let key = req.query.key
    let token = uptoken(bucket, key)
    console.log(token)
    res.json(token)
  } catch(e) {
    res.send(e)
  }
})

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key)
  return putPolicy.token()
}
