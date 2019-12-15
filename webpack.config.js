const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const distPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'src');

module.exports = {

  entry: [
    './src/js/app.ts',
    './src/styles/app.scss',
  ],

  output: {
    path: distPath,
    filename: '[name].js',
    publicPath: process.env.WDS === 'true' ? '/' : ''
  },

  optimization: {
    // minimize: false
  },

  // devtool: 'inline-source-map',

  resolve: {
    enforceExtension: false,
    extensions: ['.ts', '.js'],
  },

  devServer: {
    contentBase: srcPath,
    watchContentBase: true,
    hot: true,
    inline: true,
    stats: 'errors-only',
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader'
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
      },
      {
        test: /\.(css|sass|scss)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CopyPlugin([
      { from: './src/favicon.ico', to: '' },
      { from: './src/.htaccess', to: '' }
    ]),
  ],

};