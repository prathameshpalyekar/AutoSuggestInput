var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['./src/main.jsx'],
    output: {
        path: path.resolve(__dirname),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [{
            test: /\.jsx$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /(node_modules|build)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['env']
              }
            }
        }]
    },
    externals: {
        'react': 'commonjs react'
    },
};