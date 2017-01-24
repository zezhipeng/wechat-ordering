var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var glob = require('glob')
var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
var env = process.env.NODE_ENV || 'development'

exports.entry = function() {
  var url = path.join(__dirname, '../components')
  // var files = glob.sync(path.join(url, '*.js'))

  if (env === 'development') {
    var report = {
      'user/main': [
        'eventsource-polyfill',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        `${url}/user/main`
      ],
      'admin/main': [
        'eventsource-polyfill',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        `${url}/admin/main`
      ]
    }
  } else {
    var report = {
      'user/main': [
        'eventsource-polyfill',
        `${url}/user/main`
      ],
      'admin/main': [
        'eventsource-polyfill',
        `${url}/admin/main`
      ]
    }
  }

  return report
}

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css', 'postcss']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'postcss', 'less']),
    sass: generateLoaders(['css', 'postcss','sass?indentedSyntax']),
    scss: generateLoaders(['css', 'postcss','sass']),
    stylus: generateLoaders(['css', 'postcss', 'stylus']),
    styl: generateLoaders(['css', 'postcss', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}
