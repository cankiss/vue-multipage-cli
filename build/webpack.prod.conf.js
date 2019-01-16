/**
 * production webpack config
 */

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('./config')
const utils = require('./utils')
const package_json = require('../package.json')

const prodWebpackConfig = {
    mode: 'production',
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[contenthash].js'),
    },
    module: {
        rules: [
            utils.generateBabelLoader({
                browsers: package_json.browserslist
            }),
            ...utils.generateStyleLoaders({
                sourceMap: config.build.sourceMap,
                extract: true
            })
        ]
    },
    performance: {
        maxEntrypointSize: 800000
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false
                    }
                },
                cache: true,
                parallel: true,
                sourceMap: config.build.sourceMap
            }),
            new OptimizeCSSAssetsPlugin()
        ],
        runtimeChunk: 'single',
        splitChunks: {
            name: false,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'chunk-vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.join(__dirname, '..'),
            verbose: false
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.build.assetsRoot,
            ignore: ['.*']
        }]),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),
        new webpack.HashedModuleIdsPlugin()
    ]
}

if (config.build.productionGzip) {
    const CompressionPlugin = require('compression-webpack-plugin')
    prodWebpackConfig.plugins.push(
        new CompressionPlugin({
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) { // 可视化分析包的尺寸
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    prodWebpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = merge(baseWebpackConfig, prodWebpackConfig)