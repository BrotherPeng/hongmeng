/**
 * Created by iqianjin-luming on 16/7/28.
 */
requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: 'jquery/dist/jquery',
        handlebars:'handlebars/handlebars.amd.min',
        dialog:'artDialog/dist/dialog-min'
    },
    shim: {
        jquery: { exports: 'jquery' },
        dialog: { exports: 'dialog'}
    }
});
require(['jquery','handlebars','dialog'], function ($,handlebars,dialog){
    // some code here
    var nodeInfo = $('#nodeInfo').html();
    var template = handlebars.compile(nodeInfo);
    $('body').on('click','#projectId li',function () {
        var $this=$(this),
            $showDetail=$('.showNodeDetail'),
            $detail=$('.showNodeDetail .table-responsive'),
            id=$this.data('id'),
            isShow = $this.hasClass('showNodeDetail');

        $showDetail.removeClass('showNodeDetail');
        if(isShow){
            $detail.hide();
            return;
        }

        $this.addClass('showNodeDetail');

        $.ajax({
            method: "GET",
            url: "/nodeControl/id",
            dataType: "json",
            data:{projectId:id},
            success: function (data) {
                var result = template(data);
                $('.showNodeDetail .nodeInfoWrap').html(result);
                $('.showNodeDetail .table-responsive').show();
            }
        });
    })

    $('body').on('click','.btn',function () {
        var $this=$(this),
            id = $this.data('id'),
            timeConfig=$this.data('timeconfig'),
            $content='<div class="input-group"><label>id:</label><span>'+id+'</span></div>' +
                '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionWeek" value="0" checked>周模式</label>' +
                '<label class="radio-inline"><input type="radio" name="optionsRadios" id="optionDay" value="1">日模式</label>' +
                '<div class="input-group"><label>周一:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3"></div>' +
                '<div class="input-group"><label>周二:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3"></div>' +
                '<div class="input-group"><label>周三:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3"></div>' +
                '<div class="input-group"><label>周四:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3"></div>' +
                '<div class="input-group"><label>周五:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3"></div>' +
                '<div class="input-group"><label>周六:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3"></div>' +
                '<div class="input-group"><label>周日:</label><div class="row"><label class="col-sm-2">开启时间:</label><input class="col-sm-3"><label class="col-sm-2">关闭时间:</label><input class="col-sm-3"></div>' +
                '<div class="input-group"></div>';

        var d = dialog({
            title: '消息',
            content: $content,
            okValue: '确 定',
            ok: function () {
                $.ajax({
                    method: "POST",
                    url: "/nodeControl/id/"+id,
                    dataType: "json",
                    success: function (data) {
                        return false;
                    }
                });
            },
            cancelValue: '取消'
        });

        d.show();
    })
});
