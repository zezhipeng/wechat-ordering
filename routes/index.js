var express = require('express')
var router = express.Router()
var OAuth = require('wechat-oauth')
var client = new OAuth('wx33d67a99c493f926', 'fa0b9766fa75c7f7726f7382fb360b76')
var sha1 = require('sha1')

// middleware specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })
// define the home page route
// router.get('*', (req, res, next) => {
//   if (req.session.userInfo) {
//     next()
//   } else {
//     var url = client.getAuthorizeURL(req.hostname, 'STATE', 'snsapi_userinfo')
//     res.redirect(url)
//   }
// })

router.get('/', function(req, res) {
  if (req.session.user) {
    res.redirect('/about')
  } else {
    var url = client.getAuthorizeURL(`${req.protocol}://${req.hostname}/about`, 'STATE', 'snsapi_userinfo')
    res.redirect(url)
  }
})
// define the about route
router.get('/about', function(req, res) {
  res.render('index')
  // var code = req.query.code
  //
  // if (req.session.user) {
  //   let user = req.session.user
  //
  //   res.render('index', {
  //     user: user
  //   })
  // }
  // else if (code) {
  //   client.getUserByCode(code, (err, cb) => {
  //     console.log('user>>>>>>>', cb)
  //     if (cb) {
  //       req.session.user = cb
  //     }
  //
  //     res.render('index', {
  //       user: req.session.user
  //     })
  //   })
  // }
})

router.get('/index', (req, res) => {
  res.render('index')
})

router.get('/wx/hear', function(req, res) {
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

router.post('/wx/hear', function(req, res) {
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
