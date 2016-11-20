const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const client = require('../../config').client
const APIService = require('../../config/wx/service');
const sha1 = require('sha1')
console.log(client)
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

  if (sha === signature) {
    res.send(echostr + '')
  }
})

exports.user = async(function* (req, res) {
  const code = req.query.code || req.body.code

  if (code) {
    client.getUserByCode(code, (err, cb) => {
      if (cb) {
        let openid = cb.openid
        let exitUser = User
          .findOne({openid: openid})
          .exec()

        if (exitUser) {
          req.session.user = exitUser
          res.redirect(`/index/${req.session.trader}/${req.session.table}`)
        } else {
          const user = new User(cb)

          try {
            user
            .save()
            .then(res => {
              req.session.user = user
              res.redirect(`/index/${req.session.trader}/${req.session.table}`)
            })
          } catch (e) {
            console.log(e)
          }
        }
      }
    })
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
