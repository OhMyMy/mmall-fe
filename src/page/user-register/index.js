/*
* @Author: Administrator
* @Date:   2017-09-28 17:46:15
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-06 21:59:05
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
};
var page = {
    init :function(){
        this.bindEvent();
    }, 
    bindEvent : function(){
        var _this = this;//引用方法对象中的方法
        //验证username
        $('#username').blur(function(){
            var username = $.trim($(this).val());
            if(!username){
                return
            }
            //异步验证用户名是否存在
            _user.checkUsername(username, function(res){
                formError.hide();
            },function(errMsg){
                formError.show(errMsg);
            });
        });

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
            username        : $.trim($('#username').val()),
            password        : $.trim($('#password').val()),
            passwordConfirm : $.trim($('#password-confirm').val()),
            phone           : $.trim($('#phone').val()),
            email           : $.trim($('#email').val()),
            question        : $.trim($('#question').val()),
            answer          : $.trim($('#answer').val())
        },
        ValidateResult = this.formValidate(formData);
        //验证结果
        if(ValidateResult.status){
            _user.register(formData, function(res){
                window.location.href = './result.html?type=register';
            },function(errMsg){
                formError.show(errMsg);
            });
        }
        else{
            formError.show(ValidateResult.msg);
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
        //密码是否为空
        if(!_mm.validate(formData.password,'require')){
            result.msg = '密码不能为空';
            return result;
        }
        //密码长度
        if(formData.password.length < 6){
            result.msg = '密码不能少于6位';
            return result;
        }
        if(!formData.passwordConfirm){
            result.msg = '请再次确认密码';
            return result;
        }
        if(formData.password !== formData.passwordConfirm){
            result.msg = '密码不一致';
            return result;
        }
        if(!_mm.validate(formData.phone,'phone')){
            result.msg = '手机号格式不正确';
            return result;
        }
        if(!_mm.validate(formData.email,'email')){
            result.msg = '邮箱格式不正确';
            return result;
        }
        if(!_mm.validate(formData.question,'require')){
            result.msg = '密码提示问题不能为空';
            return result;
        }
        if(!_mm.validate(formData.answer,'require')){
            result.msg = '密码提示问题答案不能为空';
            return result;
        }

        //通过验证 提示
        result.status = true;
        result.msg    = '注册成功';
        return result;
    }
};

$(function(){
    page.init();
});