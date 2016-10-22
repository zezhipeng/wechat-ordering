const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const client = require('../../config').client
const APIService = require('../../config/wx/service');
const sha1 = require('sha1')

exports.hear = async(function* (req, res) {
  console.log(req.query)
  let token = 'Ruarua2016'
  let signature = req.query.signature
  let nonce = req.query.nonce
  let timestamp = req.query.timestamp
  let echostr = req.query.echostr
  let str = [token, timestamp, nonce].sort().join('')
  let sha = sha1(str)
  console.log(sha, signature)
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
