var webpack = require('webpack'),
  path = require('path');

var  APP = __dirname;
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  devtool: 'source-map',
  context: APP,
  entry: {
    app: __dirname + "/webpack-config/all.js",
    vendors:  __dirname + "/webpack-config/app.vendors.js"
  },
  output: {
    path: APP,
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: [ /node_nodules/, /pdfmake.min.js$/ ], loader: 'babel-loader'},
      {test: /\.html/,exclude: /node-modules/,loader: "raw" },
      { test: /\.scss$/, loader: 'style!css!sass' },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
  htmlLoader: {
    ignoreCustomFragments: [/\{\{.*?}}/]
  },
  resolve: {
    extensions: ["", ".js"]
  },

  plugins: [
    new ProgressBarPlugin(),
    new webpack.optimize.DedupePlugin()


    // Disallow this part is slow too much
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     }
    // })
  ],
};