/*
* @Author: Administrator
* @Date:   2017-09-26 01:30:37
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-02 22:24:52
*/
require('./index.css');
var _mm = require('util/mm.js');
//引入html模板
var templateIndex = require('./index.string');
//侧边导航
var navSide = {
    //内容配置
    option : {
        name : '',
        navList : [
            {name: 'user-center', desc: '个人中心', href: './user-center.html'},
            {name: 'order-list', desc: '我的订单', href: './order-list.html'},
            {name: 'user-pass-update', desc: '修改密码', href: './user-pass-update.html'},
            {name: 'about', desc: '关于Mall', href: './about.html'}           
        ]
    },
    init : function(option){
        // 合并选项
        $.extend(this.option, option);
        this.renderNav();
    },
    //渲染导航菜单
    renderNav : function(){
        for(var i = 0, iLength = this.option.navList.length; i < iLength; i++){
            if(this.option.navList[i].name === this.option.name){
                this.option.navList[i].isActive = true;
            }
        };
        //渲染list数据 
        var navHtml = _mm.renderHtml(templateIndex, {
            navList : this.option.navList
        });
        //html放入容器
        $('.nav-side').html(navHtml);
    }
};

module.exports = navSide;
