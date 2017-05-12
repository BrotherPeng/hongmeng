/**
 * Created by iqianjin-luming on 16/7/28.
 */
requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: 'jquery/dist/jquery',
    },
    shim: {
        jquery: {exports: 'jquery'}
    }
});
require(['jquery'], function ($) {

    /* 删除*/
    $(document).on('click', '.delBtn', function (event) {
        var id = $(this).data('id');
        // 这里改成自定义样式的确认删除
        var type = $(this).data('type');
        Tip.confirm(type,id);
        // if(!confirm('确认删除？')){
        //     return;
        // }
        // $.ajax({
        //     method: "GET",
        //     url: "/equipment/del",
        //     dataType: "json",
        //     data:{id:id},
        //     success:function (data) {
        //         if(data.status===1){
        //             location.reload();
        //         }
        //     }
        // })
    });
});