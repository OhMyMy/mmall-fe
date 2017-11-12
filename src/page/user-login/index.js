/*
* @Author: Administrator
* @Date:   2017-09-23 17:36:23
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-01 03:57:35
*/
require('./index.css');

require('page/common/nav-simple/index.js');

var _user = require('service/user-service.js');

var _mm = require('util/mm.js');

//错误提示
var formError = {
    show : function(errMsg){
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide : function(){
        $('.error-item').hide();
    }
}
var page = {
    init :function(){
        this.bindEvent();
    }, 
    bindEvent : function(){
        var _this = this;//引用方法对象中的方法
        $('#submit').click(function(){
            _this.submit();
        });
        //回车也进行提交
        $('.user-content').keyup(function(e){
            if(e.keyCode === 13){
                _this.submit();
            }
        });
    },
    submit : function(){
        var formData = {
            username : $.trim($('#username').val()),
            password : $.trim($('#password').val())
        },
        validateResult = this.formValidate(formData);
        //验证结果
        if(validateResult.status){
            _user.login(formData,function(res){
                window.location.href = _mm.getUrlParam('redirect') || './index.html';
            },function(errMsg){
                formError.show(errMsg);
            });
        }else{
            formError.show(validateResult.msg);
        }
    },
    //表单验证
    formValidate : function(formData){
        var result = {
            status : false,
            msg    : ''
        };
        if(!_mm.validate(formData.username,'require')){
            result.msg = '用户名不能为空';
            return result;
        }
         if(!_mm.validate(formData.password,'require')){
            result.msg = '密码不能为空';
            return result;
        }
        //通过验证 提示
        result.status = true;
        result.msg    = '登录成功';
        return result;
    },
};

$(function(){
    page.init();
});