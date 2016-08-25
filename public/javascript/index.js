/**
 * Created by iqianjin-luming on 16/7/28.
 */
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var $ = require('jquery');
    $.ajax({
        method: "GET",
        url: "/nodeControl/id/1001400234700001",
        dataType: "json",
        success: function (data) {
            console.log(data)
        }
    })
});