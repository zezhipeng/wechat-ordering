const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const client = require('../../config').client
const APIService = require('../../config/wx/service');
const sha1 = require('sha1')
const Promise = require('bluebird')

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
        const user = new User(cb)

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
