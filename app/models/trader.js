'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
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
   phone: String,
   role: {
     type: Number,
     default: 0
   },
   tables: [
     {
       name: {
         type: String,
         unique: true
       },
       status: {
         type: String,
         default: '空闲'
       },
       updateAt: {
         type: Date,
         default: Date.now
       },
       size: Number
     }
   ],
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

mongoose.model('Trader', TraderSchema)
