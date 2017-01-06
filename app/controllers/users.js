 'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const client = require('../../config').client
const APIService = require('../../config/wx/service');
const Dish = mongoose.model('Dish')
const Trader = mongoose.model('Trader')
const Order = mongoose.model('Order')
const _ = require('lodash')

const api = {
  trader: Trader,
  dishes: Dish,
  orderings: Order
}
/**
 * Load
 */
exports.load = async(function* (req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield User.load({ criteria });
    if (!req.profile) return next(new Error('User not found'));
  } catch (err) {
    return next(err);
  }
  next();
});

exports.file = async(function* (req, res) {
  console.log(req.query)
  res.json(req.query)
})

 exports.index = async(function* (req, res) {
   var user = req.session.user
   var trader = req.query.trader
   var table = req.query.table

   var trader = yield Trader.findById(trader).exec()

   if (!trader.online) {
      return res.send(404)
   }

   user = yield User.findById(user._id).exec()

   let exitTrader = _.find(user.traders, trader)
   console.log('exitTrader', exitTrader)
   if (exitTrader === -1) {
     user.traders.push(trader)

     yield user.save()
   }

   user = yield User.findById(user._id).populate('coupon order traders').exec()

   req.session.table = table
   req.session.trader = trader
   req.session.user = user
   res.cookie('user', user)

   respond(res, 'users/index', {
     user: user,
     table: table,
     page: 'user/main'
   })
 })

 exports.indexDev = async(function* (req, res) {
   let openid = req.query.openid || 'ohie2v--jSQ2sX2FjzSTmh8qvI-8'
   let user = yield User.findOne({openid: openid}).populate('coupon order traders').exec()
   let trader = req.query.trader
   let table = req.query.table

   user = yield User.findById(user._id).exec()

   let exitTrader = user.traders.indexOf(trader)

   if (exitTrader === -1) {
     user.traders.push(trader)

     yield user.save()
   }

   user = yield User.findById(user._id).populate('coupon order traders').exec()

   req.session.table = table
   req.session.trader = trader
   req.session.user = user
   res.cookie('user', user)

   respond(res, 'users/index', {
     user: user,
     table: table,
     page: 'user/main'
   })
 })

 exports.init = async(function* (req, res) {
   let _id = req.session.trader

   try {
     let user = yield User.findById(req.session.user._id).populate('coupon order traders').exec()
     let dishes = yield Dish.find({trader: _id, online: true}).exec()
     let trader = yield Trader.findById(_id).exec()
     let myOrder = yield Order.find({user: req.session.user._id}).sort('-meta.createdAt').populate({path: 'trader', select: 'name'}).exec()

     res.json({
       dishes: dishes,
       myOrder: myOrder,
       user: user,
       trader: trader
     })
   } catch(e) {
     res.send(e)
   }
 })

 exports.myOrder = async(function* (req, res) {
   let myOrder = yield Order.find({user: req.session.user._id}).sort('-meta.createdAt').populate({path: 'trader', select: 'name'}).exec()
   res.json(myOrder)
 })
 /**
  * Create user
  */

// exports.create = async(function* (req, res) {
//   const user = new User(req.body);
//   user.provider = 'local';
//   try {
//     yield user.save();
//     req.logIn(user, err => {
//       if (err) req.flash('info', 'Sorry! We are not able to log you in!');
//       return res.redirect('/');
//     });
//   } catch (err) {
//     const errors = Object.keys(err.errors)
//       .map(field => err.errors[field].message);
//
//     res.render('users/signup', {
//       title: 'Sign up',
//       errors,
//       user
//     });
//   }
// });

/**
 *  Show profile
 */

exports.show = function (req, res) {
  const user = req.profile;
  respond(res, 'users/show', {
    title: user.name,
    user: user
  });
};

exports.toggleLike = async(function* (req, res) {
  const dish = req.body.dish
  const user = req.body.user
  const trader = req.session.trader
  console.log(req.body)
  var _dish = yield Dish.findById(dish).exec()

  if (req.body.operator === 'add') {
    _dish.like.push(user)
  } else {
    _dish.like = _.remove(_dish.like, user)
  }
  yield _dish.save()

  let dishes = yield Dish.find({trader: trader, online: true}).exec()


  res.json(dishes)

})

exports.signin = function () {};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
  console.log(req.session)
  res.render('users/login', {
    title: 'Login'
  });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * Login
 */

function login (req, res) {
  const redirectTo = req.session.returnTo
    ? req.session.returnTo
    : '/';
  delete req.session.returnTo;
  res.redirect(redirectTo);
}
