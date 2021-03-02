'use strict';

const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin-next');

const isWindows = process.platform.startsWith('win');
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

module.exports = {
  mode: 'development',
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: {
        scripts: [`${npmCommand} run open`],
        parallel: true
      }
    }),
  ],
  entry: {
    app: [path.resolve(__dirname, '../src/client/index.jsx'), path.resolve(__dirname, '../src/client/style.scss')]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  devServer: {
    stats: 'minimal',
    port: 7878,
    publicPath: '/',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
};
