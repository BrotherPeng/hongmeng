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
        dialogTemplate: 'javascript/index/template',//弹框模板
        io: 'socket.io-client/dist/socket.io.min'
    },
    shim: {
        jquery: {exports: 'jquery'},
        dialog: {exports: 'dialog'},
        flatpickr: {exports: 'flatpickr'},
        io: {exports: 'io'}

    }
});
require(['jquery', 'handlebars', 'dialog', 'flatpickr', 'dialogTemplate', 'io'], function ($, handlebars, dialog, flatpickr, dialogTemplate, io) {
    // some code here
    var nodeInfo = $('#nodeInfo').html();
    var template = handlebars.compile(nodeInfo);
    var switchPanel = dialogTemplate.switchPanel,
        weekPanel = dialogTemplate.weekPanel,
        dailyPanel = dialogTemplate.dailyPanel;
    // weekSet = dialogTemplate.weekSet;
    var AutoRefresh = function () {
        this.autoArr = [];
        this.autoPanel = {};
        this.run();
    };
    AutoRefresh.prototype = {
        set: function (id, panel) {
            var self = this;
            self.autoArr.push(id);
            self.autoPanel[id] = panel;
        },
        get: function (id) {
            var self = this,
                has = false;
            $.each(self.autoArr, function (i, v) {
                if (v == id) {
                    has = true;
                    return;
                }
            });
            return has;
        },
        remove: function (id) {
            var self = this;
            $.each(self.autoArr, function (i, v) {
                if (v == id) {
                    self.autoArr.splice(i, 1);
                    self.autoPanel[id] = null;
                }
            })
        },
        run: function () {
            var self = this;
            $.each(self.autoArr, function (i, v) {
                self.render(v);
            });
            setTimeout(function () {
                self.run();
            }, 20000)
        },
        render: function (id) {
            var self = this;
            $.ajax({
                method: "GET",
                url: "/nodeControl/id",
                dataType: "json",
                data: {projectId: id},
                success: function (data) {
                    var result = template(data);
                    self.autoPanel[id].html(result);
                }
            });
        }
    };
    var autoRefresh = new AutoRefresh();
    //下拉按钮单击事件，请求该项目下的所有设备
    $('body').on('click', '#projectId .project-up-down', function () {
        var $this = $(this),
            $li = $(this).parents('.list-group-item'),
            $tabpanel = $li.find('[role=tabpanel]'),
            $statusWrap = $li.find('.nodeInfoWrap'),
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
            data: {projectId: id},
            success: function (data) {
                var result = template(data);
                $statusWrap.html(result);
                autoRefresh.set(id, $statusWrap);
            }
        });
    });
    //设备查看tab页切换
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
        if (name === 'weekTime') {
            weekTime(id);
        } else {
            dailyTime(id);
        }
        $panel.show();
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
            data: {projectId: projectId},
            success: function (data) {
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
            data: {projectId: projectId},
            success: function (data) {
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

    //操作按钮
    $('body').on('click', '.btn-dialog', function () {
        var $this = $(this),
            id = $this.data('id'),
            relay = $(this).data('relay'),
            $content = '<div class="input-group"><label>id:</label><span>' + id + '</span></div>' +
                //'<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionWeek" value="0" checked>周模式</label>' +
                '<label class="radio-inline">' +
                '<input type="radio" name="optionsRadios" id="optionWeek" value="0" data-relay=' + relay + ' checked>周模式</label>' +
                '<label class="radio-inline" id="optionsRadios_label">' +
                '<input type="radio" name="optionsRadios" id="optionDay" value="1" data-relay=' + relay + '>日模式</label>' +
                '<label class="radio-inline">' +
                '<input type="radio" name="optionsRadios" id="optionSwitch" value="2" data-relay=' + relay + '>开关控制</label>' +
                '<div class="control-content">' +
                '</div>',
            isGroupBtn = false;
        //判断是否是群发按钮
        if ($this.hasClass('btn-project-group')) {
            isGroupBtn = true;
        }
        var d = dialog({
            title: '消息',
            height: 400,
            width: 550,
            content: $content,
            okValue: '配置',
            cancel: '取消',
            ok: function () {
                var type = $('[type=radio]:checked').val(),
                    timeArr = getTime(),
                    dayArr,
                    openTime = timeArr.openTime.toString(),
                    closeTime = timeArr.closeTime.toString(),
                    startDay,
                    endDay,
                    $switch = $('.btn-switch'),
                    switchStatus = '';
                if (!confirm("是否下发配置？")) {
                    return false;
                }
                isGroupBtn ? url = ("/nodeControl/group/id/" + id) : url = ("/nodeControl/id/" + id);
                $('.flatpickr-wrapper').remove();
                if (type === '0') {
                    // console.log(type)
                    var socketArr1 = [];
                    var socketArr2 = [];
                    var socketArr3 = [];
                    var socketArr4 = [];
                    var socketArr5 = [];
                    var socketArr6 = [];
                    var socketArr7 = [];
                    var ios = $(".ios");
                    var weekNum = document.getElementsByClassName("weekNum");
                    for (var i = 0; i < weekNum.length; i++) {
                        if (weekNum[i].innerHTML == i + 1) {
                            var btns = weekNum[i].parentNode.childNodes[3].childNodes;
                            for (var j = 0; j < btns.length; j++) {
                                var btnStatus = btns[j].childNodes[1].childNodes[1].innerHTML;
                                switch (i) {
                                    case 0:
                                        socketArr1.unshift(btnStatus);
                                        break;
                                    case 1:
                                        socketArr2.unshift(btnStatus);
                                        break;
                                    case 2:
                                        socketArr3.unshift(btnStatus);
                                        break;
                                    case 3:
                                        socketArr4.unshift(btnStatus);
                                        break;
                                    case 4:
                                        socketArr5.unshift(btnStatus);
                                        break;
                                    case 5:
                                        socketArr6.unshift(btnStatus);
                                        break;
                                    case 6:
                                        socketArr7.unshift(btnStatus);
                                        break;
                                }
                            }
                        }
                    }
                    var btnState = new Object();
                    btnState.week1 = socketArr1.join("");
                    btnState.week2 = socketArr2.join("");
                    btnState.week3 = socketArr3.join("");
                    btnState.week4 = socketArr4.join("");
                    btnState.week5 = socketArr5.join("");
                    btnState.week6 = socketArr6.join("");
                    btnState.week7 = socketArr7.join("");
                    // console.log(btnState);
                    // console.log(JSON.stringify(btnState));
                    sendConfig({
                        id: id,
                        type: type,
                        openTime: openTime,
                        closeTime: closeTime,
                        btnState: JSON.stringify(btnState)
                    }, url)
                }
                else if (type === '1') {
                    dayArr = getDay();
                    startDay = dayArr.startDay.toString();
                    endDay = dayArr.endDay.toString();
                    var Daily_on_off_btn = document.getElementsByClassName("Daily_on_off_btn");
                    var sectionNum = document.getElementsByClassName("sectionNum");
                    var sectionSocketArr1 = [];
                    var sectionSocketArr2 = [];
                    var sectionSocketArr3 = [];
                    var sectionSocketArr4 = [];
                    var sectionSocketArr5 = [];
                    for (var k = 0; k < Daily_on_off_btn.length; k++) {
                        if (!Daily_on_off_btn[k].hasChildNodes()) {//判断用户是否添加区间
                            alert("下发失败，请添加区间");
                            return;
                        }
                    }
                    for (var k1 = 0; k1 < sectionNum.length; k1++) {
                        if (sectionNum[k1].innerHTML == k1 + 1) {
                            var sectionBtns = sectionNum[k1].parentNode.nextElementSibling.childNodes[1].childNodes;
                            for (var k2 = 0; k2 < sectionBtns.length; k2++) {
                                var sectionBtnStatus = sectionBtns[k2].childNodes[1].childNodes[1].innerHTML;
                                switch (k1) {
                                    case 0:
                                        sectionSocketArr1.unshift(sectionBtnStatus);
                                        break;
                                    case 1:
                                        sectionSocketArr2.unshift(sectionBtnStatus);
                                        break;
                                    case 2:
                                        sectionSocketArr3.unshift(sectionBtnStatus);
                                        break;
                                    case 3:
                                        sectionSocketArr4.unshift(sectionBtnStatus);
                                        break;
                                    case 4:
                                        sectionSocketArr5.unshift(sectionBtnStatus);
                                        break;
                                }
                            }
                        }
                    }
                    var sectionBtnState = new Object();
                    sectionBtnState.section1 = sectionSocketArr1.join("");
                    sectionBtnState.section2 = sectionSocketArr2.join("");
                    sectionBtnState.section3 = sectionSocketArr3.join("");
                    sectionBtnState.section4 = sectionSocketArr4.join("");
                    sectionBtnState.section5 = sectionSocketArr5.join("");
                    // console.log(sectionBtnState);


                    sendConfig({
                        id: id,
                        type: type,
                        startDay: startDay,
                        endDay: endDay,
                        openTime: openTime,
                        closeTime: closeTime,
                        btnState: JSON.stringify(sectionBtnState)
                    }, url);
                }
                else {//type==2
                    $.each($switch, function (i, v) {
                        if ($(v).hasClass('active')) {//判断开关控制的开关状态
                            switchStatus = '0' + switchStatus;
                        } else {
                            switchStatus = '1' + switchStatus;
                        }
                    })
                    switchStatus = parseInt(switchStatus, 2);
                    switchStatus = switchStatus.toString(16);
                    // console.log(switchStatus)
                    sendConfig({
                        id: id,
                        type: type,
                        switchStatus: switchStatus
                    }, url)
                }

            },
            onshow: function () {

                $('[name=optionsRadios]').on('click', function () {
                    var switchArr = [];
                    $('.flatpickr-wrapper').remove();
                    // console.log($(this))
                    if ($(this).val() === '0') {
                        /*先获得switchArr*/
                        $.each($(this).data('relay').split(','), function (i, v) {
                            if (v === '关') {
                                switchArr.push(0)
                            } else {
                                switchArr.push(1)
                            }
                        });
                        //getWeekTimeConfigFromServer(id, $('.control-content'), weekPanel);
                        getWeekTimeConfigFromServer(id, $('.control-content'), weekPanel, switchArr);
                    } else if ($(this).val() === '1') {
                        /*先获得switchArr*/
                        $.each($(this).data('relay').split(','), function (i, v) {
                            if (v === '关') {
                                switchArr.push(0)
                            } else {
                                switchArr.push(1)
                            }
                        });
                        getDailyTimeConfigFromServer(id, $('.control-content'), dailyPanel, switchArr);
                    } else {
                        /*switchArr初始化*/
                        switchArr = []
                        // console.log($(this).data())

                        $.each($(this).data('relay').split(','), function (i, v) {
                            if (v === '关') {
                                switchArr.push(0)
                            } else {
                                switchArr.push(1)
                            }
                        });

                        //开关控制
                        $(".control-content").html(switchPanel(switchArr));
                        var on_off_btn = $(".on_off_btn");
                        on_off_btn.click(function () {
                            if ($(this).hasClass("active")) {
                                $(this).children('span').html("on");
                            } else {
                                $(this).children('span').html("off");
                            }

                        });
                    }

                });
                $('#optionWeek').click();
            },
            cancelValue: '取消'
        });

        d.show();
    });
    //查询按钮
    $('body').on('click', '.search-Btn-dialog', function () {
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
                '<div id="showWeekSet" style="display: none">周设置展示</div>' +
                '<div id="showDaySet" style="display: none">日设置展示</div>' +
                '</div>',
            d = dialog({
                // title: '消息',
                height: 400,
                width: 550,
                content: $content,
                okValue: '配置',
                cancel: '取消',
                cancelValue: '取消',
                // showBtn:function(){
                //
                // },
                onshow: function () {
                    //todo 展示默认信息
                    var showModel = $('[name=showModel]');
                    for (var i = 0; i < showModel.length; i++) {
                        // console.log(showModel[i])
                        if (showModel[i].checked) {
                            // console.log(showModel[i]);
                            if(showModel[i].value == "week"){
                                // console.log("week")
                                $("#showWeekSet").css("display","block");
                                $("#showDaySet").css("display","none");
                            }else{
                                // console.log("day")
                                $("#showWeekSet").css("display","none");
                                $("#showDaySet").css("display","block");
                            }
                        }
                    }
                    //todo 点击事件
                    showModel.on('click', function () {
                        $('.flatpickr-wrapper').remove();
                        if ($(this).val() == 'week') {
                            // getWeekTimeConfigFromServer(id, $('.control-content'), weekSet);
                        }
                    });
                }
            });
        d.show();
    });
    //日设置添加、删除区间事件
    $('body').on('click', '#addSection', function () {
        var switchArr = [];
        /*先获得switchArr*/
        var data_int = $(this).parent().parent().children('label#optionsRadios_label').children('input');
        $.each(data_int.data('relay').split(','), function (i, v) {
            if (v === '关') {
                switchArr.push(0)
            } else {
                switchArr.push(1)
            }
        });
        /*生成继电器开关*/
        var onOffBtn = "";
        var Daily_on_off_btn = $(".Daily_on_off_btn");
        for (var j = 0; j < switchArr.length; j++) {
            if (switchArr[j] == 0) {
                onOffBtn +=
                    '<div style="display: inline-block;text-align: center;margin: 10px 10px 0 0">' +
                    '<div style="font-size: 12px;color: #6f6c6c">' + "继电器" + (j + 1) + '</div>' +
                    '<div class="ios ios2">' +
                    '<i class="iosBtn iosBtn2"></i>' +
                    '<i class="openSta" style="display: none">' + 0 + '</i>' +
                    '</div>' +
                    '</div>';
            } else {
                onOffBtn +=
                    '<div style="display: inline-block;text-align: center;margin: 10px 10px 0 0">' +
                    '<div style="font-size: 12px;color: #6f6c6c">' + "继电器" + (j + 1) + '</div>' +
                    '<div class="ios iosOpen">' +
                    '<i class="iosBtn"></i>' +
                    '<i class="openSta" style="display: none">' + 1 + '</i>' +
                    '</div>' +
                    '</div>';
            }
            Daily_on_off_btn.html(onOffBtn);
        }
        /*IOS开关控制(日模式)
         * ios2 iosbtn2 存在时显示关闭样式 iosOpen表示继电器开关：开
         * */
        $(function () {
            var ios = $(".ios");
            ios.click(function () {
                $(this).toggleClass("ios2 iosOpen");
                $(this).find('i.iosBtn').toggleClass("iosBtn2 iosOpen");
                if ($(this).find('i.openSta').html() == 0) {
                    $(this).find('i.openSta').html(1)
                } else {
                    $(this).find('i.openSta').html(0)
                }
            });
        })

        var $hide = $('.control-content .daily-hide'),
            $delSection = $('.control-content .delSection'),
            hideNum = $hide.length;
        if (hideNum === 0)return;

        $delSection.hide().eq(5 - hideNum / 2).show();
        $hide.eq(0).removeClass('daily-hide');
        $hide.eq(1).removeClass('daily-hide');
    });
    $('body').on('click', '.delSection', function () {
        var $hide = $('.control-content .daily-hide'),
            $delSection = $('.control-content .delSection'),
            hideNum = $hide.length;
        $(this).parent().find('.flatpickr').val('00:00');
        $(this).parents('.input-group').prev().find('select').val(1);
        if (hideNum === 8)return;
        $(this).parents('.input-group').addClass('daily-hide');
        $(this).parents('.input-group').prev().addClass('daily-hide');
        $delSection.eq(3 - hideNum / 2).show();
    });
    /**
     * 初始化时间控件
     */
    function initTimePlus() {
        $.each($('.flatpickr'), function (i, v) {
            new flatpickr(v, {
                enableTime: true,
                noCalendar: true,
                time_24hr: true,
                dateFormat: 'H:i'
            });
        });
    }

    //获取页面设置的开关时间并格式化
    function getTime() {
        var timeArr = {};
        timeArr['openTime'] = [];
        timeArr['closeTime'] = [];
        $.each($('.openTime'), function (i, v) {
            var _selectVal = $(v).val(),
                _selectArr = _selectVal.split(':'),
                h = _selectArr[0],
                m = _selectArr[1];
            timeArr['openTime'].push(h);
            timeArr['openTime'].push(m);
        });
        $.each($('.closeTime'), function (i, v) {
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
        $.each($('.ui-dialog-content .daily-start'), function (i, v) {
            dayArr['startDay'].push($(v).val());
        });
        $.each($('.ui-dialog-content .daily-end'), function (i, v) {
            dayArr['endDay'].push($(v).val());
        });
        return dayArr;
    }

    /**
     * 从数据库获取周设置信息，方便操作的时候设置
     * @param equipId
     */
    //function getWeekTimeConfigFromServer(equipId, panel, callback) {
    function getWeekTimeConfigFromServer(equipId, panel, callback, switchArr) {
        $.ajax({
            method: "GET",
            url: "/nodeControl/weekTime/" + equipId,
            dataType: "json",
            success: function (data) {
                console.log(data)
                //callback(panel, data, initTimePlus);
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
            success: function (data) {
                callback(panel, data, initTimePlus, switchArr);
                getDay();
            }
        });
    }

    // 下发配置
    function sendConfig(data, url) {
        // console.log(data);
        // console.log(url);
        $.ajax({
            method: "POST",
            url: url,
            dataType: "json",
            data: data,
            success: function (data) {
                if (data.length) {
                    var $content = '<div>';
                    $.each(data, function (i, v) {
                        $content += '<p>' + v.equip_id + ':' + (v.code === 1 ? '下发配置成功' : '下发配置失败') + '</p>'
                    });
                    dialog({
                        title: '信息',
                        content: $content
                    }).show();
                } else {
                    if (data.code === 1) {
                        dialog({
                            title: '信息',
                            content: '下发配置成功'
                        }).show();
                    } else {
                        dialog({
                            title: '信息',
                            content: '下发配置失败'
                        }).show();
                    }
                }

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
    function listenOnWebSocekt() {
        var socket = io('120.27.37.212:8082');
        socket.on('onlineList', function (data) {
            if (!data) {
                return;
            }
            $.each($('#projectId').find('.list-group-item'), function () {
                if (data[$(this).data('id')]) {
                    $(this).find('.equip-online-num-b').html(data[$(this).data('id')])
                } else {
                    $(this).find('.equip-online-num-b').html(0)
                }
            });
        });
    }

    // listenOnWebSocekt();

});

