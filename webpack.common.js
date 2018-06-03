const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        web: './src/client/js/chat.js',
        h5: './src/client/js/mobilechat.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'AiCi 艾希',
            filename: 'assets/anonymous.html',
            template: './src/client/template/anonymous.html',
            inject: 'body',
            chunks: ['web'],
        }),
        new HtmlWebpackPlugin({
            title: 'AiCi 艾希',
            filename: 'assets/mobileanonymous.html',
            template: './src/client/template/mobileanonymous.html',
            inject: 'body',
            chunks: ['h5']
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("styles.css"),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve('dist'),
        publicPath: '/anony/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include: path.resolve(__dirname, "src/client"),
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                  })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                include: path.resolve(__dirname, "src/client"),
                use: [
                    'file-loader'
                ]
            },
            {
                test: /.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, "src/client"),
                query: {
                    presets: ['@babel/react', '@babel/preset-env'],
                    plugins: ['@babel/proposal-class-properties']
                }
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader',
                include: path.resolve(__dirname, "src/client"),
            }
        ]
    }
}
