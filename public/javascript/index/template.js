/**
 * Created by iqianjin-luming on 2016/9/30.
 */
define(function () {
    var template = {};
    template.switchPanel = function (switchArr) {
        var panel;
        panel = '<div class="btn-group" data-toggle="buttons">';
        for (var i = 0; i < switchArr.length; i++) {
            if (switchArr[i] === 0) {
                panel += '<label class="btn btn-success btn-switch active on_off_btn"><input type="checkbox" autocomplete="off" checked/>继电器' + (i + 1) + '</label>'
                // panel += '' +
                //     '<div style="display: inline-block">' +
                //     '<div style="text-align: center">' + "继电器" + (i + 1) + '</div>' +
                //     '<label class="btn btn-success btn-switch active on_off_btn" style="padding: 5px 22px;">' +
                //     '<input type="checkbox" autocomplete="off" checked style="display: none"/>' +
                //     '<span>off</span>' +
                //     '</label>'+
                //     '</div>';


            } else {
                panel += '<label class="btn btn-success btn-switch on_off_btn"><input type="checkbox" autocomplete="off" checked/>继电器' + (i + 1) + '</label>'
                //panel+='<label class="ios"><input type="checkbox" autocomplete="off" checked="checked"/><i></i>继电器'+(i+1)+'</label>'
            }
        }
        panel += '</div>';
        return panel;
    };
    template.weekPanel = function (target, weekTime, initTimePlus, switchArr) {
        var panel, day;
        panel = '';
        if (weekTime.length === 0) {
            panel =
                '<div class="input-group week_box">' +
                '<label>周一:</label>' +
                '<div class="disDiv"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00">' +
                '</div>' +
                '<div class="on_off_box">' +
                '</div>' +
                '</div>' +
                '<div class="input-group week_box">' +
                '<label>周二:</label>' +
                '<div class="disDiv"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00">' +
                '</div>' +
                '<div class="on_off_box">' +
                '</div>' +
                '</div>' +
                '<div class="input-group week_box">' +
                '<label>周三:</label><div class="disDiv">' +
                '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00">' +
                '</div>' +
                '<div class="on_off_box">' +
                '</div>' +
                '</div>' +
                '<div class="input-group week_box">' +
                '<label>周四:</label>' +
                '<div class="disDiv"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00">' +
                '</div>' +
                '<div class="on_off_box">' +
                '</div>' +
                '</div>' +
                '<div class="input-group week_box">' +
                '<label>周五:</label>' +
                '<div class="disDiv"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00">' +
                '</div>' +
                '<div class="on_off_box">' +
                '</div>' +
                '</div>' +
                '<div class="input-group week_box">' +
                '<label>周六:</label>' +
                '<div class="disDiv"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00">' +
                '</div>' +
                '<div class="on_off_box">' +
                '</div>' +
                '</div>' +
                '<div class="input-group week_box">' +
                '<label>周日:</label>' +
                '<div class="disDiv"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="00:00">' +
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="00:00">' +
                '</div>' +
                '<div class="on_off_box">' +
                '</div>' +
                '</div>';
        } else {
            for (var i = 1; i < 8; i++) {
                switch (i) {
                    case 1:
                        day = '一';
                        break;
                    case 2:
                        day = '二';
                        break;
                    case 3:
                        day = '三';
                        break;
                    case 4:
                        day = '四';
                        break;
                    case 5:
                        day = '五';
                        break;
                    case 6:
                        day = '六';
                        break;
                    default:
                        day = '日';
                        break;
                }
                if (weekTime[0]['open_time_' + i] != '00:00' && weekTime[0]['close_time_' + i] != '00:00') {
                    panel +=
                        '<div class="input-group">' +
                        '<label>周' + day + ':</label><div class="row">' +
                        '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="' + weekTime[0]['open_time_' + i] + '">' +
                        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="' + weekTime[0]['close_time_' + i] + '">' +
                        '</div>' +
                        '</div>';

                } else {
                    panel +=
                        '<div class="input-group">' +
                        '<label>周' + day + ':</label><div class="row">' +
                        '<label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="' + weekTime[0]['open_time_' + i] + '">' +
                        '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="' + weekTime[0]['close_time_' + i] + '">' +
                        '</div>' +
                        '</div>';
                }
            }
        }
        target.html(panel);
        var on_off_box = $(".on_off_box");
        //开关
        var onOffBtn = "";
        for (var j = 0; j < switchArr.length; j++) {
            if (switchArr[j] == 0) {
                onOffBtn +=
                    '<div style="display: inline-block;text-align: center;margin: 10px 0 0 10px">' +
                    '<div>' + "继电器" + (j + 1) + '</div>' +
                    '<div class="ios ios2">' +
                    '<i class="iosBtn iosBtn2"></i>' +
                    '</div>' +
                    '</div>';
            } else {
                onOffBtn +=
                    '<div style="display: inline-block;text-align: center;margin: 10px 0 0 10px">' +
                    '<div>' + "继电器" + (j + 1) + '</div>' +
                    '<div class="ios">' +
                    '<i class="iosBtn"></i>' +
                    '</div>' +
                    '</div>';
            }
            on_off_box.html(onOffBtn);
        }
        /*IOS开关控制
         * ios2 iosbtn2 存在时显示关闭样式
         * */
        $(function () {
            var ios = $(".ios");
            ios.click(function () {
                $(this).toggleClass("ios2");
                $(this).find('i.iosBtn').toggleClass("iosBtn2");
            });
        })

        initTimePlus();//初始化时间插件
    };
    template.dailyPanel = function (target, dailyTime, initTimePlus, switchArr) {
        var panel, start_day_arr, end_day_arr, start_month, start_day, end_month, end_day, open_time, close_time, i = 1, panel = '';
        if (dailyTime.length === 0) {
            for (i; i < 6; i++) {
                start_month = 0;
                start_day = 0;
                end_month = 0;
                end_day = 0;
                open_time = '00:00';
                close_time = '00:00';
                panel += template.buildDailyPanel(start_month, start_day, end_month, end_day, open_time, close_time, i);
            }
            panel += '<button type="button" class=" addSection" id="addSection">新增区间</button></div>';
        } else {
            for (i; i < 6; i++) {
                if (dailyTime[0]['start_' + i] !== '00-00') {
                    start_day_arr = dailyTime[0]['start_' + i].split('-');
                    end_day_arr = dailyTime[0]['end_' + i].split('-');
                    start_month = start_day_arr[0];
                    start_day = start_day_arr[1];
                    end_month = end_day_arr[0];
                    end_day = end_day_arr[1];
                    open_time = dailyTime[0]['open_' + i];
                    close_time = dailyTime[0]['close_' + i];
                    panel += template.buildDailyPanel(start_month, start_day, end_month, end_day, open_time, close_time, i);
                    template.addButton(switchArr);
                } else {
                    start_month = 0;
                    start_day = 0;
                    end_month = 0;
                    end_day = 0;
                    open_time = '00:00';
                    close_time = '00:00';
                    panel += template.buildDailyPanel(start_month, start_day, end_month, end_day, open_time, close_time, i);
                    template.addButton(switchArr);
                }
            }
            panel += '<button type="button" class="btn btn-default" id="addSection">新增区间</button></div>';
        }
        target.html(panel);
        initTimePlus();//初始化时间插件
    };
    template.buildDailyPanel = function (start_month, start_day, end_month, end_day, open_time, close_time, i) {
        var panel = '', section, display = '';
        switch (i) {
            case 1:
                section = '一';
                break;
            case 2:
                section = '二';
                break;
            case 3:
                section = '三';
                break;
            case 4:
                section = '四';
                break;
            case 5:
                section = '五';
                break;
        }
        if (start_month === 0 && i !== 1) {
            display = 'daily-hide'
        }
        if (start_month === end_month && start_day === end_day) {
            display = 'daily-hide'
        }
        panel += '<div class="input-group ' + display + '">' +
            '<label>区间' + section + ':</label>' +
            '<div class="row interval-' + i + '">' +
            '<label class="col-sm-2">开始日期:</label>' +
            '<select class="col-sm-1 startMonth daily-start">';
        for (var i_1 = 1; i_1 < 13; i_1++) {
            if (i_1 == start_month) {
                panel += '<option selected>' + i_1 + '</option>';
            } else {
                panel += '<option>' + i_1 + '</option>';
            }
        }
        panel += '</select><label class="col-sm-1">月</label>' +
            '<select class="col-sm-1 startDay daily-start">';
        for (var i_2 = 1; i_2 < 32; i_2++) {
            if (i_2 == start_day) {
                panel += '<option selected>' + i_2 + '</option>';
            } else {
                panel += '<option>' + i_2 + '</option>';
            }
        }
        panel += '</select>' +
            '<label class="col-sm-1">日</label>' +
            '<label class="col-sm-2">结束日期:</label>' +
            '<select class="col-sm-1 endMonth daily-end">';
        for (var i_3 = 1; i_3 < 13; i_3++) {
            if (i_3 == end_month) {
                panel += '<option selected>' + i_3 + '</option>';
            } else {
                panel += '<option>' + i_3 + '</option>';
            }
        }
        panel += '</select>' +
            '<label class="col-sm-1">月</label>' +
            '<select class="col-sm-1 endDay daily-end">';
        for (var i_4 = 1; i_4 < 32; i_4++) {
            if (i_4 == end_day) {
                panel += '<option selected>' + i_4 + '</option>';
            } else {
                panel += '<option>' + i_4 + '</option>';
            }
        }
        panel += '</select>' +
            '<label class="col-sm-1">日</label>' +
            '</div>' +
            '</div>' +
            '<div class="input-group ' + display + '">' +
            '<div class="row">' +
            '<label class="col-sm-2">开启时间:</label><input class="col-sm-2 openTime flatpickr" value="' + open_time + '">' +
            '<label class="col-sm-2" style="margin-left: 118px">关闭时间:</label><input class="col-sm-2 closeTime flatpickr" value="' + close_time + '" >' +
            '<button type="button" class="btn btn-default btn-xs delSection" style="margin-left: 14px">删除区间</button>' +
            '</div>' +
            '<div class="Daily_on_off_btn">' +
            '</div>' +
            '</div>';
        return panel;
    };
    return template;
});


