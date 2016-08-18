/**
 * Created by iqianjin-luming on 16/7/28.
 */
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var $ = require('jquery');
    /* 删除*/
    $(document).on('click', '.delBtn', function(event){
        var id=$(this).data('id');
        $.ajax({
            method: "GET",
            url: "/member/del",
            dataType: "json",
            data:{id:id},
            success:function (data) {
                if(data.status===1){
                    location.reload();
                }
            }
        })
    });
});