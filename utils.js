var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// exports.assetsPath = function (_path) {
//   var assetsSubDirectory = process.env.NODE_ENV === 'production'
//     ? config.build.assetsSubDirectory
//     : config.dev.assetsSubDirectory
//   return path.posix.join(assetsSubDirectory, _path)
// }

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

    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
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

// module.exports = {
//   build: {
//     env: require('./prod.env'),
//     index: path.resolve(__dirname, '../dist/index.html'),
//     assetsRoot: path.resolve(__dirname, '../dist'),
//     assetsSubDirectory: 'static',
//     assetsPublicPath: '/',
//     productionSourceMap: true,
//     // Gzip off by default as many popular static hosts such as
//     // Surge or Netlify already gzip all static assets for you.
//     // Before setting to `true`, make sure to:
//     // npm install --save-dev compression-webpack-plugin
//     productionGzip: false,
//     productionGzipExtensions: ['js', 'css']
//   },
//   dev: {
//     env: require('./dev.env'),
//     port: 8080,
//     assetsSubDirectory: 'static',
//     assetsPublicPath: '/',
//     proxyTable: {},
//     // CSS Sourcemaps off by default because relative paths are "buggy"
//     // with this option, according to the CSS-Loader README
//     // (https://github.com/webpack/css-loader#sourcemaps)
//     // In our experience, they generally work as expected,
//     // just be aware of this issue when enabling this option.
//     cssSourceMap: false
//   }
// }
