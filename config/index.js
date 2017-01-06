'use strict';

/**
 * Module dependencies.
 */

const path = require('path');
const extend = require('util')._extend;

const development = require('./env/development');
const test = require('./env/test');
const production = require('./env/production');
const env = process.env.NODE_ENV || 'development';

const notifier = {
  service: 'postmark',
  APN: false,
  email: true, // true
  actions: ['comment'],
  tplPath: path.join(__dirname, '..', 'app/mailer/templates'),
  key: 'POSTMARK_KEY'
};

const defaults = {
  root: path.join(__dirname, '..'),
  notifier: notifier,
  app: {
    root: path.normalize(path.join(__dirname, '/..')),
    env: env
  },
  build: {
    env: require('./prod.env'),
    assetsPublicPath: 'public',
    assetsRoot: path.join(__dirname, '../'),
    productionSourceMap: true,
    assetsSubDirectory: 'public/dist/',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    assetsPublicPath: 'public',
    cssSourceMap: false,
    assetsSubDirectory: 'public/'
  }
};

/**
 * Expose
 */

module.exports = {
  development: extend(development, defaults),
  test: extend(test, defaults),
  production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];
