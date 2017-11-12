/*
* @Author: Administrator
* @Date:   2017-10-10 23:40:32
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-20 21:13:42
*/

require('./index.css');
require('page/common/header/index.js');
require('util/showTip/index.js');

var _mm = require('util/mm.js');
var _cart = require('service/cart-service.js');
var nav = require('page/common/nav/index.js');
var templateIndex = require('./index.string');

var page = {
    data : {
        
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function(){
        this.loadCart();
    },
    bindEvent: function(){
        var _this = this;
        //商品的选择
        $(document).on('click','.cart-select',function(){
            var $this = $(this),
                productId = $this.parents('.cart-table').data('product-id');
            //切换状态
            if($this.is(':checked')){
                _cart.selectProduct(productId,function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
            else{
                _cart.unselectProduct(productId,function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
        });

        //商品的全选
        $(document).on('click','.cart-select-all',function(){
            var $this = $(this);
            //切换状态
            if($this.is(':checked')){
                _cart.selectAllProduct(function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
            else{
                _cart.unselectAllProduct(function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
        });
        //商品数量的变化
        $(document).on('click','.count-btn',function(){
            var $this       = $(this),
                $pCount     = $this.siblings('.count-input'),
                currCount   = parseInt($pCount.val()),
                type        = $this.hasClass('plus') ? 'plus' :'minus',
                productId   = $this.parents('.cart-table').data('product-id'),
                minCount    = 1,
                maxCount    = parseInt($pCount.data('max')),
                newCount    = 0;
            if(type === 'plus'){
                if(currCount >= maxCount){
                    $.showTips.Alert("该商品数量已达上限");
                    return;
                }
                newCount = currCount + 1;
            }else if(type === 'minus'){
                if(currCount <= minCount){
                    return;
                }
                newCount = currCount - 1;
            }
            //更新购物车商品数量
            _cart.updateProduct({
                productId : productId,
                count : newCount
            },function(res){
                _this.renderCart(res);
            }, function(errMsg){
                _this.showCartError();
            });
        });
        //删除单个商品
        $(document).on('click','.cart-delete',function(){
            var productId = $(this).parents('.cart-table')
                    .data('product-id');
            $.showTips.Confirm("确认要删除该商品?", function(){
                _this.delectCartProduct(productId);
            });
        });
        
        //删除选中商品
        $(document).on('click','.delete-selected',function(){
            var arrProductIds = [],
                $selectedItem = $('.cart-select:checked');
            for(var i = 0, iLength = $selectedItem.length;i < iLength; i++){
                arrProductIds.push($($selectedItem[i]).parents('.cart-table').data('product-id'));
            }
            if(arrProductIds.length){
                $.showTips.Confirm("确认要删除该商品?", function(){
                    _this.delectCartProduct(arrProductIds.join(','));
                });
            }else{
                $.showTips.Alert("你还没选中要删除的商品！");
            }    
        });

        //提交购物车
        $(document).on('click', '.btn-submit', function(){
            //判断总价大于零
            if(_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0){
                window.location.href = './order-confirm.html';
            }else{
                /*_mm.errorTips('请选择商品后再提交');*/
                $.showTips.Alert("请选择商品后再提交！");
            }
        });
         
    },
    //加载购物车
    loadCart: function(){
        var _this = this;
        //获取购物车列表
        _cart.getCartList(function(res){
            _this.renderCart(res);
        }, function(errMsg){
            _this.showCartError();
        })
    },
    //渲染购物车
    renderCart : function(data){
        this.filter(data);
        //缓存购物车信息
        this.data.cartInfo = data;
        //生成html
        var cartHtml = _mm.renderHtml(templateIndex, data);
        $('.page-wrap').html(cartHtml);
        //更新导航nav中的购物车数量
        nav.loadCartCount();
    },
    // 删除指定商品 支持批量 productId用逗号分隔 
    delectCartProduct : function(productIds){
        var _this = this;
        _cart.delectProduct(productIds,function(res){
            _this.renderCart(res);
        }, function(errMsg){
            _this.showCartError();
        });
    },

    // 数据匹配
    filter : function(data){
       data.notEmpty = !!data.cartProductVoList.length;
    },
    //显示错误信息
    showCartError : function(){
        $('.page-wrap').html('<p class="err-tip">哪里不对啦，刷新试试</p>');
    }  
    
};

$(function(){
    page.init();
});