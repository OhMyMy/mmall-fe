/*
* @Author: Administrator
* @Date:   2017-10-02 21:52:15
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-21 10:57:07
*/

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/showTip/index.js');

var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');
var page = {   
    init: function(){
        this.onLoad();
        this.bindEvent();
    }, 
    onLoad : function(){
        // 初始化左侧菜单
        navSide.init({
            name: 'user-pass-update'
        });
    },
    bindEvent : function(){
        var _this = this;
        // 点击提交按钮后的动作
        $(document).on('click', '.btn-submit', function(){
            var userInfo = {
                password        : $.trim($('#password').val()),
                passwordNew     : $.trim($('#password-new').val()),
                passwordConfirm : $.trim($('#password-confirm').val())
            },
            validateResult = _this.validateFrom(userInfo);
            if(validateResult.status){
                // 更改用户密码
                _user.updatePassword({
                    passwordOld : userInfo.password,
                    passwordNew : userInfo.passwordNew
                }, function(res, msg){
                    $.showTips.Alert(msg);
                }, function(errMsg){
                    $.showTips.Alert(errMsg);
                });
            }
            else{
                $.showTips.Alert(validateResult.msg);
            }
        });
    },
    validateFrom : function(formData){
        var result = {
            status : false,
            msg    : ''
        };
        if(!_mm.validate(formData.password,'require')){
            result.msg = '原密码不能为空';
            return result;
        }
        if(!formData.passwordNew || formData.passwordNew.length < 6){
            result.msg = '新密码长度不能少于6位';
            return result;
        }
        if(formData.passwordNew !== formData.passwordConfirm){
            result.msg = '密码不一致';
            return result;
        }
      
        //通过验证 提示
        result.status = true;
        result.msg    = '验证通过';
        return result;
    }
    //加载用户信息
    /*loadUserInfo : function(){
        var userHtml = '';
        _user.getUserInfo(function(res){
            userHtml = _mm.renderHtml(teplateIndex, res);
            $('.panel-body').html(userHtml);
        }, function(errMsg){
            _mm.errorTips(errMsg);
        });
    },*/

};

$(function(){
    page.init();
});