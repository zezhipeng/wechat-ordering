var express = require('express')
var router = express.Router()
var sha1 = require('sha1')

router.get('/hear', function(req, res) {
  var token = 'Ruarua2016'
  var signature = req.query.signature
  var nonce = req.query.nonce
  var timestamp = req.query.timestamp
  var echostr = req.query.echostr
  var str = [token, timestamp, nonce].sort().join('')
  var sha = sha1(str)
  console.log('Ruarua2016', sha)
  if (sha === signature) {
    res.send(echostr + '')
  }
})

router.post('/hear', function(req, res) {
  var token = 'Ruarua2016'
  var signature = req.body.signature
  var nonce = req.body.nonce
  var timestamp = req.body.timestamp
  var echostr = req.body.echostr
  var str = [token, timestamp, nonce].sort().join('')
  var sha = sha1(str)
  console.log('Ruarua2016:', sha)
  if (sha === signature) {
    res.send(echostr + '')
  }
})

module.exports = router
