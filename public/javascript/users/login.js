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

});
