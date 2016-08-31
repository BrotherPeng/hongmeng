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
    initResponseData:function (id) {
        let buf = this.initHeader(),length=0x00;
        buf = Buffer.concat([buf,new Buffer([length])]);//length
        buf = Buffer.concat([buf,new Buffer([0x05])]);//frameId
        buf = Buffer.concat([buf,this.initNodeId(id)]);//nodeId
        buf = Buffer.concat([buf,this.initResFlag(0)]);//response flag
        buf = Buffer.concat([buf,this.initCheckSum(buf)]);//checksum
        length =(buf.length-3);
        buf.writeUInt8(length,2);
        return buf;
    },
    initHeader:function () {
        let buf = new Buffer([0x7e,0x00]);
        return buf;
    },
    initResFlag:function (type) {
        let buf;
        switch (type){
            case 0:
                buf = new Buffer([0xE0]);
                break;
            case 1:
                buf = new Buffer([0xE1]);
                break;
            case 2:
                buf = new Buffer([0xE2]);
                break;
            case 3:
                buf = new Buffer([0xE3]);
                break;
            case 4:
                buf = new Buffer([0xE4]);
                break;
            default:
                buf = new Buffer([0x00]);
                break;
        }
        return buf;
    },
    initNodeId:function (id) {
        console.log(id);
        let hex_1 = Number('0x'+id.slice(0,2)),
            hex_2 = Number('0x'+id.slice(2,4)),
            hex_3 = Number('0x'+id.slice(4,6).toString(16)),
            hex_4 = Number('0x'+id.slice(6,8)),
            hex_5 = Number('0x'+id.slice(8,10)),
            hex_6 = Number('0x'+id.slice(10,12)),
            hex_7 = Number('0x'+id.slice(12,14)),
            hex_8 = Number('0x'+id.slice(14,16));
        let buf = new Buffer([hex_8,hex_7,hex_6,hex_5,hex_4,hex_3,hex_2,hex_1]);
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
    initCheckSum:function (buf) {
        let checkSum=0;
        for(var i=3;i<buf.length;i++){
            checkSum+=buf.readUInt8(i);
        };
        return new Buffer([(0xff-checkSum)]);
    }

};
module.exports = new InitData();
