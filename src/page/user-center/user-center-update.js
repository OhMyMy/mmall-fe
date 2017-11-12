/*
* @Author: Administrator
* @Date:   2017-10-21 13:07:56
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-22 02:54:10
*/
require('util/showTip/index.js');

var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var teplateUserModal = require('./user-center-update.string');
var userModal = {
    show : function(option){
        this.option = option;
        this.$modalWrap = $('.modal-wrap');
        //渲染页面
        this.loadModal();
        //绑定事件
        this.bindEvent();
    },
    bindEvent : function(){
        var _this = this; 
        //点击提交
        $(document).on('click','.submit-btn',function(){
            //获取值
            var userInfo = {
                phone : $.trim($('#phone').val()),
                email : $.trim($('#email').val()),
                question : $.trim($('#question').val()),
                answer : $.trim($('#answer').val())
            },
            //表单验证
            validateResult = _this.validateFrom(userInfo);
            if(validateResult.status){
                _user.updateUserInfo(userInfo, function(res, msg){
                    //关闭弹窗
                     _this.hide();
                     //显示提示
                     $.showTips.Alert(msg);
                     //检测是否函数 执行回调函数 刷新用户信息
                     typeof _this.option.onSuccess === 'function'
                     && _this.option.onSuccess(res);
                    /*_mm.successTips(msg); 
                    window.location.href = './user-center.html'; */             
                }, function(errMsg){
                    $.showTips.Alert(errMsg);
                });
            }
            else{
                $.showTips.Alert(validateResult.msg);
            }
        });
        //阻止事件冒泡
        $(document).on('click','.editModal-container',function(e){
            e.stopPropagation();
        });
        //关闭弹窗
        $(document).on('click','.editClose-btn',function(){
            _this.hide();
        });
    },
    loadModal : function(){
        _user.getUserInfo(function(res){
            var userModalHtml = _mm.renderHtml(teplateUserModal, res);
            $('.modal-wrap').html(userModalHtml);
        }, function(errMsg){
            $.showTips.Alert(errMsg);
        });

    },
    //表单验证
    validateFrom : function(formData){
        var result = {
            status : false,
            msg    : ''
        };
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
        result.msg    = '提交成功';
        return result;
    },

    //关闭弹窗
     hide : function(){
        $('.modal-wrap').empty();
     },
};

module.exports = userModal;