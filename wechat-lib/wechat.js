'use strict'

var fs = require('fs')
var _ = require('lodash')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var util = require('./util')

var prefix = 'https://api.weixin.qq.com/cgi-bin/'
var mprefix = 'https://mp.weixin.qq.com/cgi-bin/'
var semanticAPI = 'https://api.weixin.qq.com/semantic/semproxy/search?'
var api = {
  accessToken: prefix + 'token?grant_type=client_credential',
  temporary: {
    upload: prefix + 'media/upload?',
    get: prefix + 'media/get?'
  },
  permanent: {
    upload: prefix + 'material/add_material?',
    uploadNews: prefix + 'material/add_news?',
    uploadNewsPic: prefix + 'media/uploadimg?',
    fetch: prefix + 'material/get_material?',
    del: prefix + 'material/del_material?',
    update: prefix + 'material/update_news?',
    count: prefix + 'material/get_materialcount?',
    list: prefix + 'material/batchget_material?'
  },
  group: {
    create: prefix + 'groups/create?',
    get: prefix + 'groups/get?',
    check: prefix + 'groups/getid?',
    update: prefix + 'groups/update?',
    move: prefix + 'groups/members/update?',
    batchupdate: prefix + 'groups/members/batchupdate?',
    del: prefix + 'groups/delete?'
  },
  user: {
    remark: prefix + 'user/info/updateremark?',
    get: prefix + 'user/info?',
    batchget: prefix + 'user/info/batchget?',
    list: prefix + 'user/get?'
  },
  mass: {
    sendAll: prefix + 'message/mass/sendall?',
    sendByOpenID: prefix + 'message/mass/send?',
    del: prefix + 'message/mass/delete?',
    check: prefix + 'message/mass/delete?'
  },
  menu: {
    create: prefix + 'menu/create?',
    get: prefix + 'menu/get?',
    del: prefix + 'menu/delete?'
  },
  qrcode: {
    create: prefix + 'qrcode/create?',
    show: mprefix + 'showqrcode?'
  },
  shorturl: {
    create: prefix + 'shorturl?'
  },
  ticket: {
    get: prefix + 'ticket/getticket?'
  }
}

// 首先我们弄出来个构造函数，用来生成实例，在这个实例生成的时候，我们做一些初始化工作，同时我们假设服务器上有一个文件存储了老的旧的 票据和过期信息，ok, 我们首先读一下这个文件，判断是否票据过期，如果过期，我们重新向微信服务器获取一次一次，并且把新的票据信息写入到实例中，也写入到这个文件中，过程简单吧。

// 所以，这里有两个点要考虑下，就是票据的读出和写入，因为此时这个 g.js 是一个中间件了，这个中间件只处理纯粹与微信交互的部分，而不应该干涉外面的业务逻辑，所以读取这个票据信息和写入票据信息，我们应该独立出来在业务层处理，恩，不罗嗦了，我们上代码吧。

function Wechat(opts) {
  var that = this

  this.appID = opts.appID
  this.appSecret = opts.appSecret
  this.getAccessToken = opts.getAccessToken
  this.saveAccessToken = opts.saveAccessToken
  this.getTicket = opts.getTicket
  this.saveTicket = opts.saveTicket

  this
    .fetchAccessToken()
    .then(function(data) {
      var access_token = data.access_token

      return that.fetchTicket(access_token)
    })
}

Wechat.prototype.fetchAccessToken = function() {
  var that = this

  return this
    .getAccessToken()
    .then(function(data) {
      try {
        data = JSON.parse(data)
      }
      catch (e) {
        return that.updateAccessToken(data)
      }

      if (that.isValidAccessToken(data)) {
        return Promise.resolve(data)
      }
      else {
        return that.updateAccessToken(data)
      }
    })
    .then(function(data) {
      that.access_token = data.access_token
      that.expires_in = data.expires_in
      that.saveAccessToken(data)

      return Promise.resolve(data)
    })
}

Wechat.prototype.fetchTicket = function(access_token) {
  var that = this

  return that
    .getTicket()
    .then(function(data) {
      try {
        data = JSON.parse(data)
      }
      catch (e) {
        return that.updateTicket(access_token)
      }

      if (that.isValidTicket(data)) {
        return Promise.resolve(data)
      }
      else {
        return that.updateTicket(access_token)
      }
    })
    .then(function(data) {
      that.ticket = data.ticket
      that.ticket_expires_in = data.expires_in
      that.saveTicket(data)

      return Promise.resolve(data)
    })
}

Wechat.prototype.isValidAccessToken = function(data) {
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

Wechat.prototype.isValidTicket = function(data) {
  if (!data || !data.ticket || !data.expires_in) {
    return false
  }

  var ticket = data.ticket_expires_in || data.ticket
  var expires_in = data.expires_in
  var now = (new Date().getTime())

  if (data && ticket && now < expires_in) {
    return true
  }
  else {
    return false
  }
}

Wechat.prototype.updateAccessToken = function() {
  var appID = this.appID
  var appSecret = this.appSecret
  var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret

  return new Promise(function(resolve, reject) {
    request({url: url, json: true}).then(function(response) {
      var data = response[1]
      var now = (new Date().getTime())
      // 提前 20 秒刷新票据
      var expires_in = now + (data.expires_in - 20) * 1000

      data.expires_in = expires_in
      resolve(data)
    })
  })
}


Wechat.prototype.updateTicket = function(access_token) {
  var url = api.ticket.get + 'access_token=' + access_token + '&type=jsapi'

  return new Promise(function(resolve, reject) {
    request({url: url, json: true})
      .then(function(response) {
        var data = response[1]
        var now = (new Date().getTime())
        // 提前 20 秒刷新票据
        var expires_in = now + (data.expires_in - 20) * 1000

        data.expires_in = expires_in
        resolve(data)
      })
  })
}

Wechat.prototype.sign = util.sign

Wechat.prototype.uploadMaterial = function(type, material, permanent) {
  var that = this
  var form = {}
  var uploadUrl = api.temporary.upload

  // 那我期望这里的 permanent 是一个对象，是一个空对象也可以，就说明是需要上传到永久素材，如果不传呢，默认是临时素材。
  if (permanent) {
    uploadUrl = api.permanent.upload

    // 这里通过了集成，实际上我们就已经兼容到了所有的类型，包括图文消息
    _.extend(form, permanent)
  }

  if (type === 'pic') {
    uploadUrl = api.permanent.uploadNewsPic
  }

  // 如果是图文类型，换成图文上传的地址，同时把图文的素材直接给到 form
  if (type === 'news') {
    uploadUrl = api.permanent.uploadNews
    form = material
  }
  // 否则，就读取这个路径的地址
  else {
    form.media = fs.createReadStream(material)
  }

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = uploadUrl + 'access_token=' + data.access_token

        if (!permanent) {
          url += '&type=' + type
        }
        else {
          form.access_token = data.access_token
        }

        var options = {method: 'POST', url: url, json: true}

        // 如果要 Post 图文数据，那么只需要把这个 JSON 话的对象字面量给到 body 就行
        if (type === 'news') {
          options.body = form
        }
        // 不然就是一个 multipart-data 数据，把 form 对象给到 formData
        else {
          options.formData = form
        }

        console.log(options)
        request(options)
          .then(function(response) {
            var _data = response[1]

            if (_data) {
              resolve(_data)
            }
            else {
              throw new Error('Upload fails')
            }
          })
          .catch(function(err) {
            reject(err)
          })
      })
  })
}

Wechat.prototype.fetchMaterial = function(mediaId) {
  var that = this
  var fetchUrl = api.permanent.fetch

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = fetchUrl + 'access_token=' + data.access_token
        var form = {
          media_id: mediaId,
          access_token: data.access_token
        }

        request({method: 'POST', url: url, body: form, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.deleteMaterial = function(mediaId) {
  var that = this
  var form = {
    media_id: mediaId
  }

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.permanent.del + 'access_token=' + data.access_token + '&media_id=' + mediaId

        request({method: 'POST', url: url, body: form, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.countMaterial = function() {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.permanent.count + '&access_token=' + data.access_token

        request({method: 'GET', url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.listMaterial = function(options) {
  var that = this

  options.type = options.type || 'image'
  options.offset = options.offset || 0
  options.count = options.count || 1

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.permanent.list + 'access_token=' + data.access_token

        console.log(options)

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.createGroup = function(name) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.group.create + 'access_token=' + data.access_token
        var options = {
          group: {
            name: name
          }
        }

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.getGroups = function() {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.group.get + 'access_token=' + data.access_token

        request({url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}


Wechat.prototype.checkGroup = function(openId) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.group.get + 'access_token=' + data.access_token
        var options = {
          openid: openId
        }

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.updateGroup = function(id, name) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.group.update + 'access_token=' + data.access_token
        var options = {
          group: {
            id: id,
            name: name
          }
        }

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.moveGroup = function(openId, to) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.group.move + 'access_token=' + data.access_token
        var options = {
          openid: openId,
          to_groupid: to
        }

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.batchMoveGroup = function(openIds, to) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.group.batchupdate + 'access_token=' + data.access_token
        var options = {
          openid_list: openIds,
          to_groupid: to
        }

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.deleteGroup = function(id) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.group.del + 'access_token=' + data.access_token
        var options = {
          group: {
            id: id
          }
        }

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.remarkUser = function(openId, remark) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.user.remark + 'access_token=' + data.access_token
        var options = {
          openid: openId,
          remark: remark
        }

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.getUser = function(openId, lang) {
  var that = this

  lang = lang || 'zh_CN'

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.user.get + 'access_token=' + data.access_token + '&openid=' + openId + '&lang=' + lang

        request({url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.batchGetUsers = function(openIds) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.user.batchget + 'access_token=' + data.access_token
        var options = {
          user_list: openIds
        }

        request({method: 'POST', url: url, body: options, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.listUsers = function(openId) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.user.list + 'access_token=' + data.access_token

        if (openId) {
          url += '&next_openid=' + openId
        }

        request({url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.sendAll = function(type, message, groupId) {
  var that = this
  var msg = {
    filter: {},
    msgtype: type
  }

  msg[type] = message

  if (!groupId) {
    msg.filter.is_to_all = true
  }
  else {
    msg.filter.is_to_all = false
    msg.filter.group_id = groupId
  }

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.mass.sendAll + 'access_token=' + data.access_token

        request({method: 'POST', url: url, body: msg, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.sendByOpenID = function(type, message, ids) {
  var that = this
  var msg = {
    msgtype: type
  }
  var url = api.mass.sendAll

  msg[type] = message

  // 如果这里是没有传 groupid, 那么默认是发给所有群组
  if (!ids) {
    msg.filter = {
      is_to_all: true
    }
  }
  // 如果传递进来的是一个数组，那么判定是发给部分用户，数组里的值都是 openid，不过这个必须是认证后的服务号才有的权限
  else if (_.isArray(ids)) {
    msg.touser = ids
    url = api.mass.sendByOpenID
  }
  // 如果 ids 不为空，那么判定是一个 groupid，发给特定的群组
  else {
    msg.filter = {
      is_to_all: false,
      group_id: ids
    }
  }

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        url += 'access_token=' + data.access_token

        request({method: 'POST', url: url, body: msg, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.deleteMass = function(msg_id) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.menu.del + 'access_token=' + data.access_token
        var body = {msg_id: msg_id}

        request({method: 'POST', url: url, body: body, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.checkMass = function(msg_id) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.menu.check + 'access_token=' + data.access_token
        var body = {msg_id: msg_id}

        request({method: 'POST', url: url, body: body, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.createMenu = function(menu) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.menu.create + 'access_token=' + data.access_token

        request({method: 'POST', url: url, body: menu, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.getMenu = function() {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.menu.get + 'access_token=' + data.access_token

        request({url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.deleteMenu = function() {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.menu.del + 'access_token=' + data.access_token

        request({url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

// 那么生成二维码有临时的和永久的，由传入的参数决定，也就是 action_name，expire_seconds 决定了有效期，最大是 7 天，action_info 是二维码详细信息，scene_id 和 scene_str 都是场景值 ID, 只是类型不同，前者是非零整型，后者是字符串，而且后者长度限制是 1 到 64，仅支持永久型。我在封装这个方法的时候，不对传入的参数做任何处理，有业务逻辑完全保证严格按照微信文档中的参数结构传进来，
// 有同学会好奇，我这里为什么不把这些参数再封装一下，为什么比如把临时的改成 temporary，永久的改成 Permanent，甚至是封装两套二维码方法，而不要传 QR_LIMIT_STR_SCENE 这么难记的参数名，这是因为我觉得业务逻辑在使用的时候，要尽量保证传参的正确性，而不应全部交给底层实现去做各种容错处理，并且考虑到如果哪一天官方这里的 api 有变动的时候，也有一定的健壮性，不过这里的确是可以对参数的类型和合法性做更多的校验，我就不再实现那么详细了。

Wechat.prototype.createQrcode = function(qr) {
  var that = this
  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.qrcode.create + 'access_token=' + data.access_token
        request({method: 'POST', body: qr, url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.showQrcode = function(ticket) {
  // 这里的 ticket 需要 encode

  return api.qrcode.show + 'ticket=' + encodeURI(ticket)
}

Wechat.prototype.createShorturl = function(qr) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = api.shorturl.create + 'access_token=' + data.access_token

        request({method: 'POST', url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}

Wechat.prototype.semantic = function(query) {
  var that = this

  return new Promise(function(resolve, reject) {
    that
      .fetchAccessToken()
      .then(function(data) {
        var url = semanticAPI + 'access_token=' + data.access_token

        query.appid = data.appID

        request({method: 'POST', body: query, url: url, json: true})
          .then(function(response) {
            var result = response[1]

            resolve(result)
          })
      })
  })
}


Wechat.prototype.reply = function() {
  // 由于 reply 所处的上下文已经被改变了，所以这里的 reply 就是当前的请求响应的的 context，我们已经在它之上存储了微信消息，以及外层业务的回复，那么这里自然就可以拿得到。
  var content = this.body
  var message = this.weixin

  // 把回复和消息作为参数传递给工具函数，让它生成我们需要的 XML 结构，然后就可以进行回复了
  // 当然了，这个 util 工具函数上是没有 tpl 方法的，我们还需要到 util 里面实现一下
  var xml = util.tpl(content, message)

  this.status = 200
  this.type = 'application/xml'
  this.body = xml
}

module.exports = Wechat
