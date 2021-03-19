'use strict';

const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.config');

module.exports = merge(commonConfig, {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin()]
  }
});
