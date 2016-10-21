'use strict'

// 解析 xml 模块我们使用一个叫做 xml2js 的模块，然后通过 bluebird 来包装一下
var xml2js = require('xml2js')
var _ = require('lodash')
var Promise = require('bluebird')
var crypto = require('crypto')
var tpl = require('./tpl')

exports.parseXMLAsync = function(xml) {
  return new Promise(function(resolve, reject) {
    xml2js.parseString(xml, {trim: true}, function(err, content) {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

/*
 * 将 xml2js 解析出来的对象转换成直接可访问的对象
 */
function formatMessage(result) {
  var message = {}

  if (typeof result === 'object') {
    var keys = Object.keys(result)

    for (var i = 0; i < keys.length; i++) {
      var item = result[keys[i]]
      var key = keys[i]

      if (!(item instanceof Array) || item.length === 0) {
        continue
      }
      if (item.length === 1) {
        var val = item[0]

        if (typeof val === 'object') {
          message[key] = formatMessage(val)
        }
        else {
          message[key] = (val || '').trim()
        }
      }
      else {
        message[key] = []

        for (var j = 0, k = item.length; j < k; j++) {
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }

  return message
}

exports.formatMessage = formatMessage

exports.tpl = function (content, message) {
  // 在 tpl 这个方法里面，拿到的参数我们再适当合理化操作一下，就可以套用模板引擎了，首先声明一个 info 对象来临时存储回复的内容
  var info = {}
  var type = 'text'
  var fromUsername = message.FromUserName
  var toUsername = message.ToUserName

  if (_.isArray(content)) {
    type = 'news'
  }

  content = content || ''
  type = content.type || type
  info.content = content
  info.createTime = new Date().getTime()
  info.msgType = type
  info.toUsername = fromUsername
  info.fromUsername = toUsername

  return tpl.compiled(info)

  // 到这里位置，这个中间件关于解析，回复，模板提取都已经抽象成雏形了，我们回到外层的业务逻辑里面，来写我们的回复策略。
}

var createNonceStr = function() {
  return Math.random().toString(36).substr(2, 15)
}

var createTimestamp = function() {
  return parseInt(new Date().getTime() / 1000, 0) + ''
}

var raw = function(args) {
  var keys = Object.keys(args)

  keys = keys.sort()

  var newArgs = {}

  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  var string = ''

  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }

  return string.substr(1)
}

/*!
 * 签名算法
 *
 * @param {String} nonceStr 生成签名的随机串
 * @param {String} jsapi_ticket 用于签名的jsapi_ticket
 * @param {String} timestamp 时间戳
 * @param {String} url 用于签名的url，注意必须与调用JSAPI时的页面URL完全一致
 */
var sign = function(nonceStr, jsapi_ticket, timestamp, url) {
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: nonceStr,
    timestamp: timestamp,
    url: url
  }
  var string = raw(ret)
  var shasum = crypto.createHash('sha1')

  shasum.update(string)

  return shasum.digest('hex')
}

exports.sign = function(ticket, url) {
  var noncestr = createNonceStr()
  var timestamp = createTimestamp()
  var signature = sign(noncestr, ticket, timestamp, url)

  return {
    noncestr: noncestr,
    timestamp: timestamp,
    signature: signature
  }
}
