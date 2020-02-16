const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VueLoaderOptionPlugin = require('vue-loader-options-plugin');

const publicPath = path.resolve(__dirname, "..", "build", "public");

module.exports = {
    entry: {
        app: path.resolve(__dirname, "src", "js", "index.js")
    },
    output: {
        path: publicPath,
        filename: "app.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules|/,
                loader: "babel-loader"
            },
            {
                test: /\.(scss|css)$/,
                loader: 'vue-style-loader!css-loader!sass-loader'
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        js: 'babel-loader'
                    }
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|woff|svg)$/,
                use: [{loader: 'file-loader', options: {name: "static/[hash].[ext]"}}]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new VueLoaderOptionPlugin(),
        new webpack.ProvidePlugin({
            _: 'lodash/lodash.js'
        }),
        new CopyPlugin([
            {from: path.resolve(__dirname, "src", "index.html"), to: path.resolve(publicPath, "index.html")},
            {from: path.resolve(__dirname, "src", "favicon.ico"), to: path.resolve(publicPath, "favicon.ico")}
        ])
    ]
};