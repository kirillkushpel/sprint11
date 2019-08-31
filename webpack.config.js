const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                      loader: MiniCssExtractPlugin.loader,
                      options: {
                        
                      }
                    },
                    {
                      loader: 'css-loader',
                      options: {importLoaders: 1},
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                        config: {
                          path: __dirname + '/postcss.config.js'
                        }
                      },
                    },
                  ],
            },
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/i,
                use: [
                        'file-loader?name=./images/[name].[ext]', 
                        {
                                loader: 'image-webpack-loader',
                                options: {
                                    
                                },
                        },
                ],
            },
            {
                test: /\.(eot|ttf|woff|woff2|otf)$/i,
                loader: 'file-loader?name=./vendor/[name].[ext]'
            },

        ]
    },
    plugins: [ 
        new MiniCssExtractPlugin({
                filename: 'style.[contenthash].css'
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new WebpackMd5Hash(),
        new CopyWebpackPlugin([
            {from:'src/images',to:'images'} 
        ]),
    ]
};