const path = require ('path');
//const ExtractTextPlugin = require ('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: "./main.js",
    output: {
        path: path.resolve(__dirname,'./dist'),
        filename: "bundle.js"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'css/index',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    }, 
    module: {
        rules: [
            // { 
            //     test: /\.css$/, 
            //     loaders:ExtractTextPlugin.extract({
            //         use:['css-loader'],
            //     }),          
            // }
            {
                test:/\.css$/,
                use: [
                    {
                        loader:MiniCssExtractPlugin.loader,
                        options:{
                            publicPath: '../'
                        }
                    },
                    "css-loader"
                ]
            }          
        ]
    },
    plugins:[
        // new ExtractTextPlugin({
        //     filename:'[name]_[contenthash:8].css'
        // })
        new MiniCssExtractPlugin({
            filename:"[name]_[contenthash:8].css"
        })        
    ]
};