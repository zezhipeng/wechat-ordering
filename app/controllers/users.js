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
   let user = yield User.findOne({openid: 'ohie2vwWiN49QlqAsrQABcVXRvkA'}).exec()
   let trader = req.params.trader
   let table = req.params.table

   try {
     if (user.traders) {
       let exitTrader = user.traders.filter(i => {
         return i == trader
       })
       if (!exitTrader.length) {
         user.traders.push(trader)

         yield user.save()
       } else {
         user.traders = []
         user.traders.push(trader)

         yield user.save()
       }
     }
   } catch(e) {
     res.send(e)
   }

   req.session.table = table
   req.session.trader = trader
   req.session.user = user
   res.cookie('user', user)

   respond(res, 'users/index', {
     user: user
   })
 })

 exports.init = async(function* (req, res) {
   let _id = req.session.trader
   console.log(_id)
   try {
     let dishes = yield Dish.find({trader: _id}).exec()

     console.log('dishes', dishes)

     res.json(dishes)
   } catch(e) {
     res.send(e)
   }
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
