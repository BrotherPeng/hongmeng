/**
 * Created by iqianjin-luming on 16/7/28.
 */
requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: 'jquery/dist/jquery',
        chart:'javascript/index/chart',//首页图表
    },
    shim: {
        jquery: {exports: 'jquery'},

    }
});
require(['jquery', 'chart'], function ($, chart) {
    // some code here
});
