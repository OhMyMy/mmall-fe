/*
* @Author: Administrator
* @Date:   2017-09-23 17:28:17
* @Last Modified by:   Administrator
* @Last Modified time: 2017-11-10 14:37:15
*/

var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

//单独打包css
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//环境变量的配置 dev / online(区分开发和线上环境)
var WEBPACK_ENV       = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);

// 获取HtmlWebpackPlugin参数的方法 生成多个html
var getHtmlConfig = function(name,title){
    return {
         //目标文件
        template : './src/view/'+ name + '.html',
        //生成的文件
        filename : 'view/'+ name + '.html',
        title : title,
        inject : true,
        hash : true,
        //thunk注入到页面
        chunks : ['common',name]
    }
}
var config = {
    entry: {
        'common' : ['./src/page/common/index.js'],
        'index' : ['./src/page/index/index.js'],
        'list' : ['./src/page/list/index.js'],
        'detail' : ['./src/page/detail/index.js'],
        'cart' : ['./src/page/cart/index.js'],
        'order-confirm' : ['./src/page/order-confirm/index.js'],
        'order-list' : ['./src/page/order-list/index.js'],
        'order-detail' : ['./src/page/order-detail/index.js'],
        'payment' : ['./src/page/payment/index.js'],
        'user-login' : ['./src/page/user-login/index.js'],
        'user-register' : ['./src/page/user-register/index.js'],
        'user-pass-reset' : ['./src/page/user-pass-reset/index.js'],
        'user-pass-update' : ['./src/page/user-pass-update/index.js'],
        'user-center' : ['./src/page/user-center/index.js'],
        'result' : ['./src/page/result/index.js'],
        'about' : ['./src/page/about/index.js'],
    },
    output: {
        path: __dirname + '/dist', 
        //线上时添加网络路径的前缀
        publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.happymmall.com/mmall-fe/dist/',
        filename: 'js/[name].js',
    },
    //全局Jq引用 将html打包生成的文件引用原html的Jq文件引入
    externals: {
        'jquery': 'window.jQuery'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader:  ExtractTextPlugin.extract("style-loader","css-loader")
            },
            {
                test : /\.(png|jpg|gif|svg|woff|eot|ttf|woff2)$/i,
                loader : 'url-loader?limit=100&name=resource/[name].[ext]',
            },
            //string
            {
                test : /\.string$/,
                loader : 'html-loader',
            },
            //font-awesome-webpack
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "url-loader?limit=10000&mimetype=application/font-woff" 
            },
            {   test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: "file-loader" 
            }
       ]
    },
     //文件路径的便捷配置
    resolve : {
        alias : {
            node_modules : __dirname + '/node_modules',
            util         : __dirname + '/src/util',
            page         : __dirname + '/src/page',
            service      : __dirname + '/src/service',
            image        : __dirname + '/src/image'
        }
    },
    plugins: [
        //独立通过模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',         
            filename : 'js/base.js'//路径基于dist
        }),
        //css单独打包到文件
        new ExtractTextPlugin("css/[name].css"),
        // html模板处理-
        new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
        new HtmlWebpackPlugin(getHtmlConfig('list','商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('detail','商品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认')),
        new HtmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),
        new HtmlWebpackPlugin(getHtmlConfig('order-detail','订单详情')),
        new HtmlWebpackPlugin(getHtmlConfig('payment','订单支付')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('result','操作成功')),
        
    ]
};
module.exports = config;

if( 'dev' === WEBPACK_ENV ){
    config.entry.common.push('webpack-dev-server/client?http://loacalhost:8888/');
}