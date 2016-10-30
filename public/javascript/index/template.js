/**
 * Created by iqianjin-luming on 2016/9/30.
 */
define(function () {
   var template={};
   template.switchPanel = function (switchArr) {
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

    template.weekPanel = function (target,weekTime,initTimePlus) {
        var panel,day;
        panel='';
        if(weekTime.length===0){
            panel='<div class="input-group"><label>周一:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00"></div>' +
                '<div class="input-group"><label>周二:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00"></div>' +
                '<div class="input-group"><label>周三:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00"></div>' +
                '<div class="input-group"><label>周四:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00"></div>' +
                '<div class="input-group"><label>周五:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00"></div>' +
                '<div class="input-group"><label>周六:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00"></div>' +
                '<div class="input-group"><label>周日:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00"></div>';
        }else{
            for(var i=1;i<8;i++){
                switch (i){
                    case 1:
                        day='一';
                        break;
                    case 2:
                        day='二';
                        break;
                    case 3:
                        day='三';
                        break;
                    case 4:
                        day='四';
                        break;
                    case 5:
                        day='五';
                        break;
                    case 6:
                        day='六';
                        break;
                    default:
                        day='日';
                        break;
                }
                if(weekTime[0]['open_time_'+i]!='00:00'&&weekTime[0]['close_time_'+i]!='00:00'){
                    panel+='<div class="input-group"><label>周'+day+':</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="'+weekTime[0]['open_time_'+i]+'"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="'+weekTime[0]['close_time_'+i]+'"></div>'
                }else{
                    panel+='<div class="input-group"><label>周'+day+':</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="'+weekTime[0]['open_time_'+i]+'"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="'+weekTime[0]['close_time_'+i]+'"></div>'
                }
            }
        }
        target.html(panel);
        initTimePlus();//初始化时间插件
    };

    template.dailyPanel =function (target,dailyTime,initTimePlus) {
        var panel,start_day_arr,end_day_arr,start_month,start_day,end_month,end_day,open_time,close_time,i=1,panel='';
        if(dailyTime.length===0){
            for (i; i < 6; i++) {
                start_month = 0;
                start_day = 0;
                end_month = 0;
                end_day = 0;
                open_time='00:00';
                close_time='00:00';
                panel+=template.buildDailyPanel(start_month,start_day,end_month,end_day,open_time,close_time,i);
            }
            panel+='</div>';
        }else{
            for(i;i<6;i++){
                if(dailyTime[0]['start_'+i]!=='00-00'){
                    start_day_arr=dailyTime[0]['start_'+i].split('-');
                    end_day_arr=dailyTime[0]['end_'+i].split('-');
                    start_month=start_day_arr[0];
                    start_day=start_day_arr[1];
                    end_month=end_day_arr[0];
                    end_day=end_day_arr[1];
                    open_time=dailyTime[0]['open_' + i];
                    close_time=dailyTime[0]['close_' + i];
                    panel+=template.buildDailyPanel(start_month,start_day,end_month,end_day,open_time,close_time,i);
                }
            }
            panel+='</div>';
        }
        target.html(panel);
        initTimePlus();//初始化时间插件
    };
    template.buildDailyPanel=function (start_month,start_day,end_month,end_day,open_time,close_time,i) {
        var panel='';
        panel += '<div class="input-group">' +
            '<label>区间一:</label>' +
            '<div class="row interval-'+i+'">' +
            '<label class="col-sm-2">开始日期:</label>' +
            '<select class="col-sm-1 startMonth daily-start">';
        for(var i_1=1;i_1<13;i_1++){
            if(i_1==start_month){
                panel+='<option selected>'+i_1+'</option>';
            }else{
                panel+='<option>'+i_1+'</option>';
            }
        }
        panel+='</select><label class="col-sm-1">月</label>' +
            '<select class="col-sm-1 startDay daily-start">';
        for(var i_2=1;i_2<32;i_2++){
            if(i_2==start_day){
                panel+='<option selected>'+i_2+'</option>';
            }else{
                panel+='<option>'+i_2+'</option>';
            }
        }
        panel+='</select>' +
            '<label class="col-sm-1">日</label>' +
            '<label class="col-sm-2">结束日期:</label>' +
            '<select class="col-sm-1 endMonth daily-end">';
        for(var i_3=1;i_3<13;i_3++){
            if(i_3==end_month){
                panel+='<option selected>'+i_3+'</option>';
            }else{
                panel+='<option>'+i_3+'</option>';
            }
        }
        panel += '</select>' +
            '<label class="col-sm-1">月</label>' +
            '<select class="col-sm-1 endDay daily-end">';
        for(var i_4=1;i_4<32;i_4++){
            if(i_4==end_day){
                panel+='<option selected>'+i_4+'</option>';
            }else{
                panel+='<option>'+i_4+'</option>';
            }
        }
        panel += '</select>' +
            '<label class="col-sm-1">日</label>' +
            '</div>' +
            '</div>' +
            '<div class="input-group">' +
            '<div class="row">' +
            '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="' + open_time + '">' +
            '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="' + close_time + '">' +
            '</div>' +
            '</div>';
        return panel;
    };
   return template;
});
