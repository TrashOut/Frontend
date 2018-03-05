/**
 * TRASHOUT IS an environmental project that teaches people how to recycle
 * and showcases the worst way of handling waste - illegal dumping. All you need is a smart phone.
 *
 * FOR PROGRAMMERS: There are 10 types of programmers -
 * those who are helping TrashOut and those who are not. Clean up our code,
 * so we can clean up our planet. Get in touch with us: help@trashout.ngo
 *
 * Copyright 2017 TrashOut, n.f.
 *
 * This file is part of the TrashOut project.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * See the GNU General Public License for more details: <https://www.gnu.org/licenses/>.
 */
require('source-map-support/register');

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';
import autoprefixer from 'autoprefixer';
import config from '../src/server/config';
import constants from './constants';
import ip from 'ip';
import path from 'path';
import webpack from 'webpack';
import webpackIsomorphicAssets from './assets';
import UnusedFilesWebpackPlugin from 'unused-files-webpack-plugin';
import WebpackConcatPlugin from 'webpack-concat-plugin';

const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicAssets);

const devtools = 'cheap-module-eval-source-map';

const loaders = {
  css: [],
  scss: [{ loader: 'sass-loader' }],
  sass: [{ loader: 'sass-loader', options: { indentedSyntax: true } }],
};

const serverIp = config.remoteHotReload
  ? ip.address() // Dynamic IP address enables hot reload on remote devices.
  : 'localhost';

export default function makeConfig() {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const stylesLoaders = Object.keys(loaders).map(ext => {
    const extLoaders = [
      { loader: 'css-loader' },
      { loader: 'postcss-loader', options: { plugins: () => [autoprefixer({ browsers: 'last 2 version' })] } },
    ].concat(loaders[ext]);

    return {
      test: new RegExp(`\\.(${ext})$`),
      use: isDevelopment
        ? [{ loader: 'style-loader' }].concat(extLoaders)
        : ExtractTextPlugin.extract({ fallback: 'style-loader', use: extLoaders }),
    };
  });

  return {
    cache: isDevelopment,
    devtool: isDevelopment ? devtools : 'source-map',
    entry: {
      vendors: ['babel-polyfill', 'react', 'react-dom', 'material-ui', 'history', 'immutable', 'moment', 'radium', 'react-helmet', 'react-redux', 'react-router', 'react-router-dom', 'react-router-redux', 'redux', 'isomorphic-fetch', 'firebase', 'redux-form', '@google/maps', 'lodash', 'react-google-maps', 'react-dropzone', 'react-copy-to-clipboard', 'react-markdown', 'geolib', 'geomodel', 'intl', 'intl-locales-supported', 'intl-messageformat', 'intl-relativeformat', 'material-ui-country-flags', 'moment-timezone', 'react-tap-event-plugin'],
      app: isDevelopment ? [
        `webpack-hot-middleware/client?path=http://${serverIp}:${constants.HOT_RELOAD_PORT}/__webpack_hmr`,
        path.join(constants.SRC_DIR, 'browser/index.js'),
      ] : [
        path.join(constants.SRC_DIR, 'browser/index.js'),
      ],
    },
    module: {
      noParse: [/html2canvas/],
      rules: [
        {
          test: /\.(gif|jpg|png|svg|pdf)$/,
          loader: 'url-loader',
          options: { limit: 10000 },
        }, {
          test: /icons\.json$/,
          loader: 'json-loader',
        }, {
          test: /favicon\.ico$/,
          loader: 'url-loader',
          options: { limit: 1 },
        }, {
          test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
          loader: 'url-loader',
          options: { limit: 100000 },
        }, {
          test: /\.js$/,
          exclude: constants.NODE_MODULES_DIR,
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            presets: ['es2015', 'react', 'stage-1'],
            plugins: [
              'add-module-exports',
              'transform-decorators-legacy',
              ['transform-runtime', { polyfill: false, regenerator: false }],
            ],
            env: {
              development: {
                plugins: [
                  'react-hot-loader/babel',
                ],
              },
              production: {
                plugins: [
                  'transform-react-constant-elements',
                  'transform-react-inline-elements',
                  'transform-react-remove-prop-types',
                ],
              },
            },
          },
        },
        ...stylesLoaders,
      ],
    },
    output:
      isDevelopment
      ? {
        path: constants.BUILD_DIR,
        filename: '[name].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: `http://${serverIp}:${constants.HOT_RELOAD_PORT}/build/`,
      }
      : {
        path: constants.BUILD_DIR,
        filename: '[name]-[hash].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: '/assets/',
      },
    plugins: (() => {
      const plugins = [
        new webpack.DefinePlugin({
          'process.env': {
            IS_BROWSER: true, // Because webpack is used only for browser code.
            IS_SERVERLESS: JSON.stringify(process.env.IS_SERVERLESS || false),
            NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
            SERVER_URL: JSON.stringify(process.env.SERVER_URL || ''),
          },
        }),
        new WebpackConcatPlugin({
          uglify: true,
          useHash: false,
          sourceMap: true,
          name: 'widget',
          fileName: 'widget.js',
          filesToConcat: [
            'widget/vendor/fancybox/jquery.fancybox.pack.js',
            'widget/vendor/fancybox/helpers/jquery.fancybox-buttons.js',
            'widget/config/app.js',
            'widget/vendor/libs.js',
            'widget/vendor/markerclusterer.js',
            'widget/vendor/jquery.deserialize.js',
            'widget/vendor/jquery.parse.js',
            'widget/vendor/geomodel.js',
            'widget/vendor/i18n.js',
            'widget/widgets/i18n/main.js',
            'widget/widgets/trashmap.js',
          ].map(jsPath => path.join(constants.ASSETS_DIR, jsPath)),
        }),
      ];
      if (isDevelopment) {
        plugins.push(
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          new webpack.LoaderOptionsPlugin({
            minimize: !isDevelopment,
            debug: isDevelopment,
          }),
          webpackIsomorphicToolsPlugin.development(),
          new UnusedFilesWebpackPlugin({
            patterns: ['src/browser/**/*.{js,css}', 'src/common/**/*.{js,css}'],
          })
        );
      } else {
        plugins.push(
          new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /cs|de|en|es|sk|ru/),
          new ExtractTextPlugin({
            filename: 'app-[hash].css',
            allChunks: true,
          }),
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
              screw_ie8: true, // eslint-disable-line camelcase
              warnings: false, // Because uglify reports irrelevant warnings
            },
          }),
          new webpack.LoaderOptionsPlugin({
            minimize: true,
          }),
          new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
          }),
          new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors'],
            filename: '[name]-[hash].js',
          }),
          webpackIsomorphicToolsPlugin,
        );
      }
      return plugins;
    })(),
    resolve: {
      extensions: ['.js', '.json'],
      modules: [constants.SRC_DIR, constants.NODE_MODULES_DIR],
      alias: {
        react$: require.resolve(path.join(constants.NODE_MODULES_DIR, 'react')),
      },
    },
  };
}
