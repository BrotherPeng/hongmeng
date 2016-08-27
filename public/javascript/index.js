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
    $.ajax({
        method: "GET",
        url: "/nodeControl/id",
        dataType: "json",
        data:{projectId:$('#projectId').val()},
        success: function (data) {
            var result = template(data);
            $('#nodeInfoWrap').append(result);
        }
    });
    $('body').on('click','.btn',function () {
        var $this=$(this),
            id = $this.data('id'),
            timeConfig=$this.data('timeconfig'),
            $content='<div class="input-group"><label>id:</label><span>'+id+'</span></div>' +
                '<div class="input-group"><label>时间控制模式:</label><input class="form-control" value="'+timeConfig+'"></div>' +
                '<div class="input-group"><label>开启时间:</label><input class="form-control"></div>' +
                '<div class="input-group"><label>结束时间:</label><input class="form-control"></div>';

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
