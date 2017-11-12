/*
* @Author: Administrator
* @Date:   2017-10-02 00:02:10
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-22 02:52:11
*/
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/showTip/index.js');

var navSide = require('page/common/nav-side/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var userModal = require('./user-center-update.js');
var teplateIndex = require('./index.string');
var page = {
    init :function(){
        this.onLoad();
        this.bindEvent();
    }, 
    onLoad : function(){
        //初始化左侧菜单
        navSide.init({
            name : 'user-center'
        })
        //加载用户信息
        this.loadUserInfo();
    },
    bindEvent : function(){
        var _this = this;
        //点击编辑地址
        $(document).on('click','.btn-edit',function(){
            userModal.show({
                onSuccess : function(){
                    _this.loadUserInfo();
                }
            });
        });
    },
    //加载用户信息
    loadUserInfo : function(){
        var userHtml = '';
        _user.getUserInfo(function(res){
            userHtml = _mm.renderHtml(teplateIndex,res);
            $('.panel-body').html(userHtml);
        }, function(errMsg){
            $.showTips.Alert(errMsg);
        });
    }, 
};
$(function(){
    page.init();
});