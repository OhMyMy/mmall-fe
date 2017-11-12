/*
* @Author: Administrator
* @Date:   2017-09-26 23:43:18
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-20 14:12:45
*/
require('./index.css');

require('page/common/nav-simple/index.js');

var _mm = require('util/mm.js');

$(function(){
    var type = _mm.getUrlParam('type') || 'defult',
        $element = $('.' + type + '-success');
    if(type === 'payment'){
        var orderNumber  = _mm.getUrlParam('orderNumber'),
            $orderNumber = $element.find('.order-number');
        $orderNumber.attr('href', $orderNumber.attr('href') + orderNumber);   
    }
    //显示对应的提示元素
    $element.show();
})