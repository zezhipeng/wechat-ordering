'use strict'

var sha1 = require('sha1')
var getRawBody = require('raw-body')
var Wechat = require('./wechat')
var util = require('./util')

module.exports = function(opts, handler) {
  // 我们在传入这个中间件的时候，首先初始化这个 Wechat，获取到一个实例，后面使用
  var wechat = new Wechat(opts)

  return function *(next) {
    var token = opts.token
    var signature = this.query.signature
    var nonce = this.query.nonce
    var timestamp = this.query.timestamp
    var echostr = this.query.echostr
    var str = [token, timestamp, nonce].sort().join('')
    var sha = sha1(str)

    if (this.method === 'GET') {
      if (sha === signature) {
        this.body = echostr + ''
      }
      else {
        this.body = 'wrong'
      }
    }
    else if (this.method === 'POST') {
      if (sha !== signature) {
        this.body = 'wrong'

        return false
      }

      var data = yield getRawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      })
      var content = yield util.parseXMLAsync(data)
      var message = util.formatMessage(content.xml)


      // 我们把解析后的 message 挂载到 this 上面
      this.weixin = message

      // 然后接下来怎么办呢，我们其实已经处理完了解析微信消息，那么就应该把控制权交出去，交给外面的业务层，让它来决定这里如何对解析后的微信消息做分析和回复，于是我们就可以直接通过一个 yield 来暂停这里，同时走向外层逻辑，那么改变一下执行的上下文就好了，外面传入一个控制器吧，叫做 handler，通过 call 来改变这个上下文，把 next 作为参数也传递给 handler
      yield handler.call(this, next)

      // 再之后呢，请求和响应的流程会再返回到这里的，这也是 koa 中间件的典型特征，我们上节课程已经分析过了，那么此时，应该是外层的逻辑已经处理完毕了解析和回复，这里就应该真正的回复了，我们直接调用 wechat.reply 方法，同样是修改下 reply 所处的上下文， 当然了 wechat 实例是没有 reply 方法的，我们到构造函数里去实现一下。

      wechat.reply.call(this)
    }
  }
}
