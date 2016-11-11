var path = require('path')
var webpack = require('webpack')
var utils = require('./utils')

module.exports = {
  entry: {
    index: './src/main.js',
    admin: './src/admin.js',
    vendor: ['vue', 'vue-router', 'vuex', 'firebase', 'lru-cache', 'es6-promise']
  },
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/js/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.ProvidePlugin({
       $: "jquery",
       jQuery: "jquery"
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue',
        options: {
          postcss: [
            require('autoprefixer')({
              browsers: ['last 3 versions']
            })
          ]
        }
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/, // Only .css files
        loader: 'style!css' // Run both loaders
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=public/fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    alias: {
      vuex: path.resolve(__dirname, './build/src')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'client-vendor-bundle.js'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
