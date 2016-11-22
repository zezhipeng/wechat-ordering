'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
const crypto = require('crypto')
// const events = require('mongoose-socket.io-events')
const config = require('../../config')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

const TraderSchema = new Schema({
   name: {
     type: String,
     unique: true
   },
   password: {
     type: String
   },
   role: {
     type: Number,
     default: 0
   },
   tables: Mixed,
   classes: [
     {
       name: String,
     }
   ],
   users: [
     {
       type: ObjectId,
       ref: 'User'
     }
   ]
})

// const validatePresenceOf = value => value && value.length;

/**
 * Virtuals
 */

// TraderSchema
//   .virtual('password')
//   .set(function (password) {
//     this._password = password;
//     this.salt = this.makeSalt();
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

/**
 * Validations
 */

// the below 5 validations only apply if you are signing up traditionally

// TraderSchema.path('name').validate(function (name) {
//   if (this.skipValidation()) return true;
//   return name.length;
// }, 'Name cannot be blank');
//
// TraderSchema.path('email').validate(function (email) {
//   if (this.skipValidation()) return true;
//   return email.length;
// }, 'Email cannot be blank');
//
// TraderSchema.path('email').validate(function (email, fn) {
//   const Trader = mongoose.model('Trader');
//   if (this.skipValidation()) fn(true);
//
//   // Check only when it is a new user or when email field is modified
//   if (this.isNew || this.isModified('email')) {
//     Trader.find({ email: email }).exec(function (err, users) {
//       fn(!err && users.length === 0);
//     });
//   } else fn(true);
// }, 'Email already exists');
//
// TraderSchema.path('username').validate(function (username) {
//   if (this.skipValidation()) return true;
//   return username.length;
// }, 'Tradername cannot be blank');
//
// TraderSchema.path('hashed_password').validate(function (hashed_password) {
//   if (this.skipValidation()) return true;
//   return hashed_password.length && this._password.length;
// }, 'Password cannot be blank');


/**
 * Pre-save hook
 */

// TraderSchema.pre('save', function (next) {
//   if (global.socket) {
//     global.socket.emit('mongoose:save', this)
//   }
//
//   next()
// })

mongoose.model('Trader', TraderSchema);

/**
 * Methods
 */

// TraderSchema.methods = {
//
//   /**
//    * Authenticate - check if the passwords are the same
//    *
//    * @param {String} plainText
//    * @return {Boolean}
//    * @api public
//    */
//
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },
//
//   /**
//    * Make salt
//    *
//    * @return {String}
//    * @api public
//    */
//
//   makeSalt: function () {
//     return Math.round((new Date().valueOf() * Math.random())) + '';
//   },
//
//   /**
//    * Encrypt password
//    *
//    * @param {String} password
//    * @return {String}
//    * @api public
//    */
//
//   encryptPassword: function (password) {
//     if (!password) return '';
//     try {
//       return crypto
//         .createHmac('sha1', this.salt)
//         .update(password)
//         .digest('hex');
//     } catch (err) {
//       return '';
//     }
//   },
//
//   /**
//    * Validation is not required if using OAuth
//    */
//
//   skipValidation: function () {
//     return ~oAuthTypes.indexOf(this.provider);
//   }
// };
//
// /**
//  * Statics
//  */
//
// TraderSchema.statics = {
//
//   /**
//    * Load
//    *
//    * @param {Object} options
//    * @param {Function} cb
//    * @api private
//    */
//
//   load: function (options, cb) {
//     options.select = options.select || 'name username';
//     return this.findOne(options.criteria)
//       .select(options.select)
//       .exec(cb);
//   }
// };

// TraderSchema.use(events, {
//   port: config.port
// })
