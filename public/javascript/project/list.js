/**
 * Created by iqianjin-luming on 16/7/28.
 */
requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: 'jquery/dist/jquery',
    },
    shim: {
        jquery: { exports: 'jquery' }
    }
});
require(['jquery'], function ($){
    $(document).on('click', '.delBtn', function(event){
        var id=$(this).data('id');
        $.ajax({
            method: "GET",
            url: "/project/del",
            dataType: "json",
            data:{id:id},
            success:function (data) {
                if(data.status===1){
                    location.reload();
                }
            }
        })
    });
})
