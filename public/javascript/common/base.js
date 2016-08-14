/**
 * Created by iqianjin-luming on 16/7/28.
 */
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var $ = require('jquery');
    function GetSessionData(name)
    {
        var ss = '<%= Session["'+name+'"].ToString() %>';
        return ss;
    }
    console.log(GetSessionData('username'));
});
