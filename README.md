# wechat-ordering

> express

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
node app.js

# build for production with minification
npm run build
```

# order schema
```
{
  name: String,
  price: Number,
  src: String,
  thumb: Number,
  unit: String,
  class: String,
  recommend: {
    type: Boolean,
    default: true
  },
  vt: String,
  stars: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
}
```

# User
```
{
   role: {
     type: Number,
     default: 0
   },
   coupon: {
     type: Number,
     default: 0
   },
   member: {
     type: ObjectId,
     ref: 'Member'
   },
   message: [
    {
      text: String,
      time: Date,
      from: {
        type: Number,
        default: 0
      }
    }
   ],
   openid: String,
   nickname: String,
   sex: Number,
   province: String
   city: String,
   country: String,
   headimgurl: String,
	 privilege: Schema.Types.Mixed, //用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）
   unionid: String // 只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段。详见：获取用户个人信息（UnionID机制）
}
```
# Order
```
{
  number: Number,
  user:  {
    type: ObjectId,
    ref: 'User'
  },
  totalFee: {
    type: Number,
    default: 0
  },
  list: [
    {
      name: String,
      price: Number,
      status: {
        type: String,
        default: '未处理'
      }
    }
  ]，
  status: {
    type: String,
    default: '未处理'
  }
}
```

# Member

# Class
```
{
  name: String
}
```
