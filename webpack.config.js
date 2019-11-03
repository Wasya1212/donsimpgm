const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

require("babel-register");

const MODE = process.env.NODE_ENV || 'development';

const config = {
  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js',
  },

  module: {
    rules : [
      {
        test: /\.(jpe?g|png)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      hash: true
    }),
    new CopyWebpackPlugin([
      { from: 'src/img', to:'img' },
      { from: 'src/audio', to: 'audio' }
    ])
  ],

  optimization: MODE === 'development' ? {} : {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        extractComments: true,
      })
    ]
  },

  devServer: MODE === 'production' ? {} : {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    compress: false,
    port: 3000,
    index: `index.html`,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    inline: true
  },

  watch: MODE === 'production' ? false : true,
  devtool: 'source-map'
};

module.exports = config;
