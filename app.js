var http = require('http')
var express = require('express')
var routes = require('./routes')
var wx = require('./routes/wx')
var path = require('path')

var favicon = require('serve-favicon')
var logger = require('morgan')
var methodOverride = require('method-override')
var session = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var errorHandler = require('errorhandler')
// var OAuth = require('wechat-oauth')
// var client = new OAuth('wxc42b3b9b498bdfcc', 'b3e6b7de4956925782227ff0a5bde75c')

var app = express()

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
// app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(methodOverride())
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer())
app.use(express.static(path.join(__dirname, 'public')))

// app.use('/wx', wx)
app.use('/', routes)
// app.get('/users', user.list)
// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler())
}

var server = http.createServer(app)
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})
