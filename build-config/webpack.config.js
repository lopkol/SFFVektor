'use strict';

const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin-next');

module.exports = {
  mode: 'development',
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: {
        scripts: ['npm run start-server', 'npm run open'],
        parallel: true
      }
    }),
  ],
  entry: {
    app: path.resolve(__dirname, '../src/client/index.jsx')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
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
