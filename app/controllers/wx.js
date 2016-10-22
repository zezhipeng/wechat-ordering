const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const client = require('../../config').client
const APIService = require('../../config/wx/service');

exports.hear = async(function* (req, res) {
  let token = 'Ruarua2016'
  let signature = req.query.signature || req.body.signature
  let nonce = req.query.nonce || req.body.nonce
  let timestamp = req.query.timestamp || req.body.timestamp
  let echostr = req.query.echostr || req.body.echostr
  let str = [token, timestamp, nonce].sort().join('')
  let sha = sha1(str)

  if (sha === signature) {
    res.send(echostr + '')
  }
})

exports.user = async(function* (req, res) {
  let code = req.query.code
  if (code) {
    client.getUserByCode(code, (err, cb) => {
      if (cb) {
        let openid = cb.openid
        let exitUser = User
          .findOne({openid: openid})
          .exec()

        if (exitUser) {
          req.session.user = exitUser
          res.redirect('/')
        } else {
          const user = new User(cb)

          try {
            user
            .save()
            .then(res => {
              req.session.user = user
              res.redirect('/')
            })
          } catch (e) {
            console.log(e)
          }
        }
      }
    })
  }
})

exports.signature = async(function* (req, res) {
  APIService
    .getSignature('http://' + req.hostname + req.originalUrl)
    .then(signature => {
      res.json(signature)
    })
})
