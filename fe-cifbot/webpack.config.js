const path = require('path');
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
    entry: './src/app/app.module.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, "src"),
        compress: true,
        port: 9000,
        publicPath: "/dist/",

    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            }

        ]
    },
    plugins: [
        new ngAnnotatePlugin({
            add: true,
            // other ng-annotate options here
        })
    ]
};