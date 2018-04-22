const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  devServer: {
    contentBase: path.join(__dirname, "..", "dist"),
    inline: true,
    hot: true
  },
  output: {
    path: path.join(__dirname, "..", 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: ['vendor']
    })
  ]
});
