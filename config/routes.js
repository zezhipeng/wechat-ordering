'use strict';

/*
 * Module dependencies.
 */
const express = require('express');

const wx = require('../app/controllers/wx');
const orderings = require('../app/controllers/orderings');
const users = require('../app/controllers/users');
const admin = require('../app/controllers/admin');
const articles = require('../app/controllers/articles');
const comments = require('../app/controllers/comments');
const tags = require('../app/controllers/tags');
const auth = require('./middlewares/authorization');
const client = require('./index').client
const sha1 = require('sha1')
const superAdmin = require('../app/controllers/superadmin');
const path = require('path')
const fs = require('fs')
const config = require('./index')
const mongoose = require('mongoose');

const { wrap: async } = require('co');


const Order = mongoose.model('Order')

/**
 * Route middlewares
 */

// const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
// const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

const fail = {
  failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app) {
  // const pauth = passport.authenticate.bind(passport);

  var middleware = require('wechat-pay').middleware;
  var initConfig = {
    partnerKey: config.partnerKey || "youcanyouupnocannobb1000NIAN1HUI",
    appId: config.appId || "wx3c3c10b371693534",
    mchId: config.mchId || "1416397002",
    notifyUrl: config.notifyUrl || "http://jimdream.com/wx/n",
    pfx: fs.readFileSync(path.join(__dirname, '../libs/apiclient_cert.p12'))
  }

  app.use('/wx/n', middleware(initConfig).getNotify().done(async(function* (message, req, res, next) {
    var openid = message.openid;
    console.log(message)
    var orderId = message.out_trade_no;

    var order = yield Order.findById(orderId).exec()

    order.wechatPay = true
    order.save()

    var attach = {};
    try{

     attach = JSON.parse(message.attach);
     console.log(attach)
    } catch(e) {
      console.log(e)
    }

    /**
     * 查询订单，在自己系统里把订单标为已处理
     * 如果订单之前已经处理过了直接返回成功
     */
    res.reply('success');

    /**
     * 有错误返回错误，不然微信会在一段时间里以一定频次请求你
     * res.reply(new Error('...'))
     */
  })))

  app.get('/', function(req, res) {
    res.render('index.jade')
  })
  // app.get('/MP_verify_VDLFB3pRjsknjBYk.txt', function(req, res) {
  //   res.sendFile(path.join(__dirname, '../libs/MP_verify_VDLFB3pRjsknjBYk.txt'))
  // })

  app.get('/superAdmin', superAdmin.index)
  app.get('/superAdminLogin', superAdmin.superAdminLogin)
  app.put('/superAdmin', superAdmin.update)
  app.put('/superAdminTo', superAdmin.updateTo)
  app.post('/superAdminSignIn', superAdmin.superAdminSignIn)

  app.get('/superAdminDelete', superAdmin.delete)

  // 微信接口
  app.get('/wx/hear', wx.hear)
  app.post('/wx/hear', wx.hear)
  app.get('/wx/user', wx.user)
  app.get('/wx/signature', wx.signature)
  app.get('/wx/pay', wx.pay)

  // app.all('*', )
  // 用户接口
  // app.get('/', (req, res, next) => {
  //   // if (!req.session.user) {
  //   //   let url = client.getAuthorizeURL(`${req.protocol}://${req.hostname}/wx/user`, 'STATE', 'snsapi_userinfo')
  //   //   res.redirect(url)
  //   // } else {
  //   //   next()
  //   // }
  //   next()
  // }, users.index);
  app.post('/orderings', orderings.create)
  app.put('/orderings/:_id', orderings.edit)
  app.delete('/orderings/:_id', orderings.del)
  app.get('/orderings/:_id', orderings.get)
  app.get('/orderings', orderings.getAll)

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.get('/user/init', users.init);
  app.get('/myOrder', users.myOrder)
  app.put('/toggleLike', users.toggleLike)


  if (process.env.NODE_ENV === 'test') {
    app.get('/index', (req, res, next) => {
      if (!req.session.user || !req.session.user._id) {
        req.session.trader = req.query.trader
        req.session.table = req.query.table
        let port = process.env.PORT
        let url = client.getAuthorizeURL(`${req.protocol}://${req.hostname}/wx/user`, 'STATE', 'snsapi_userinfo')
        res.redirect(url)

      } else {
        next()
      }
    }, users.index)
  } else {
    app.get('/index', users.indexDev)
  }

  // app.get('/api/model/:model', users.init)



  // 管理员
  app.get('/api/qiniu', admin.qiniu)
  app.get('/api/init', admin.init)
  app.get('/api/reflash/:model', admin.reflash)
  app.put('/api/model/:model', admin.update)
  app.post('/api/model/:model', admin.create)
  app.delete('/api/model/:model', admin.delete)
  app.put('/api/updateOrder', admin.updateOrder)

  app.get('/excelExport', admin.excelExport)
  app.post('/excelExport', admin.excelExport)
  app.post('/admin/login', admin.login)
  app.post('/admin/signUp', admin.signUp)
  app.get('/admin/signout', admin.signout)
  app.put('/api/update', admin.update)
  app.get('/admin', admin.index)

  app.all('/api/tables', admin.tables)
  app.all('/api/tables/:_id', admin.tables)
  app.all('/api/user', admin.user)
  // app.post('/users', users.create);
  // app.post('/users/session',
  //   pauth('local', {
  //     failureRedirect: '/login',
  //     failureFlash: 'Invalid email or password.'
  //   }), users.session);
  // app.get('/users/:userId', users.show);
  // app.get('/auth/facebook',
  //   pauth('facebook', {
  //     scope: [ 'email', 'user_about_me'],
  //     failureRedirect: '/login'
  //   }), users.signin);
  // app.get('/auth/facebook/callback', pauth('facebook', fail), users.authCallback);
  // app.get('/auth/github', pauth('github', fail), users.signin);
  // app.get('/auth/github/callback', pauth('github', fail), users.authCallback);
  // app.get('/auth/twitter', pauth('twitter', fail), users.signin);
  // app.get('/auth/twitter/callback', pauth('twitter', fail), users.authCallback);
  // app.get('/auth/google',
  //   pauth('google', {
  //     failureRedirect: '/login',
  //     scope: [
  //       'https://www.googleapis.com/auth/userinfo.profile',
  //       'https://www.googleapis.com/auth/userinfo.email'
  //     ]
  //   }), users.signin);
  // app.get('/auth/google/callback', pauth('google', fail), users.authCallback);
  // app.get('/auth/linkedin',
  //   pauth('linkedin', {
  //     failureRedirect: '/login',
  //     scope: [
  //       'r_emailaddress'
  //     ]
  //   }), users.signin);
  // app.get('/auth/linkedin/callback', pauth('linkedin', fail), users.authCallback);
  //
  // app.param('userId', users.load);
  //
  // // article routes
  // app.param('id', articles.load);
  // app.get('/articles', articles.index);
  // app.get('/articles/new', auth.requiresLogin, articles.new);
  // app.post('/articles', auth.requiresLogin, articles.create);
  // app.get('/articles/:id', articles.show);
  // app.get('/articles/:id/edit', articleAuth, articles.edit);
  // app.put('/articles/:id', articleAuth, articles.update);
  // app.delete('/articles/:id', articleAuth, articles.destroy);
  //
  // // comment routes
  // app.param('commentId', comments.load);
  // app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
  // app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
  // app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);
  //
  // // tag routes
  // app.get('/tags/:tag', tags.index);


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};
