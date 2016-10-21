'use strict'


var md5 = require('MD5')
var sha1 = require('sha1')
var request = require('request')
var _ = require('lodash')
var xml2js = require('xml2js')
var https = require('https')
var url_mod = require('url')


var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var builder = new xml2js.Builder()

var prefix = 'https://api.mch.weixin.qq.com/'

var signTypes = {
  MD5: md5,
  SHA1: sha1
}

var RETURN_CODES = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL'
}

var api = {
  unifiedorder: prefix + 'pay/unifiedorder',
  orderquery: prefix + 'pay/orderquery',
  refund: prefix + 'secapi/pay/refund',
  refundquery: prefix + 'pay/refundquery',
  download: prefix + 'pay/downloadbill',
  shorturl: prefix + 'tools/shorturl'
}

var Payment = function Payment(opts) {
  this.appID = opts.appID
  this.partnerKey = opts.partnerKey
  this.mchId = opts.mchId
  this.subMchId = opts.subMchId
  this.notifyUrl = opts.notifyUrl
  this.passphrase = opts.passphrase || opts.mchId
  this.pfx = opts.pfx

  this.defaultOptions = {
    appid: this.appID,
    mch_id: this.mchId,
    sub_mch_id: this.subMchId,
    nonce_str: this.nonceString(),
    notify_url: this.notifyUrl,
    op_user_id: this.mchId
  }
}

Payment.prototype.getPrePayment = function(order) {

  var self = this
  var defaultParams = {
    appID: this.appID,
    timeStamp: Date.now(),
    nonceStr: this.nonceString(),
    signType: 'MD5'
  }

  order = _.extend(this.defaultOptions, order)

  var options = this.sign(api.unifiedorder, order)
  var xml = this.buildXml(options)

  return new Promise(function(resolve, reject) {
    request({method: 'POST', url: api.unifiedorder, body: xml})
      .then(function(response) {
        var data = response[1]

        var params = _.extend(defaultParams, {
          package: 'prepay_id=' + data.prepay_id
        })

        if (options.trade_type === 'native') {
          params.code_url = data.code_url
        }

        params.paySign = self._getSign(params)

        resolve(params)
      })
  })
}

Payment.prototype._httpRequest = function(url, data, callback){
  request({
    url: url,
    method: "POST",
    body: data
  }, function (err, response, body) {
    if (err) {
      return callback(err)
    }

    callback(null, body)
  })
}

Payment.prototype._httpsRequest = function(url, data, callback){
  var parsed_url = url_mod.parse(url)
  var req = https.request({
      host: parsed_url.host,
      port: 443,
      path: parsed_url.path,
      pfx: this.pfx,
      passphrase: this.passphrase,
      method: 'POST'
  }, function(res) {
    var content = ''
    res.on('data', function(chunk) {
      content += chunk
    })
    res.on('end', function(){
      callback(null, content)
    })
  })

  req.on('error', function(e) {
    callback(e)
  })
  req.write(data)
  req.end()
}

Payment.prototype.sign = function(url, params) {
  params.sign = this._getSign(params)

  if (params.long_url) {
    params.long_url = encodeURIComponent(params.long_url)
  }

  for (var key in params){
    if (params[key] !== undefined && params[key] !== null){
      params[key] = params[key].toString()
    }
  }

  return params
}

Payment.prototype.unifiedOrder = function (params, callback) {
  var requiredData = ["body", "out_trade_no", "total_fee", "spbill_create_ip", "trade_type"]
  if(params.trade_type == "JSAPI"){
      requiredData.push("openid")
  }else if (params.trade_type == "NATIVE"){
      requiredData.push("product_id")
  }
  this.sign(api.unifiedorder, params, {
    required:requiredData
  }, callback)
}

Payment.prototype.orderQuery = function(params, callback){
  this.sign(URLS.ORDER_QUERY, params, {
    required: ["out_trade_no"]
  }, callback)
}

Payment.prototype.refund = function(params, callback){
  params = this._extendWithDefault(params, [
    'op_user_id'
  ])

  this.sign(URLS.REFUND, params, {
    https: true,
    required: ["out_trade_no", "out_refund_no", "total_fee", "refund_fee"]
  }, callback)
}

Payment.prototype.refundQuery = function(params, callback){
  this.sign(URLS.REFUND_QUERY, params, {}, callback)
}

Payment.prototype.downloadBill = function(params, callback){
  var self = this
  this.sign(URLS.DOWNLOAD_BILL, params, {
    required: ["bill_date", "bill_type"]
  }, function(err, rawData){
    if(err){
      if(err.name == "XMLParseError"){
        callback(null,self.parseCsv(rawData))
      }else{
        callback(err)
      }
    }
  })
}

Payment.prototype.shortUrl = function(params, callback){
  this.sign(URLS.SHORT_URL, params, {
    required: ['long_url']
  }, callback)
}

Payment.prototype.parseCsv = function(text){
  var rows = text.trim().split(/\r?\n/)

  function toArr(rows){
    var titles = rows[0].split(",")
    var bodys = rows.splice(1)
    var data = []

    bodys.forEach(function(row){
      var rowData = {}
      row.split(",").forEach(function(cell,i){
        rowData[titles[i]] = cell.split("`")[1]
      })
      data.push(rowData)
    })
    return data
  }

  return {
    list: toArr(rows.slice(0, rows.length - 2)),
    stat: toArr(rows.slice(rows.length - 2, rows.length))[0]
  }
}

Payment.prototype.buildXml = function (obj) {
  var xml = builder.buildObject({xml: obj})

  return xml
}

Payment.prototype.validate = function (xml, callback) {
  var self = this
  xml2js.parseString(xml, {
    trim: true,
    explicitArray: false
  }, function (err, json) {
    var error = null,
      data
    if (err) {
      error = new Error()
      err.name = "XMLParseError"
      return callback(err, xml)
    }

    data = json ? json.xml : {}

    if (data.return_code == RETURN_CODES.FAIL) {
      error = new Error(data.return_msg)
      error.name = "ProtocolError"
    } else if (data.result_code == RETURN_CODES.FAIL) {
      error = new Error(data.err_code)
      error.name = "BusinessError"
    } else if (self.appID !== data.appid) {
      error = new Error()
      error.name = "InvalidAppId"
    } else if (self.mchId !== data.mch_id) {
      error = new Error()
      error.name = "InvalidMchId"
    } else if (self.subMchId && self.subMchId !== data.sub_mch_id) {
      error = new Error()
      error.name = "InvalidSubMchId"
    } else if (self._getSign(data) !== data.sign) {
      error = new Error()
      error.name = "InvalidSignature"
    }

    callback(error, data)
  })
}

/**
 * 使用默认值扩展对象
 * @param  {Object} obj
 * @param  {Array} keysNeedExtend
 * @return {Object} extendedObject
 */
Payment.prototype._extendWithDefault = function (obj, keysNeedExtend) {
  var defaults = {
    appid: this.appID,
    mch_id: this.mchId,
    sub_mch_id: this.subMchId,
    nonce_str: this.nonceString(),
    notify_url: this.notifyUrl,
    op_user_id: this.mchId
  }
  var extendObject = {}
  keysNeedExtend.forEach(function (k) {
    if (defaults[k]) {
      extendObject[k] = defaults[k]
    }
  })
  return _.extend(extendObject, obj)
}

Payment.prototype._getSign = function (pkg, signType) {
  pkg = _.clone(pkg)
  delete pkg.sign
  signType = signType || "MD5"
  var string1 = this._toQueryString(pkg)
  var stringSignTemp = string1 + "&key=" + this.partnerKey
  var signValue = signTypes[signType](stringSignTemp).toUpperCase()
  return signValue
}

Payment.prototype._toQueryString = function (object) {
  return Object.keys(object).filter(function (key) {
    return object[key] !== undefined && object[key] !== ''
  }).sort().map(function (key) {
    return key + "=" + object[key]
  }).join("&")
}

Payment.prototype.nonceString = function (length) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var maxPos = chars.length
  var noceStr = ''
  var i

  for (i = 0; i < (length || 32); i++) {
    noceStr += chars.charAt(Math.floor(Math.random() * maxPos))
  }

  return noceStr
}

exports.Payment = Payment
