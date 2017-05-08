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
        // run: function() {
        //     var self = this;
        //     $.each(self.autoArr, function(i, v) {
        //         self.render(v);
        //     });
        //     // setTimeout(function() {
        //     //     self.run();
        //     // }, 20000)
        // },
        render: function(id) {
            var self = this;
            $.ajax({
                method: "GET",
                url: "/nodeControl/id",
                dataType: "json",
                data: { projectId: id },
                success: function(data) {
                    console.log(data);
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
    //操作按钮
    $('body').on('click', '.btn-dialog', function() {
        var $this = $(this),
            id = $this.data('id'),
            relay = $(this).data('relay'),
            $content = '<div class="input-group">' + 
                '<img width="100%" height="400" src="http://pic2.ooopic.com/11/34/46/78b1OOOPIC4e.jpg">'+
            '</div>';
            console.log($this);
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
        console.log('更新图片');
    });
});