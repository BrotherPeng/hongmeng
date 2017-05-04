/**
 * Created by iqianjin-luming on 16/7/28.
 */
requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: 'jquery/dist/jquery',
        handlebars: 'handlebars/handlebars.amd.min',
        dialog: 'artDialog/dist/dialog-min',
        flatpickr: 'flatpickr/dist/flatpickr.min',
        dialogTemplate: 'javascript/index/template', //弹框模板
        io: 'socket.io-client/dist/socket.io.min'
    },
    shim: {
        jquery: { exports: 'jquery' },
        dialog: { exports: 'dialog' },
        flatpickr: { exports: 'flatpickr' },
        io: { exports: 'io' }

    }
});
require(['jquery', 'handlebars', 'dialog', 'flatpickr', 'dialogTemplate', 'io'], function($, handlebars, dialog, flatpickr, dialogTemplate, io) {
    // some code here
    var nodeInfo = $('#nodeInfo').html();
    var template = handlebars.compile(nodeInfo);
    var switchPanel = dialogTemplate.switchPanel,
        weekPanel = dialogTemplate.weekPanel,
        dailyPanel = dialogTemplate.dailyPanel;
    // weekSet = dialogTemplate.weekSet;
    var AutoRefresh = function() {
        this.autoArr = [];
        this.autoPanel = {};
        this.run();
    };
    AutoRefresh.prototype = {
        set: function(id, panel) {
            var self = this;
            self.autoArr.push(id);
            self.autoPanel[id] = panel;
        },
        get: function(id) {
            var self = this,
                has = false;
            $.each(self.autoArr, function(i, v) {
                if (v == id) {
                    has = true;
                    return;
                }
            });
            return has;
        },
        remove: function(id) {
            var self = this;
            $.each(self.autoArr, function(i, v) {
                if (v == id) {
                    self.autoArr.splice(i, 1);
                    self.autoPanel[id] = null;
                }
            })
        },
        run: function() {
            var self = this;
            $.each(self.autoArr, function(i, v) {
                self.render(v);
            });
            setTimeout(function() {
                self.run();
            }, 20000)
        },
        render: function(id) {
            var self = this;
            $.ajax({
                method: "GET",
                url: "/nodeControl/id",
                dataType: "json",
                data: { projectId: id },
                success: function(data) {
                    for (var i = 0; i < data.length; i++) {
                        if (!data[i]) {
                            continue;
                        } else {
                            data[i].shakeStatus = data[i].shakeStatus == '无' ? false : true;
                            data[i].gateStatus = data[i].gateStatus == '关' ? false : true;
                            if (data[i].relay[0] == '关') {
                                data[i].relay_0 = false;
                            } else {
                                data[i].relay_0 = true;
                            }
                            if (data[i].relay[1] == '关') {
                                data[i].relay_1 = false;
                            } else {
                                data[i].relay_1 = true;
                            }
                            if (data[i].relay[2] == '关') {
                                data[i].relay_2 = false;
                            } else {
                                data[i].relay_2 = true;
                            }
                            if (data[i].relay[3] == '关') {
                                data[i].relay_3 = false;
                            } else {
                                data[i].relay_3 = true;
                            }
                            if (data[i].relay[4] == '关') {
                                data[i].relay_4 = false;
                            } else {
                                data[i].relay_4 = true;
                            }
                            if (data[i].relay[5] == '关') {
                                data[i].relay_5 = false;
                            } else {
                                data[i].relay_5 = true;
                            }
                            if (data[i].relay[6] == '关') {
                                data[i].relay_6 = false;
                            } else {
                                data[i].relay_6 = true;
                            }
                            if (data[i].relay[7] == '关') {
                                data[i].relay_7 = false;
                            } else {
                                data[i].relay_7 = true;
                            }
                        }
                    }
                    var result = template(data);
                    self.autoPanel[id].html(result);
                }
            });
        }
    };
    var autoRefresh = new AutoRefresh();
    //下拉按钮单击事件，请求该项目下的所有设备
    $('body').on('click', '#projectId .project-up-down', function() {
        var $this = $(this),
            $li = $(this).parents('.list-group-item'),
            $tabpanel = $li.find('[role=tabpanel]'),
            $statusWrap = $li.find('.nodeInfoTable'),
            isShow = !$tabpanel.hasClass('fn-hide'),
            id = $li.data('id');

        if (isShow) {
            $tabpanel.addClass('fn-hide');
            $this.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            autoRefresh.remove(id);
            return;
        } else {
            $tabpanel.removeClass('fn-hide');
            $this.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }


        $.ajax({
            method: "GET",
            url: "/nodeControl/id",
            dataType: "json",
            data: { projectId: id },
            success: function(data) {
                console.log(data);
                var result = template(data);
                $statusWrap.html(result);
                autoRefresh.set(id, $statusWrap);
            }
        });
    });
    //请求周设置
    function weekTime(projectId) {
        var weekTimeTemp = $('#weekTime').html(),
            $weekTimeWrap = $('.weekTimeWrap'),
            template = handlebars.compile(weekTimeTemp);
        $.ajax({
            method: "GET",
            url: "/nodeControl/weekTime/id",
            dataType: "json",
            data: { projectId: projectId },
            success: function(data) {
                var result = template(data);
                $weekTimeWrap.html(result);
            }
        });
    }

    //请求日设置
    function dailyTime(projectId) {
        var dailyTimeTemp = $('#dailyTime').html(),
            $dailyTimeWrap = $('.dailyTimeWrap'),
            template = handlebars.compile(dailyTimeTemp);
        $.ajax({
            method: "GET",
            url: "/nodeControl/dailyTime/id",
            dataType: "json",
            data: { projectId: projectId },
            success: function(data) {
                for (var l = 0; l < data.length; l++) {
                    for (var ll = 2; ll < 6; ll++) {
                        if (data[l] && data[l]['start_' + ll] === '1-1' && data[l]['end_' + ll] === '1-1') {
                            data[l]['start_' + ll] = '无';
                            data[l]['end_' + ll] = '无';
                            data[l]['open_' + ll] = '无';
                            data[l]['close_' + ll] = '无';
                        }
                    }
                }

                var result = template(data);
                $dailyTimeWrap.html(result);
            }
        });
    }

    //查询按钮
    $('body').on('click', '.search-Btn-dialog', function() {

        var $this = $(this),
            id = $this.data('id'),
            $content =
            '<div>' +
            '<label>' +
            '<div class="control-weekDay-btn control-chosedBtn">周设置</div>' +
            '<input type=radio name="showModel" checked style="display: none" value="week">' +
            '</label>' +
            '<label>' +
            '<div class="control-weekDay-btn" style="margin-left: 20px">日设置</div>' +
            '<input type=radio name="showModel" style="display: none" value="day">' +
            '</label>' +
            '</div>' +
            '<div class="control-content">' +
            '<div id="showWeekSet" style="display: none">' +
            '<table class="table">' +
            '<tr class="active"><td>设备</td><td>周一</td><td>周二</td><td>周三</td><td>周四</td><td>周五</td><td>周六</td><td>周日</td></tr>';
        /**
         * 注释人：jimmy
         * 注释模块：查询设置显示
         * 时间：2017年4月25日17:14:43
         * QQ：2806446853
         * 内容： 
         *      1.将弹框分为3部分，并在方法中分别补充为完整元素
         *      2.通过ajax请求服务器数据，然后遍历获得数据
         *      3.将遍历获得数据分别添加入元素内部，并同时完善元素第二部分。
         *      4.当第一个ajax请求成功后，执行日模式ajax请求。
         *      5.将遍历获得数据分别添加入元素内部，并同时完善元素第三部分。
         *      6.当全部内容请求，并且填充完毕后，定义b变量，并为b变量赋值。
         *      7.通过b.show()显示弹框。完成查询设置显示。
         */
        $.ajax({
            method: "GET",
            url: "/nodeControl/weekTime/" + 'id?projectId=' + id,
            dataType: "json",
            success: function(data) {
                // console.log(data);
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        $content += '<tr class="text-center weekData"><td>' + data[i].equip_id + '</td><td>' + data[i].open_time_1 + ' - ' + data[i].close_time_1 + '</td><td>' + data[i].open_time_2 + ' - ' + data[i].close_time_2 + '</td><td>' + data[i].open_time_3 + ' - ' + data[i].close_time_3 + '</td><td>' + data[i].open_time_4 + ' - ' + data[i].close_time_4 + '</td><td>' + data[i].open_time_5 + ' - ' + data[i].close_time_5 + '</td><td>' + data[i].open_time_6 + ' - ' + data[i].close_time_6 + '</td><td>' + data[i].open_time_7 + ' - ' + data[i].close_time_7 + '</td></tr>'
                    }
                }
                $content += '</table>' +
                    '</div>' +
                    '<div id="showDaySet" style="display: none">' +
                    '<table class="table"><tr class="active"><td>设备</td><td>日期区间</td><td>开关时间</td></tr>';
                $.ajax({
                    method: "GET",
                    url: "/nodeControl/dailyTime/" + 'id?projectId=' + id,
                    dataType: "json",
                    success: function(data) {
                        for (var j = 0; j < data.length; j++) {
                            if (data[j]) {
                                $content += '<tr><td>' + data[j].equip_id + '</td><td>' + data[j].start_1 + ' ~ ' + data[j].end_1 + '</td><td>' + data[j].open_1 + ' - ' + data[j].close_1 + '</td></tr>' +
                                    '<tr><td><td>' + data[j].start_2 + ' ~ ' + data[j].end_2 + '</td><td>' + data[j].open_2 + ' - ' + data[j].close_2 + '</td></tr>' +
                                    '<tr><td><td>' + data[j].start_3 + ' ~ ' + data[j].end_3 + '</td><td>' + data[j].open_3 + ' - ' + data[j].close_3 + '</td></tr>' +
                                    '<tr><td><td>' + data[j].start_4 + ' ~ ' + data[j].end_4 + '</td><td>' + data[j].open_4 + ' - ' + data[j].close_4 + '</td></tr>' +
                                    '<tr><td><td>' + data[j].start_5 + ' ~ ' + data[j].end_5 + '</td><td>' + data[j].open_5 + ' - ' + data[j].close_5 + '</td></tr>';
                            }
                        }
                        $content += '</table></div></div>';
                        var d = dialog({
                            // title: '消息',
                            height: 400,
                            width: 550,
                            content: $content,
                            okValue: '配置',
                            cancel: '取消',
                            cancelValue: '取消',
                            onshow: function() {
                                //todo 展示默认信息
                                var showModel = $('[name=showModel]');
                                for (var i = 0; i < showModel.length; i++) {
                                    if (showModel[i].checked) {
                                        if (showModel[i].value == "week") {
                                            $("#showWeekSet").css("display", "block");
                                            $("#showDaySet").css("display", "none");
                                        } else {
                                            $("#showWeekSet").css("display", "none");
                                            $("#showDaySet").css("display", "block");
                                        }
                                    }
                                }
                                //todo 点击事件
                                showModel.on('click', function() {
                                    var arr = [1, 2, 3, 4, 5];
                                    for (var i = 0; i < arr.length; i++) {

                                    }
                                    $('.flatpickr-wrapper').remove();
                                    $(this).parent().siblings().children("div").removeClass("control-chosedBtn");
                                    $(this).siblings().addClass("control-chosedBtn");
                                    if ($(this).val() == 'week') {
                                        $("#showWeekSet").css("display", "block");
                                        $("#showDaySet").css("display", "none");
                                    } else {
                                        $("#showWeekSet").css("display", "none");
                                        $("#showDaySet").css("display", "block");
                                    }
                                });
                            }
                        });
                        d.show();
                    }
                });
            }
        });
    });
    //获取页面设置的开关时间并格式化
    function getTime() {
        var timeArr = {};
        timeArr['openTime'] = [];
        timeArr['closeTime'] = [];
        $.each($('.openTime'), function(i, v) {
            var _selectVal = $(v).val(),
                _selectArr = _selectVal.split(':'),
                h = _selectArr[0],
                m = _selectArr[1];
            timeArr['openTime'].push(h);
            timeArr['openTime'].push(m);
        });
        $.each($('.closeTime'), function(i, v) {
            var _selectVal = $(v).val(),
                _selectArr = _selectVal.split(':'),
                h = _selectArr[0],
                m = _selectArr[1];
            timeArr['closeTime'].push(h);
            timeArr['closeTime'].push(m);
        });
        return timeArr;
    }

    //获取页面的日设置
    function getDay() {
        var dayArr = {};
        dayArr['startDay'] = [];
        dayArr['endDay'] = [];
        $.each($('.ui-dialog-content .daily-start'), function(i, v) {
            dayArr['startDay'].push($(v).val());
        });
        $.each($('.ui-dialog-content .daily-end'), function(i, v) {
            dayArr['endDay'].push($(v).val());
        });
        return dayArr;
    }

    /**
     * 从数据库获取周设置信息，方便操作的时候设置
     * @param equipId
     */
    function getWeekTimeConfigFromServer(equipId, panel, callback, switchArr) {
        $.ajax({
            method: "GET",
            url: "/nodeControl/weekTime/" + equipId,
            dataType: "json",
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        data[i].week_conf = JSON.parse(data[i].week_conf);
                    }
                }
                console.log(data);
                callback(panel, data, initTimePlus, switchArr);
            }
        });
    }

    /**
     * 从数据库获取日设置信息，方便操作的时候设置
     * @param equipId
     */
    function getDailyTimeConfigFromServer(equipId, panel, callback, switchArr) {
        $.ajax({
            method: "GET",
            url: "/nodeControl/dailyTime/" + equipId,
            dataType: "json",
            success: function(data) {
                console.log(data);
                callback(panel, data, initTimePlus, switchArr);
                getDay();
            }
        });
    }

    //下发配置（周模式控制继电器版）
    function sendSocketConfig(data, url) {
        console.log(data);
        console.log(url);
    }

    /**
     * 监听websocket
     */
    // function listenOnWebSocekt() {
    //     // var socket = io('120.27.37.212:8082');
    //     var socket = io('127.0.0.1:8082');
    //     socket.on('onlineList', function(data) {
    //         if (!data) {
    //             return;
    //         }
    //         $.each($('#projectId').find('.list-group-item'), function() {
    //             if (data[$(this).data('id')]) {
    //                 $(this).find('.equip-online-num-b').html(data[$(this).data('id')]);
    //             } else {
    //                 $(this).find('.equip-online-num-b').html(0);
    //             }
    //         });
    //     });
    // }

    // listenOnWebSocekt();

});