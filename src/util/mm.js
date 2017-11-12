/*
* @Author: Administrator
* @Date:   2017-09-24 19:19:16
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-21 11:06:20
*/
//Js工具封装
var Hogan = require('hogan.js');

var conf = {
    serverHost : ''
};

var _mm = {
    request : function(param){
        var _this = this;
        $.ajax({
            type     : param.method || 'get',
            url      : param.url    || '',
            dataType : param.type   || 'json',
            data     : param.data   || '',
            success  : function(res){
                //请求成功
                if(0 === res.status ){
                    typeof param.success === 'function' && param.success(res.data,res.msg);
                }
                //没有登录状态 需要强制登录
                else if(10 === res.status){
                    _this.doLogin();
                }
                //请求数据失败
                else if(1 === res.status){
                     typeof param.error === 'function' && param.error(res.msg);
                }
            },

            error    : function(err){
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },
    //获取服务器地址
    getServerUrl : function(path){
        return conf.serverHost + path;
    },
    //获取url参数
    getUrlParam : function(name){
       //happymmall.com/product/(url参数)list.do?keyword=xx&page=1
        var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result  = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    //渲染html模板
    renderHtml : function(htmlTeplate, data){
        var template = Hogan.compile(htmlTeplate),
            result   = template.render(data);
        return result;
    },
    //成功提示
    successTips : function(msg){
        alert(msg || '操作成功');
    },
    errorTips : function(msg){
        alert(msg || '不明之处有翻车状况');
    },
    //字段的验证 是否支持非空 手机 邮箱的判断
    validate : function(value, type){
        var value = $.trim(value);
        //非空验证
        if('require' === type){
            return !!value
        }
        //手机号验证
        if('phone' === type){
            return /^1\d{10}$/.test(value);
        }
        //邮箱格式验证
        if('email' === type){
            return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
        }
    },
    //统一登录处理
    doLogin : function(){
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    goHome : function(){
        window.location.href = './index.html';
    },

};
//暴露输出
module.exports = _mm;