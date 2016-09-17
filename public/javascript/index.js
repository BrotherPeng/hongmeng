/**
 * Created by iqianjin-luming on 16/7/28.
 */
requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: 'jquery/dist/jquery',
        handlebars: 'handlebars/handlebars.amd.min',
        dialog: 'artDialog/dist/dialog-min',
        flatpickr: 'flatpickr/dist/flatpickr.min'
    },
    shim: {
        jquery: {exports: 'jquery'},
        dialog: {exports: 'dialog'},
        flatpickr: {exports: 'flatpickr'}

    }
});
require(['jquery', 'handlebars', 'dialog', 'flatpickr'], function ($, handlebars, dialog, flatpickr) {
    // some code here
    var nodeInfo = $('#nodeInfo').html();
    var template = handlebars.compile(nodeInfo);
    $('body').on('click', '#projectId .project-up-down', function () {
        var $this = $(this),
            $li = $(this).parents('.list-group-item'),
            $tabpanel = $li.find('[role=tabpanel]'),
            $statusWrap = $li.find('.nodeInfoWrap'),
            isShow = !$tabpanel.hasClass('fn-hide'),
            id = $li.data('id');

        if (isShow) {
            $tabpanel.addClass('fn-hide');
            $this.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
        } else {
            $tabpanel.removeClass('fn-hide');
            $this.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up')
        }


        $.ajax({
            method: "GET",
            url: "/nodeControl/id",
            dataType: "json",
            data: {projectId: id},
            success: function (data) {
                var result = template(data);
                $statusWrap.html(result);
            }
        });
    });

    $('body').on('click', '[role=presentation]', function () {
        var $this = $(this),
            $tab = $this.parents('[role=tabpanel]'),
            $presentation = $tab.find('[role=presentation]'),
            $tabcontent = $tab.find('.tab-content'),
            $tabpanel = $tabcontent.find('.tab-pane'),
            name = $this.find('a').attr('aria-controls'),
            $panel = $tabcontent.find('.' + name),
            id = $this.parents('.list-group-item').data('id');
        $presentation.removeClass('active');
        $this.addClass('active');
        $tabpanel.hide();
        if(name==='weekTime'){
            weekTime(id);
        }else{
            dailyTime(id);
        }
        $panel.show();
    });

    function weekTime(projectId) {
        var weekTimeTemp = $('#weekTime').html(),
            $weekTimeWrap = $('.weekTimeWrap'),
            template = handlebars.compile(weekTimeTemp);
        $.ajax({
            method: "GET",
            url: "/nodeControl/weekTime/id",
            dataType: "json",
            data: {projectId: projectId},
            success: function (data) {
                var result = template(data);
                $weekTimeWrap.html(result);
            }
        });
    }

    function dailyTime(projectId) {
        var dailyTimeTemp = $('#dailyTime').html(),
            $dailyTimeWrap = $('.dailyTimeWrap'),
            template = handlebars.compile(dailyTimeTemp);
        $.ajax({
            method: "GET",
            url: "/nodeControl/dailyTime/id",
            dataType: "json",
            data: {projectId: projectId},
            success: function (data) {
                var result = template(data);
                $dailyTimeWrap.html(result);
            }
        });
    }

    $('body').on('click', '.btn-dialog', function () {
        var $this = $(this),
            id = $this.data('id'),
            swichPanel = '<div class="btn-group" data-toggle="buttons">' +
                '<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器1</label>' +
                '<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器2</label>' +
                '<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器3</label>' +
                '<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器4</label>' +
                '<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器5</label>' +
                '<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器6</label>' +
                '<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器7</label>' +
                '<label class="btn btn-success btn-switch"><input type="checkbox" autocomplete="off" checked/>继电器8</label>' +
                '</div>',
            weekPanel = '<div class="input-group"><label>周一:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3 openTime flatpickr" value="19:30">' +
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
                '<label class="col-sm-2">关闭时间:</label><input class="col-sm-3 closeTime flatpickr" value="06:30"></div>',
            dailyPanel = '<div class="input-group">' +
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
                '</div>',
            $content = '<div class="input-group"><label>id:</label><span>' + id + '</span></div>' +
                '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionWeek" value="0" checked>周模式</label>' +
                '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionDay" value="1">日模式</label>' +
                '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionDay" value="2">开关控制</label>' +
                '<div class="control-content">' +
                weekPanel +
                '</div>';
        var d = dialog({
            title: '消息',
            content: $content,
            okValue: '确 定',
            ok: function () {
                var type = $('[type=radio]:checked').val(),
                    timeArr = getTime(),
                    dayArr,
                    openTime = timeArr.openTime.toString(),
                    closeTime = timeArr.closeTime.toString(),
                    startDay,
                    endDay,
                    $switch=$('.btn-switch'),
                    switchStatus='';
                $('.flatpickr-wrapper').remove();
                if (type === '0') {
                    $.ajax({
                        method: "POST",
                        url: "/nodeControl/id/" + id,
                        dataType: "json",
                        data: {id: id, type: type, openTime: openTime, closeTime: closeTime},
                        success: function (data) {
                            return false;
                        }
                    });
                } else if(type === '1'){
                    dayArr = getDay();
                    startDay = dayArr.startDay.toString();
                    endDay = dayArr.endDay.toString();
                    $.ajax({
                        method: "POST",
                        url: "/nodeControl/id/" + id,
                        dataType: "json",
                        data: {
                            id: id,
                            type: type,
                            startDay: startDay,
                            endDay: endDay,
                            openTime: openTime,
                            closeTime: closeTime
                        },
                        success: function (data) {
                            return false;
                        }
                    });
                }else {
                    $.each($switch,function (i,v) {
                        if($(v).hasClass('active')){
                            switchStatus+='0';
                        }else{
                            switchStatus+='1';
                        }
                    })
                    switchStatus=parseInt(switchStatus,2);
                    switchStatus=switchStatus.toString(16);
                    $.ajax({
                        method: "POST",
                        url: "/nodeControl/id/" + id,
                        dataType: "json",
                        data: {
                            id: id,
                            type: type,
                            switchStatus:switchStatus
                        },
                        success: function (data) {
                            return false;
                        }
                    });
                }

            },
            onshow: function () {
                $.each($('.flatpickr'), function (i, v) {
                    new flatpickr(v, {
                        enableTime: true,
                        noCalendar: true
                    });
                });
                $('[name=optionsRadios]').on('click', function () {
                    $('.flatpickr-wrapper').remove();
                    if ($(this).val() === '0') {
                        $(".control-content").html(weekPanel);
                    } else if($(this).val() === '1'){
                        $(".control-content").html(dailyPanel);
                    }else{
                        $(".control-content").html(swichPanel);
                    }
                    $.each($('.flatpickr'), function (i, v) {
                        new flatpickr(v, {
                            enableTime: true,
                            noCalendar: true
                        });
                    });
                    $.each($('.flatpickrDay'), function (i, v) {
                        new flatpickr(v, {
                            dateFormat: 'm/d'
                        });
                    });
                });
            },
            cancelValue: '取消'
        });

        d.show();
    });
    function getTime() {
        var timeArr = {};
        timeArr['openTime'] = [];
        timeArr['closeTime'] = [];
        $.each($('.openTime'), function (i, v) {
            var _selectVal = $(v).val(),
                _selectArr = _selectVal.split(':'),
                h = _selectArr[0],
                m = _selectArr[1].split(' ')[0],
                apm = _selectArr[1].split(' ')[1];
            if (apm === 'PM') {
                h = 12 + Number(h);
            }
            timeArr['openTime'].push(h);
            timeArr['openTime'].push(m);
        });
        $.each($('.closeTime'), function (i, v) {
            var _selectVal = $(v).val(),
                _selectArr = _selectVal.split(':'),
                h = _selectArr[0],
                m = _selectArr[1].split(' ')[0],
                apm = _selectArr[1].split(' ')[1];
            if (apm === 'PM') {
                h = 12 + Number(h);
            }
            timeArr['closeTime'].push(h);
            timeArr['closeTime'].push(m);
        });
        return timeArr;
    }

    function getDay() {
        var dayArr = {};
        dayArr['startDay'] = [];
        dayArr['endDay'] = [];
        $.each($('.startDay'), function (i, v) {
            var _selectVal = $(v).val();
            if (_selectVal) {
                var startArr = ($(v).val()).split('\/');
                dayArr['startDay'].push(startArr[0]);
                dayArr['startDay'].push(startArr[1]);
            }
        });
        $.each($('.endDay'), function (i, v) {
            var _selectVal = $(v).val();
            if (_selectVal) {
                var endArr = ($(v).val()).split('\/');
                dayArr['endDay'].push(endArr[0]);
                dayArr['endDay'].push(endArr[1]);
            }
        });
        return dayArr;
    }
});
