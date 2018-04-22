const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  output: {
    path: path.join(__dirname, "..", 'dist'),
    filename: '[name].[hash].js',
    publicPath: './'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: path.join(__dirname, ".."), verbose: true }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].[hash].js.map',
      exclude: ['vendor']
    }),
    /*new UglifyJSPlugin({
      sourceMap: true
    }),*/
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
