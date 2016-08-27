/**
 * Created by iqianjin-luming on 16/8/25.
 */
function InitData() {

};
InitData.prototype={
    init:function () {
        let buf = this.initHeader();
        buf = Buffer.concat([buf,new Buffer([0x00])]);
        buf = Buffer.concat([buf,this.initKey()]);
        buf = Buffer.concat([buf,this.initConfig()]);
        buf = Buffer.concat([buf,this.initRelayControl()]);
        buf = Buffer.concat([buf,this.initTimeConfig()]);
        buf = Buffer.concat([buf,this.initSystemTime()]);
        buf = Buffer.concat([buf,this.initOpenTime()]);
        buf = Buffer.concat([buf,this.initCloseTime()]);
        buf = Buffer.concat([buf,this.initCheckSum()]);

        return buf;
    },
    initHeader:function () {
        let buf = new Buffer([0x7e,0x00]);
        return buf;
    },
    initKey:function () {
        let buf = new Buffer([0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00]);
        return buf;
    },
    initConfig:function () {
        let buf = new Buffer([0x02]);
        return buf;
    },
    initRelayControl:function () {
        let buf = new Buffer([0x00]);
        return buf;
    },
    initTimeConfig:function () {
        let buf = new Buffer([0x01]);
        return buf;
    },
    initSystemTime:function () {
        let buf = new Buffer([0x19,0x22,0x20]);
        return buf;
    },
    initOpenTime:function () {
        let buf = new Buffer([0x19,0x22]);
        return buf;
    },
    initCloseTime:function () {
        let buf = new Buffer([0x19,0x22]);
        return buf;
    },
    initCheckSum:function () {
        let buf = new Buffer([0x19]);
        return buf;
    }

};
module.exports = new InitData();
