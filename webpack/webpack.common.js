const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry:  {
    main: path.join(__dirname, "..", "src"),
  },
  resolve: {
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      // Not necessary unless you consume a module using `createClass`
      'create-react-class': 'preact-compat/lib/create-react-class'
    }
  },
  plugins: [
    //new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      links: [],
      title: 'WIES Sankey'
    }),
    new ExtractTextPlugin({filename: "styles.css"})
  ],
  optimization: {
      splitChunks: {
          cacheGroups: {
              commons: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'vendor',
                  chunks: 'all'
              }
          }
      }
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['extracted-loader'].concat(ExtractTextPlugin.extract({
          use: [
            "babel-loader",
            {
              loader: 'css-loader',
              options: {
                url: true,
                minimize: process.env.NODE_ENV !== 'development',
                sourceMap: process.env.NODE_ENV === 'development',
                importLoaders: 2
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: process.env.NODE_ENV === 'development'
              }
            }
          ]
        }))
      },
      {
          test: /^(?!.*\.{test,min}\.js$).*\.js$/,
          include: path.join(__dirname, "..", "src"),
          use: {
              loader: 'babel-loader'
          }
      },
      {
         test: /\.(csv|tsv)$/,
         use: [
           'csv-loader'
         ]
      },
      /*{
        test: /\.js$/,
        include: path.join(__dirname, "..", "src/node_modules"),
        loader: 'ify-loader'
      },*/
      {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader'
         ]
      }
    ]
  }
};
