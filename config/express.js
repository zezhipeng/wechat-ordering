'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const session = require('express-session');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const csrf = require('csurf');
const cors = require('cors');
const upload = require('multer')({ dest: 'uploads/' });
const mongoose = require('mongoose')
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const winston = require('winston');
const helpers = require('view-helpers');
const config = require('./');
const pkg = require('../package.json');
const multer = require('multer')
const path = require('path')
const webpack = require('webpack')

const env = process.env.NODE_ENV || 'development';
/**
 * Expose
 */

module.exports = function (app) {

  // Compression middleware (should be placed before express.static)
  app.use(compression({
    threshold: 512
  }))

  if (env === 'development') {
    require('shelljs/global')

    const assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
    const webpackConfig = process.env.NODE_ENV === 'production'
      ? require('../build/webpack.prod.conf')
      : require('../build/webpack.dev.conf')

    const compiler = webpack(webpackConfig)

    // rm('-rf', assetsPath)

    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      noInfo: false,
      stats: {
        colors: true,
        chunks: false
      }
    }))
    app.use(require('webpack-hot-middleware')(compiler, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000
    }))
  }
  // app.use(cors());

  // Static files middleware
  app.use(express.static(config.root + '/public'));

  // Use winston on production
  let log = 'dev';
  if (env !== 'development') {
    log = {
      stream: {
        write: message => winston.info(message)
      }
    };
  }

  // Don't log during tests
  // Logging middleware
  if (env !== 'test') app.use(morgan(log));

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  // expose package.json to views
  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });

  // bodyParser should be above methodOverride
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(multer())
  app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  // CookieParser should be above session
  // app.use(cookieParser());
  // app.use(cookieSession({ secret: 'secret' }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: pkg.name,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 7 * 24 * 60 * 60
    })
  }));

  // use passport session
  // app.use(passport.initialize());
  // app.use(passport.session());

  // connect flash for flash messages - should be declared after sessions
  // app.use(flash());

  // should be declared after session and flash
  app.use(helpers(pkg.name));

  // if (env !== 'test') {
  //   // app.use(csrf());
  //
  //   // This could be moved to view-helpers :-)
  //   app.use(function (req, res, next) {
  //     res.locals.csrf_token = req.csrfToken();
  //     next();
  //   });
  // }
  //
  // if (env === 'development') {
  //   app.locals.pretty = true;
  // }
};
