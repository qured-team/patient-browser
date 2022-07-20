"use strict";

const Path                 = require("path");
const Webpack              = require("webpack");
const Package              = require("./package.json");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin    = require('html-webpack-plugin');

const ENV  = process.env.NODE_ENV || "production";
const SRC  = Path.join(__dirname, "src");
const DST  = Path.join(__dirname, "build");
const PORT = process.env.PORT || 9001;
const HOST = process.env.HOST || "0.0.0.0";

let config = {

    context: SRC,

    devServer: {
        contentBase       : DST,
        hot               : true,
        quiet             : false,
        noInfo            : false,
        clientLogLevel    : "warning",
        publicPath: `http://${HOST}:${PORT}/js/`,
        host: HOST,
        port: PORT,
        watchOptions: {
            ignored: /node_modules/
        },
    },

    entry: {
        index : [
            Path.join(SRC, "index.js")
        ],
        "vendor": [
            "react",
            "react-dom",
            "jquery",
            "redux",
            "redux-actions",
            "react-redux",
            "redux-thunk",
            "react-router",
            "react-router-dom",
            "history",
            "moment"
        ]
    },

    output: {
        filename  : "[name].js",
        path      : `${DST}/js/`,
        publicPath: "/js/",
        sourceMapFilename: "[file].[hash].map"
    },

    module: {
        rules: [
            {
                test   : /\.less$/,
                include: [ SRC ],
                use: [
                    "style-loader?singleton",
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ]
            },
            {
                test   : /\.jsx?$/,
                include: [ SRC ],
                use    : [ "babel-loader" ]
            },
        ]
    },

    resolve : {
        extensions : [ ".js", ".jsx", ".less" ]
    },

    devtool: "#source-map",

    stats: {
        colors      : true,
        modules     : true,
        reasons     : true,
        errorDetails: true
    },

    plugins : [
        new Webpack.DefinePlugin({
            "process.env.NODE_ENV": "'" + ENV + "'",
            "__APP_VERSION__" : "'" + Package.version + "'"
        }),
        new Webpack.optimize.CommonsChunkPlugin({
            name     : "vendor",
            filename : "commons.js",
            minChunks: 2
        }),
        new HtmlWebpackPlugin({
            filename: DST + "/index.html",
            template: SRC + "/index.ejs",
            inject  : false,
            Webpack
        }),
        new Webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        })
    ]
}

module.exports = config;
