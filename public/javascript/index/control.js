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
        dialogTemplate:'javascript/index/template'//弹框模板
    },
    shim: {
        jquery: {exports: 'jquery'},
        dialog: {exports: 'dialog'},
        flatpickr: {exports: 'flatpickr'}

    }
});
require(['jquery', 'handlebars', 'dialog', 'flatpickr','dialogTemplate'], function ($, handlebars, dialog, flatpickr,dialogTemplate) {
    // some code here
    var nodeInfo = $('#nodeInfo').html();
    var template = handlebars.compile(nodeInfo);
    var switchPanel =dialogTemplate.switchPanel,
        weekPanel = dialogTemplate.weekPanel,
        dailyPanel = dialogTemplate.dailyPanel;
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
        if(name==='weekTime'){
            weekTime(id);
        }else{
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
                var result = template(data);
                $dailyTimeWrap.html(result);
            }
        });
    }
    //操作按钮
    $('body').on('click', '.btn-dialog', function () {
        var $this = $(this),
            id = $this.data('id'),
            relay=$(this).data('relay'),
            $content = '<div class="input-group"><label>id:</label><span>' + id + '</span></div>' +
                '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionWeek" value="0" checked>周模式</label>' +
                '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionDay" value="1">日模式</label>' +
                '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionDay" value="2" data-relay='+relay+'>开关控制</label>' +
                '<div class="control-content">' +
                '</div>',
            isGroupBtn=false;
        //判断是否是群发按钮
        if($this.hasClass('btn-project-group')){
            isGroupBtn=true;
        }
        var d = dialog({
            title: '消息',
            height:400,
            width:600,
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
                isGroupBtn?url=("/nodeControl/group/id/" + id):url=("/nodeControl/id/" + id);
                $('.flatpickr-wrapper').remove();
                if (type === '0') {
                    sendConfig({id: id, type: type, openTime: openTime, closeTime: closeTime},url);
                } else if(type === '1'){
                    dayArr = getDay();
                    startDay = dayArr.startDay.toString();
                    endDay = dayArr.endDay.toString();
                    sendConfig({
                        id: id,
                        type: type,
                        startDay: startDay,
                        endDay: endDay,
                        openTime: openTime,
                        closeTime: closeTime
                    },url);
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
                    sendConfig({
                        id: id,
                        type: type,
                        switchStatus:switchStatus
                    },url)
                }

            },
            onshow: function () {

                $('[name=optionsRadios]').on('click', function () {
                    var switchArr=[];
                    $('.flatpickr-wrapper').remove();
                    if ($(this).val() === '0') {
                        getWeekTimeConfigFromServer(id,$('.control-content'),weekPanel);
                    } else if($(this).val() === '1'){
                        getDailyTimeConfigFromServer(id,$('.control-content'),dailyPanel);
                    }else{
                        $.each($(this).data('relay').split(','),function (i,v) {
                            if(v==='关'){
                                switchArr.push(0)
                            }else{
                                switchArr.push(1)
                            }
                        });
                        $(".control-content").html(switchPanel(switchArr));
                    }

                });
                $('#optionWeek').click();
            },
            cancelValue: '取消'
        });

        d.show();
    });
    /**
     * 初始化时间控件
     */
    function initTimePlus() {
        $.each($('.flatpickr'), function (i, v) {
            new flatpickr(v, {
                enableTime: true,
                noCalendar: true,
                time_24hr:true,
                dateFormat:'H:i'
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
    function getWeekTimeConfigFromServer(equipId,panel,callback) {
        $.ajax({
            method: "GET",
            url: "/nodeControl/weekTime/"+equipId,
            dataType: "json",
            success: function (data) {
                callback(panel,data,initTimePlus);
            }
        });
    }
    /**
     * 从数据库获取日设置信息，方便操作的时候设置
     * @param equipId
     */
    function getDailyTimeConfigFromServer(equipId,panel,callback) {
        $.ajax({
            method: "GET",
            url: "/nodeControl/dailyTime/"+equipId,
            dataType: "json",
            success: function (data) {
                callback(panel,data,initTimePlus);
                getDay();
            }
        });
    }
    // 下发配置
    function sendConfig(data,url) {
        $.ajax({
            method: "POST",
            url: url,
            dataType: "json",
            data:data,
            success: function (data) {
                if(data.length){
                    var $content='<div>';
                    $.each(data,function (i,v) {
                        $content+='<p>'+v.equip_id+':'+(v.code===1?'下发配置成功':'下发配置失败')+'</p>'
                    });
                    dialog({
                        title:'信息',
                        content:$content
                    }).show();
                }else{
                    if(data.code===1){
                        dialog({
                            title:'信息',
                            content:'下发配置成功'
                        }).show();
                    }else{
                        dialog({
                            title:'信息',
                            content:'下发配置失败'
                        }).show();
                    }
                }

            }
        });
    }
});
