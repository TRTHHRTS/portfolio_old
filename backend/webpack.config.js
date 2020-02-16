const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const publicPath = path.resolve(__dirname, "..", "build");
module.exports = {
    entry: {
        app: path.resolve(__dirname, "src", "ts", "app.ts")
    },
    output: {
        path: publicPath,
        filename: 'app.js'
    },
    target: 'node',
    node: {
        // Need this when working with express, otherwise the build fails
        // if you don't put this is, __dirname and __filename return blank or /
        __dirname: false,
        __filename: false
    },
    // Need this to avoid error when working with Express
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            {from: path.resolve(__dirname, "src", "locales"), to: path.resolve(publicPath, "locales")}
        ])
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, "tsconfig.json") })]
    }
};