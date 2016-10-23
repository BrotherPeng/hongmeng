/**
 * Created by iqianjin-luming on 2016/9/30.
 */
define(function () {
   var template={};
   template.swichPanel = function (switchArr) {
       var panel;
       panel='<div class="btn-group" data-toggle="buttons">';
       for(var i=0;i<switchArr.length;i++){
           if(switchArr[i]===0){
               panel+='<label class="btn btn-success btn-switch active"><input type="checkbox" autocomplete="off" checked/>继电器'+(i+1)+'</label>'
           }else {
               panel+='<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器'+(i+1)+'</label>'
           }
       }
       panel+='</div>';
       return panel;
   };

    template.weekPanel = '<div class="input-group"><label>周一:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30"></div>' +
        '<div class="input-group"><label>周二:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30"></div>' +
        '<div class="input-group"><label>周三:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30"></div>' +
        '<div class="input-group"><label>周四:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30"></div>' +
        '<div class="input-group"><label>周五:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30"></div>' +
        '<div class="input-group"><label>周六:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30"></div>' +
        '<div class="input-group"><label>周日:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30"></div>';
    template.dailyPanel = '<div class="input-group">' +
        '<label>区间一:</label>' +
        '<div class="row">' +
        '<label class="col-sm-2">开始日期:</label><input class="col-sm-3 startDay flatpickrDay">' +
        '<label class="col-sm-2">结束日期:</label><input class="col-sm-3 endDay flatpickrDay"></div>' +
        '<div class="input-group">' +
        '<div class="row">' +
        '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30">' +
        '</div>' +
        '<label>区间二:</label>' +
        '<div class="row">' +
        '<label class="col-sm-2">开始日期:</label><input class="col-sm-3 startDay flatpickrDay">' +
        '<label class="col-sm-2">结束日期:</label><input class="col-sm-3 endDay flatpickrDay"></div>' +
        '<div class="input-group">' +
        '<div class="row">' +
        '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30">' +
        '</div>' +
        '<label>区间三:</label>' +
        '<div class="row">' +
        '<label class="col-sm-2">开始日期:</label><input class="col-sm-3 startDay flatpickrDay">' +
        '<label class="col-sm-2">结束日期:</label><input class="col-sm-3 endDay flatpickrDay"></div>' +
        '<div class="input-group">' +
        '<div class="row">' +
        '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30">' +
        '</div>' +
        '<label>区间四:</label>' +
        '<div class="row">' +
        '<label class="col-sm-2">开始日期:</label><input class="col-sm-3 startDay flatpickrDay">' +
        '<label class="col-sm-2">结束日期:</label><input class="col-sm-3 endDay flatpickrDay"></div>' +
        '<div class="input-group">' +
        '<div class="row">' +
        '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30">' +
        '</div>' +
        '<label>区间五:</label>' +
        '<div class="row">' +
        '<label class="col-sm-2">开始日期:</label><input class="col-sm-3 startDay flatpickrDay">' +
        '<label class="col-sm-2">结束日期:</label><input class="col-sm-3 endDay flatpickrDay"></div>' +
        '<div class="input-group">' +
        '<div class="row">' +
        '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30">' +
        '</div>' +
        '</div>';
   return template;
});
