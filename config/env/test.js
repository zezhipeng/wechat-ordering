'use strict';

/**
 * Expose
 */
const OAuth = require('wechat-oauth')
const client = new OAuth('wx3c3c10b371693534', 'e2bfdf4d83ff7a199cfea0bb052963e4')

module.exports = {
  client: client,
  port: 80,
  db: 'mongodb://zezhi:123123@localhost/canting'
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
//      { role: "readWrite", db: "test" }
//   ]
// }
// )
