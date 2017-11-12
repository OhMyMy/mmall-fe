/*
* @Author: Administrator
* @Date:   2017-10-17 20:11:32
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-17 20:22:51
*/
var _mm = require('util/mm.js');
var _payment = {  
    //获取支付信息  
    getPaymentInfo : function(orderNumber, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/pay.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
    },  
    //订单状态监听
    getPaymentStatus: function(orderNumber, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/query_order_pay_status.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
    },  
}
module.exports = _payment; 