/**
 * Created by iqianjin-luming on 16/7/28.
 */
requirejs.config({
    baseUrl: '../',
    paths: {
        jquery: 'jquery/dist/jquery',
        handlebars: 'handlebars/handlebars.amd.min',
        // dialog: 'artDialog/dist/dialog-min',
        flatpickr: 'flatpickr/dist/flatpickr.min',
        dialogTemplate: 'javascript/index/template', //弹框模板
        io: 'socket.io-client/dist/socket.io.min'
    },
    shim: {
        jquery: { exports: 'jquery' },
        // dialog: { exports: 'dialog' },
        flatpickr: { exports: 'flatpickr' },
        io: { exports: 'io' }

    }
});
require(['jquery', 'handlebars', 'flatpickr', 'dialogTemplate', 'io'], function($, handlebars, dialog, flatpickr, dialogTemplate, io) {

});