/*
* @Author: Administrator
* @Date:   2017-10-17 06:48:33
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-20 21:43:44
*/

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
require('util/showTip/index.js');

var navSide = require('page/common/nav-side/index.js');;
var _mm = require('util/mm.js');
var _order = require('service/order-service.js');
var teplateIndex = require('./index.string');

var page = {
    data : {
        orderNumber : _mm.getUrlParam('orderNumber')
    },
    init : function(){
        this.onLoad();
        this.bindEvent();
    }, 
    onLoad : function(){ 
        //初始化左侧菜单
        navSide.init({
            name : 'order-list'
        });
        this.loadDetail();
    },
    bindEvent : function(){
        var _this = this;
        //取消订单
        $(document).on('click', '.order-cancel', function(){
            $.showTips.Confirm("确定要取消该订单吗?", function(){
               _order.cancelOrder(_this.data.orderNumber, function(res){
                    $.showTips.Alert("该订单取消成功");
                    _this.loadDetail();
                }, function(errMsg){
                    $.showTips.Alert(errMsg);
                })
            });
            /*if(window.confirm('确定要取消该订单吗?')){
                _order.cancelOrder(_this.data.orderNumber, function(res){
                _mm.successTips('该订单取消成功');
                    _this.loadDetail();
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                })
            }*/
            
        });
    },
    //加载订单详情
    loadDetail : function(){
        var _this             = this,
            orderDetailHtml   = '',
            $content          = $('.content');
         $content.html('<div class="loading"></div>');   
        _order.getDetail(this.data.orderNumber, function(res){
            _this.dataFilter(res);
            //渲染html
            orderDetailHtml = _mm.renderHtml( teplateIndex, res);
            $content.html(orderDetailHtml);
        }, function(errMsg){
            $content.html('<p class="err-tip">'+ errMsg +'</p>');
        });
    }, 
    //数据的适配
    dataFilter : function(data){
        data.needPay        = data.status == 10;
        data.isCancelable   = data.status == 10;
    }   
};

$(function(){
    page.init();
});