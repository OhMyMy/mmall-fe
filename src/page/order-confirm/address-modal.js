/*
* @Author: Administrator
* @Date:   2017-10-14 19:29:21
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-22 01:46:25
*/

require('util/showTip/index.js');

var _mm = require('util/mm.js');
var _address = require('service/address-service.js');
var _cities = require('util/cities/index.js');
var templateAddressModal = require('./address-modal.string');

var addressModal = {
     show : function(option){
        //option绑定
        this.option = option;
        this.option.data = option.data || {};
        this.$modalWrap = $('.modal-wrap');
        //渲染页面
        this.loadModal();
        //绑定事件
        this.bindEvent();
     },
     bindEvent : function(){
        var _this = this;
        //省份和市级的二级联动
        this.$modalWrap.find('#receiver-province').change(function(){
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });
        //点击保存收货地址
        this.$modalWrap.find('.address-btn').click(function(){
            var receiverInfo = _this.getReceiverInfo(),
                isUpdate     = _this.option.isUpdate;
            //使用新地址 ，且验证通过
            if(!isUpdate && receiverInfo.status){
                _address.save(receiverInfo.data, function(res){
                    $.showTips.Alert("地址添加成功！");
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                    && _this.option.onSuccess(res);
                },function(errMsg){
                    $.showTips.Alert(errMsg);
                });
            }
            //更新收件人 且验证通过
            else if(isUpdate && receiverInfo.status){
                _address.updata(receiverInfo.data, function(res){
                    $.showTips.Alert("地址修改成功！");
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                    && _this.option.onSuccess(res);
                },function(errMsg){
                    $.showTips.Alert(errMsg);
                });
            }
            //验证不通过
            else{
                $.showTips.Alert(receiverInfo.errMsg || '好像哪里不对啦！');
            }
        });
        //点击内容区时 阻止事件冒泡 不关闭弹窗
        this.$modalWrap.find('.modal-container').click(function(e){
            e.stopPropagation();
        });
        //关闭弹窗 点击X号或蒙版 modal添加class close
        this.$modalWrap.find('.close').click(function(){
            _this.hide();
        });
     },
     loadModal : function(){
        var addressModalHtml = _mm.renderHtml( templateAddressModal, {
            isUpdate    : this.option.isUpdate,
            data        : this.option.data
        });
        this.$modalWrap.html(addressModalHtml);
        //加载省份
        this.loadProvince();
        //加载城市
        /*this.loadCities();*/
     },
     loadProvince : function(){
        var provinces = _cities.getProvinces() || [],
            $provinceSelect = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));
        //编辑地址 有省份信息 做省份的回填
        if(this.option.isUpdate && this.option.data.receiverProvince){
            $provinceSelect.val(this.option.data.receiverProvince);
            this.loadCities(this.option.data.receiverProvince);
        }
     },

     loadCities : function(provinceName){
        var cities = _cities.getCities(provinceName) || [],
            $citySelect = this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities)); 
        //编辑地址 有城市信息 做城市的回填
        if(this.option.isUpdate && this.option.data.receiverCity){
            //加载城市前 需通过省份完成城市列表的加载
            $citySelect.val(this.option.data.receiverCity)
        }    
     },
     //获取收件人信息 表单验证
     getReceiverInfo : function(){
        var receiverInfo  = {},
            result        = {
                status : false
            };
        receiverInfo.receiverName       = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince   = this.$modalWrap.find('#receiver-province').val();
        receiverInfo.receiverCity       = this.$modalWrap.find('#receiver-city').val();
        receiverInfo.receiverAddress    = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone      = $.trim(this.$modalWrap.find('#receiver-phone').val());          
        receiverInfo.receiverZip        = $.trim(this.$modalWrap.find('#receiver-zip').val());
        //更新地址时 传入收件人信息的id属性
        if(this.option.isUpdate){
            receiverInfo.id      = this.$modalWrap.find('#receiver-id').val();
        }
        if(!receiverInfo.receiverName){
            result.errMsg = '请输入收件人姓名';
        }
        else if(!receiverInfo.receiverProvince){
            result.errMsg = '请选择收件人所在省份';
        }
        else if(!receiverInfo.receiverCity){
            result.errMsg = '请选择收件人所在城市';
        }
        else if(!receiverInfo.receiverAddress){
            result.errMsg = '请输入收件人详细地址';
        }
        else if(!receiverInfo.receiverPhone){
            result.errMsg = '请输入收件人手机号';
        }
        //所有的验证都通过
        else{
            result.status = true;
            result.data   = receiverInfo;
        }
        return result;
     },
     //获取select框的选项 输入：array 输出：html
     getSelectOption : function(optionArray){
        var html = '<option value="">请选择</option>';
        for(var i = 0, length = optionArray.length; i < length; i++){
            html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>';
        }
        return html;
     },
     //关闭弹窗
     hide : function(){
        this.$modalWrap.empty();
     }
};

module.exports = addressModal;