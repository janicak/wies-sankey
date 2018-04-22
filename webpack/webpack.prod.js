const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  output: {
    path: path.join(__dirname, "..", 'dist'),
    filename: '[name].[hash].js',
    publicPath: './'
  },
  plugins: [
    /*new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: ['vendor']
    }),*/
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
