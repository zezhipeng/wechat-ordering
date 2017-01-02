'use strict';

/**
 * Expose
 */
const OAuth = require('wechat-oauth')
const client = new OAuth('wx33d67a99c493f926', 'fa0b9766fa75c7f7726f7382fb360b76')

module.exports = {
  client: client,
  port: 80,
  db: 'mongodb://localhost/noobjs_tt2'
};
