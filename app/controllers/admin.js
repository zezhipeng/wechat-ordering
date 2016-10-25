const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const User = mongoose.model('User');
const Ordering = mongoose.model('Ordering')
const client = require('../../config').client
const APIService = require('../../config/wx/service');


exports.index = async(function* (req, res) {
  respond(res, 'admin/index')
})
