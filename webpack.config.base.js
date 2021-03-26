/**
 * Base webpack config used across other specific configs
 */

const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
const pkgDep = require('./package.json')
const sveltePreConfig = require('./svelte.config')

/** @type {webpack.Configuration} */
module.exports = {
  module: {
    rules: [
      {
        test: /\.(html|svelte)$/,
        // exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options : sveltePreConfig ,
        },
      },
      {
        test: /\.ts?$/,
        loaders: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  output: {
    path: path.join(__dirname, 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.ts', '.svelte'],
    modules: [path.join(__dirname, 'app'), 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      GRPC_TRACE: 'all',
      GRPC_VERBOSITY: 'DEBUG',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      PRODUCT_NAME: JSON.stringify(pkgDep.productName),
      COPYRIGHT: JSON.stringify(pkgDep.license),
      HOMEPAGE: JSON.stringify(pkgDep.homepage),
      DESCRIPTION: JSON.stringify(pkgDep.description),
      LICENSE: JSON.stringify(pkgDep.license),
      BUG_REPORT_URL: JSON.stringify(pkgDep.bugs.url),
      VERSION: JSON.stringify(pkgDep.version),
      __APP_DISPLAY_NAME: JSON.stringify(pkgDep.displayName),
      __REDCOLOR: 'red',
    }),
  ],
}
