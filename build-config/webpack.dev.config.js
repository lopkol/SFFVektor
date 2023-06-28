'use strict';

const { merge } = require('webpack-merge');
const WebpackShellPlugin = require('webpack-shell-plugin-next');
const commonConfig = require('./webpack.common.config');

const isWindows = process.platform.startsWith('win');
const npmCommand = isWindows ? 'npm.cmd' : 'npm';

module.exports = merge(commonConfig, {
  mode: 'development',
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: {
        scripts: [`${npmCommand} run open`],
        parallel: true
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      }
    ]
  },
  devServer: {
    port: 7878,
    devMiddleware: {
      stats: 'minimal',
      publicPath: '/'
    },
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }
});
