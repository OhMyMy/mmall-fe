/*
* @Author: Administrator
* @Date:   2017-09-25 20:28:53
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-13 13:14:41
*/
require('./index.css');

var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var _cart = require('service/cart-service.js');
//导航
var nav = {
    init : function(){
        this.bindEvent();
        this.loadCartCount();
        this.loadUserInfo();        
        return this;                
    },
    bindEvent : function(){
        //点击登录 跳转登录页
        $('.js-login').click(function(){
            _mm.doLogin();
        });
        //注册
        $('.js-register').click(function(){
            window.location.href = './user-register.html'
        });
        //退出登录
        $('.js-logout').click(function(){
            _user.logout(function(res){
                window.location.reload();
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
    },
    //加载用户信息
    loadUserInfo : function(){
        _user.checkLogin(function(res){
            $('.user.not-login').hide().siblings('.user.login').show()
                .find('.username').text(res.username);
        }, function(errMsg){

        });
    },
    //加载购物车数量
    loadCartCount : function(){
        _cart.getCartCount(function(res){
            $('.nav .cart-count').text(res || 0);
        }, function(errMsg){
            $('.nav .cart-count').text(0);
        });
    }
}

module.exports = nav.init();