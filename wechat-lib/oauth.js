'use strict'

var Promise = require('bluebird')
var request = Promise.promisify(require('request'))

var prefix = 'https://api.weixin.qq.com/sns/'
var api = {
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
  accessToken: prefix + 'oauth2/access_token?',
  refreshToken: prefix + 'oauth2/refresh_token?',
  info: prefix + 'userinfo?',
  check: prefix + 'auth?'
}

// 首先我们弄出来个构造函数，用来生成实例，在这个实例生成的时候，我们做一些初始化工作，同时我们假设服务器上有一个文件存储了老的旧的 票据和过期信息，ok, 我们首先读一下这个文件，判断是否票据过期，如果过期，我们重新向微信服务器获取一次一次，并且把新的票据信息写入到实例中，也写入到这个文件中，这个过程跟之前的基础功能的全局票据是一样的

// 同样，这里有两个点要考虑下，就是票据的读出和写入，这个在被外部引用时候，应该是一个实例，所有的实例共享这一份读出和写入的方法，恩，不罗嗦了，我们上代码吧。

function Oauth(opts) {
  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken
}

Oauth.prototype.isWeixin = function(ua) {
  if (!ua) return false

  ua = ua.toLowerCase()

  return (/micromessenger/.test(ua)) ? true : false
}


Oauth.prototype.fetchAccessToken = function(code, isBase) {
  var that = this

  return this
    .getAccessToken()
    .then(function(data) {
      try {
        data = JSON.parse(data)
      }
      catch (e) {
        return that.requestAccessToken(code)
      }

      if (!data || !data.access_token) {
        return that.requestAccessToken(code)
      }

      if (isBase) {
        return that.requestAccessToken(code)
      }

      if (that.isValidAccessToken(data)) {
        return Promise.resolve(data)
      }
      else {
        return that.refreshAccessToken(data)
      }
    })
    .then(function(data) {
      var _data = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
      }

      that.saveAccessToken(_data)

      return Promise.resolve(data)
    })
}

Oauth.prototype.isValidAccessToken = function(data) {
  if (!data || !data.access_token || !data.expires_in) {
    return false
  }

  var access_token = data.access_token
  var expires_in = data.expires_in
  var now = (new Date().getTime())

  if (data && access_token && now < expires_in) {
    return true
  }
  else {
    return false
  }
}

Oauth.prototype.requestAccessToken = function(code) {
  var appID = this.appID
  var appSecret = this.appSecret

  var url = api.accessToken + 'appid=' + appID + '&secret=' + appSecret + '&code=' + code + '&grant_type=authorization_code'

  return new Promise(function(resolve, reject) {
    request({url: url, json: true}).then(function(response) {
      var data = response[1]
      var now = (new Date().getTime())
      // 提前 20 秒刷新票据
      var expires_in = now + (data.expires_in - 20) * 1000

      if (data) {
        data.expires_in = expires_in
        resolve(data)
      }
      else {
        reject({successs: 0})
      }
    })
  })
}

Oauth.prototype.refreshAccessToken = function(data) {
  var appID = this.appID
  var refresh_token = data.refresh_token

  return new Promise(function(resolve, reject) {
    var url = api.refreshToken + 'appid=' + appID + '&refresh_token=' + refresh_token + '&grant_type=refresh_token'

    request({method: 'GET', url: url, json: true})
      .then(function(response) {
        var result = response[1]

        resolve(result)
      })
  })
}

Oauth.prototype.getAuthorizeURL = function(scope, redirect, state) {
  scope = scope || 'snsapi_base'

  var url = api.authorize + 'appid=' + this.appID + '&redirect_uri=' + encodeURIComponent(redirect) + '&response_type=code' + '&scope=' + scope + '&state=' + state + '#wechat_redirect'

  return url
}

Oauth.prototype.getUser = function(accessToken, openId, lang) {
  lang = lang || 'zh_CN'

  var url = api.info + 'access_token=' + accessToken + '&openid=' + openId + '&lang=' + lang

  return new Promise(function(resolve, reject) {
    request({method: 'GET', url: url, json: true})
      .then(function(response) {
        var result = response[1]

        resolve(result)
      })
  })
}

Oauth.prototype.checkAccessToken = function(accessToken, openId) {
  var url = api.check + 'access_token=' + accessToken + '&openid=' + openId

  return new Promise(function(resolve, reject) {
    request({method: 'GET', url: url, json: true})
      .then(function(response) {
        var result = response[1]

        resolve(result)
      })
  })
}

module.exports = Oauth
