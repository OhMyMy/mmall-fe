/*
* @Author: Administrator
* @Date:   2017-10-13 11:06:57
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-22 02:44:56
*/
require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
require('util/showTip/index.js');

var _mm = require('util/mm.js');
var _order = require('service/order-service.js');
var _address = require('service/address-service.js');
var addressModal = require('./address-modal.js');
var templateAddress = require('./address-list.string');
var templateProduct = require('./product-list.string');

var page = {
    data : {
        selectedAddressId : null
    },
    init :function(){
        this.onLoad();
        this.bindEvent();
    }, 
    onLoad : function(){
        //页面渲染
        this.loadAddressList();
        this.loadProductList();
    },
    bindEvent : function(){
        var _this = this;
        //地址的选择
        $(document).on('click','.address-item',function(){
            $(this).addClass('active')
                .siblings('.address-item').removeClass('active');
            _this.data.selectedAddressId = $(this).data('id');
        });
        //订单提交
        $(document).on('click', '.order-submit', function(){
            var shippingId = _this.data.selectedAddressId;
            if(shippingId){
                _order.createOrder({
                    shippingId : shippingId
                }, function(res){
                    window.location.href = './payment.html?orderNumber=' + res.orderNo;
                }, function(errMsg){
                    $.showTips.Alert("errMsg");
                });
            }else{
                $.showTips.Alert("请选择地址后再提交！");
            }
        });
        //添加地址
        $(document).on('click','.address-add',function(){
            addressModal.show({
                isUpdate : false,
                onSuccess : function(){
                    _this.loadAddressList();
                }
            });
        });
        //编辑地址
        $(document).on('click','.address-update',function(e){
            //阻止冒泡 点击编辑时触发active
            e.stopPropagation();
            var shippingId = $(this).parents('.address-item').data('id');
            _address.getAddress(shippingId, function(res){
                addressModal.show({
                    isUpdate : true,
                    data     : res,
                    onSuccess : function(){
                        _this.loadAddressList();
                    } 
                });
            }, function(errMsg){
                $.showTips.Alert(errMsg);
            });        
        });
        //删除地址
        $(document).on('click','.address-delete',function(e){
            //防止点击删除时 其他选项失去active
            e.stopPropagation();
            var id = $(this).parents('.address-item').data('id');
            $.showTips.Confirm("确认要删除该地址吗?", function(){
                _address.deleteAddress(id, function(res){
                    _this.loadAddressList();
                }, function(errMsg){
                    $.showTips.Alert(errMsg);
                });
            });
            /*if(window.confirm('确认要删除该地址吗?')){
                _address.deleteAddress(id, function(res){
                    _this.loadAddressList();
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }*/
        });
    },
    loadAddressList : function(){
        var _this = this;
        $('.address-con').html('<div class="loading"></div>');
        _address.getAddressList(function(res){
            _this.addressFilter(res);
            var addressListHtml = _mm.renderHtml(templateAddress, res);
            $('.address-con').html(addressListHtml);
        }, function(errMsg){
            $('.address-con').html('<p class="err-tip">地址加载失败，请刷新重试！</p>');
        });
    },
    //页面刷新时 保留acive的状态 仅需data中的id 做数据过滤处理
    addressFilter : function(data){
        if(this.data.selectedAddressId){
            //active项是否已删除
            var selectedAddressIdFlag = false;
            for(var i = 0, length = data.list.length; i < length; i++){
                if(data.list[i].id === this.data.selectedAddressId){
                    data.list[i].isActive = true;
                    //有效地址
                    selectedAddressIdFlag = true;
                }
            };
            //以前选中的地址不在列表里 将其删除
            if(!selectedAddressIdFlag){
                this.data.selectedAddressId = null;
            }
        }
    },
    loadProductList : function(){
        var _this = this;
        $('.product-con').html('<div class="loading"></div>');
        _order.getProductList(function(res){
            var productListHtml = _mm.renderHtml(templateProduct, res);
            $('.product-con').html(productListHtml);
        }, function(errMsg){
            $('.product-con').html('<p class="err-tip">商品信息加载失败，请刷新重试！</p>');
        });
    },  
};

$(function(){
    page.init();
});