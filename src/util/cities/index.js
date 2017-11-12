/*
* @Author: Administrator
* @Date:   2017-10-14 19:52:13
* @Last Modified by:   Administrator
* @Last Modified time: 2017-10-15 00:25:10
*/

var _cities = {
    cityInfo : {
        '北京' : ['北京'],
        '广东' : ['广州','深圳','珠海','汕头','东莞'],
        '湖南' : ['长沙','常德','株洲','湘潭','衡阳'],
        '福建' : ['福州','厦门','莆田','三明','泉州','漳州'],
        '湖北' : ['武汉','宜昌','荆州']
    },
    //获取所有省份
    getProvinces : function(){
        var provinces = [];
        for(var item in this.cityInfo){
            provinces.push(item);
        }
        return provinces; 
    },
    getCities : function(provinceName){
        return this.cityInfo[provinceName] || []; 
    }
}
module.exports = _cities;