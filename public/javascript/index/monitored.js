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
    // console.log(nodeInfo);
    var template = handlebars.compile(nodeInfo);
    var switchPanel = dialogTemplate.switchPanel,
        weekPanel = dialogTemplate.weekPanel,
        dailyPanel = dialogTemplate.dailyPanel;
    // weekSet = dialogTemplate.weekSet;
    var AutoRefresh = function() {
        this.autoArr = [];
        this.autoPanel = {};
        // this.run();
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
                url: "/camera/id",
                dataType: "json",
                data: { projectId: id },
                success: function(data) {
                    console.log(data);
                    var result = template(data.result);
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
            url: "/camera/id",
            dataType: "json",
            data: { projectId: id },
            success: function(data) {
                console.log(data);
                var result = template(data.result);
                $statusWrap.html(result);
                autoRefresh.set(id, $statusWrap);
            }
        });
    });
    //操作按钮
    $('body').on('click', '.btn-dialog', function() {
        // alert(111);
        // console.log($(this).siblings()[0].src);
        var $this = $(this),
            id = $this.data('id'),
            relay = $(this).data('relay'),
            $content = '<div class="input-group">' + 
                '<img width="100%" height="400" src="'+ $(this).siblings()[0].src +'">'+
            '</div>';
            // console.log($this);
        var d = dialog({
            title: ' ',
            height: 400,
            width: 550,
            content: $content,
            // cancel: '确定',
            // cancelValue: '确111定'
        });

        d.show();
    });
    //查询按钮
    $('body').on('click', '.search-Btn-dialog', function() {
        console.log($(this).attr('data-id'));
        console.log('更新图片');
        var id = $(this).attr('data-id');
        var equip_id = $(this).attr('equip-id');
        socket.emit('refreshImg', {cameraId: id, equip_id: equip_id}); //刷新图片
        /*$.ajax({
            method: "GET",
            url: "/camera/refresh",
            dataType: "json",
            data: { cameraId: id },
            success: function(data) {
                console.log(data);
                $('#cameraImg' + id).attr({src: data.picture});
                $('#pic' + id).html(data.pic_time);
            }
        });*/
    });

    var socket;
    function listenOnWebSocekt() {
        // var socket = io('120.27.37.212:8082');
        socket = io('127.0.0.1:8082');
        socket.on('socketIds', function(data) {
            if (!data) {
                return;
            }
            var obj = {};
            for(var i=0; i<data.length; i++){ //转换成项目id：设备在线数量
                obj[data[i].project_id] = data[i].count;
                $('#' + data[i].equip_id).css({color: '#00EE00', fontWeight: 700});
            }
            console.log(data);
            $.each($('#projectId').find('.list-group-item'), function() {
                if (obj[$(this).data('id')]) {
                    $(this).find('.equip-online-num-b').html(obj[$(this).data('id')]);
                } else {
                    $(this).find('.equip-online-num-b').html(0);
                }
            });
        });

        socket.on('newImgUrl', function (data) {
            console.log('#######更新图片#######');
            console.log(data);
            var equip_id = data.id;
            $('#cameraImg' + equip_id).attr({src: data.url});
            $('#pic' + equip_id).html(new Date().Format("yyyy.MM.dd hh:mm:ss"));
        });
    }
    listenOnWebSocekt();

});

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}