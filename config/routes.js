'use strict';

/*
 * Module dependencies.
 */

const wx = require('../app/controllers/wx');
const orderings = require('../app/controllers/orderings');
const users = require('../app/controllers/users');
const articles = require('../app/controllers/articles');
const comments = require('../app/controllers/comments');
const tags = require('../app/controllers/tags');
const auth = require('./middlewares/authorization');
const client = require('./index').client
const sha1 = require('sha1')

/**
 * Route middlewares
 */

const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

const fail = {
  failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, passport) {
  const pauth = passport.authenticate.bind(passport);

  app.get('/wx/hear', wx.hear)
  app.get('/wx/user', wx.user)
  app.get('/wx/signature', wx.signature)

  app.use((req, res, next) => {
    if (!req.session.user) {
      let url = client.getAuthorizeURL(`${req.protocol}://${req.hostname}/wx/user`, 'STATE', 'snsapi_userinfo')
      res.redirect(url)
    } else {
      next()
    }
  })
  app.get('/', users.index);
  app.post('/orderings', orderings.create)

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  // app.post('/users', users.create);
  app.post('/users/session',
    pauth('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);
  app.get('/auth/facebook',
    pauth('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/facebook/callback', pauth('facebook', fail), users.authCallback);
  app.get('/auth/github', pauth('github', fail), users.signin);
  app.get('/auth/github/callback', pauth('github', fail), users.authCallback);
  app.get('/auth/twitter', pauth('twitter', fail), users.signin);
  app.get('/auth/twitter/callback', pauth('twitter', fail), users.authCallback);
  app.get('/auth/google',
    pauth('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin);
  app.get('/auth/google/callback', pauth('google', fail), users.authCallback);
  app.get('/auth/linkedin',
    pauth('linkedin', {
      failureRedirect: '/login',
      scope: [
        'r_emailaddress'
      ]
    }), users.signin);
  app.get('/auth/linkedin/callback', pauth('linkedin', fail), users.authCallback);

  app.param('userId', users.load);

  // article routes
  app.param('id', articles.load);
  app.get('/articles', articles.index);
  app.get('/articles/new', auth.requiresLogin, articles.new);
  app.post('/articles', auth.requiresLogin, articles.create);
  app.get('/articles/:id', articles.show);
  app.get('/articles/:id/edit', articleAuth, articles.edit);
  app.put('/articles/:id', articleAuth, articles.update);
  app.delete('/articles/:id', articleAuth, articles.destroy);

  // comment routes
  app.param('commentId', comments.load);
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
  app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

  // tag routes
  app.get('/tags/:tag', tags.index);


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};
