const path = require('path')

const contentBase = path.resolve(__dirname, 'build')

module.exports = {
    entry: './client/index.js',
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.s?css$/, exclude: /node_modules/, loader: 'style!css!sass-loader' }
        ]
    },
    output: {
        path: contentBase,
        publicPath: '/assets/',
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase,
        host: '0.0.0.0'
    }
}

