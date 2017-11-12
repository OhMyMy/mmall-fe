/*
* @Author: Administrator
* @Date:   2017-10-20 12:37:31
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-21 15:27:40
*/
require('./index.css');
(function(){
    $.showTips ={
        Alert : function(msg){
            GenerateHtml("alert", msg);
            btnOk();
            btnNo();
        },
        Confirm : function(msg,callback){
            GenerateHtml("confirm", msg);
            btnOk(callback);
            btnNo();
        },
    };

    var GenerateHtml = function(type, msg){
        var _html = '',
            title = title || '提示:';
        _html += '<div class="tipModal tipClose-btn">'+
                    '<div class="tipModal-content">'+
                        '<div class="tipModal-header">'+
                            '<h4 class="tipModal-title">温馨提示:</h4>'+
                            '<i class="fa fa-close tipClose-btn"></i>'+
                        '</div>'+
                        '<div class="tipModal-body">'+
                            '<p>'+msg+'</p>'+
                        '</div>'+
                        '<div class="tipModal-footer">';
        if(type == "alert"){
            _html += '<span class="tipBtn default">确定</span>';
        }
        if(type == "confirm"){
            _html += '<span class="tipBtn default">取消</span>';
            _html += '<span class="tipBtn primary">确定</span>';
        }
        _html += '</div></div></div>';
        $('body').append(_html);

        $('.tipModal-content').click(function(e){
            e.stopPropagation();
        });

        $('.tipClose-btn').click(function(){
            $('.tipModal').remove();
        });
    };

    //确定按钮事件
    var btnOk = function(callback){
        $('.primary').click(function(){
            $('.tipModal').remove();
            if(typeof (callback) == 'function'){
                callback();
            }
        });
    };
    //取消
    var btnNo = function(){
        $('.default').click(function(){
            $('.tipModal').remove();
        });
    };

})();
