'use strict';

/**
 * Expose
 */
const OAuth = require('wechat-oauth')
const client = new OAuth('wx3c3c10b371693534', 'e2bfdf4d83ff7a199cfea0bb052963e4')

module.exports = {
  client: client,
  port: 80,
  partnerKey: 'youcanyouupnocannobb1000NIAN1HUI',
  notifyUrl: 'http://jimdream.com/wx/n',
  db: 'mongodb://zezhipeng:123123@localhost/test',
  mchId: '1416397002',
  token: 'Ruarua2016',
  appSecret: 'e2bfdf4d83ff7a199cfea0bb052963e4',
  appId: 'wx3c3c10b371693534'
};


// db.createUser({user: "zezhipeng", pwd: "123123", roles: [ { role: "userAdminAnyDatabase", db: "admin" }]})
//
// db.createUser(
//  {
//    user: "zezhi",
//    pwd: "123123",
//    roles: [
//       { role: "readWrite", db: "canting" }
//    ]
//  }
// )
//
//
// db.createUser(
// {
//   user: "zezhipeng",
//   pwd: "123123",
//   roles: [
//      { role: "readWrite", db: "canting" },
//      { role: "readWrite", db: "test" }
//   ]
// }
// )
