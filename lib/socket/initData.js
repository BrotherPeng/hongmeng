/**
 * Created by iqianjin-luming on 16/8/25.
 */
function InitData() {

};
InitData.prototype={
    /*周模式时间设置*/
    initTimeConfigData:function (config) {
        let buf = this.initHeader(),
            length=0x00,
            frameId=0x00;
        buf = Buffer.concat([buf,new Buffer([length])]);//length
        buf = Buffer.concat([buf,new Buffer([frameId])]);//frameId
        buf = Buffer.concat([buf,this.initNodeId(config.id)]);//nodeId
        buf = Buffer.concat([buf,this.initResFlag(2)]);// 控制模式
        buf = Buffer.concat([buf,this.initRelayControl()]);//继电器状态,本套模式下无用
        buf = Buffer.concat([buf,this.initTimeConfig(config.type)]);//0周模式,1日模式
        buf = Buffer.concat([buf,this.initSystemTime()]);//系统时间:时分秒
        buf = Buffer.concat([buf,this.initOpenTime(config.openTime)]);//周一至周日的开启时间
        buf = Buffer.concat([buf,this.initCloseTime(config.closeTime)]);//周一至周日的关闭时间
        buf = Buffer.concat([buf,this.initCheckSum(buf)]);//计算校验
        length =(buf.length-3);
        buf.writeUInt8(length,2);//设置长度
        return buf;
    },
    /*日模式时间设置*/
    initDayTimeConfigData:function (config) {
        let buf = this.initHeader(),
            length=0x00,
            frameId=0x00;
        buf = Buffer.concat([buf,new Buffer([length])]);//length
        buf = Buffer.concat([buf,new Buffer([frameId])]);//frameId
        buf = Buffer.concat([buf,this.initNodeId(config.id)]);//nodeId
        buf = Buffer.concat([buf,this.initResFlag(2)]);// 控制模式
        buf = Buffer.concat([buf,this.initRelayControl()]);//继电器状态,本套模式下无用
        buf = Buffer.concat([buf,this.initTimeConfig(config.type)]);//0周模式,1日模式
        buf = Buffer.concat([buf,this.initSystemTime()]);//系统时间:时分秒
        buf = Buffer.concat([buf,this.initDailyTime(config)]);//时间区间
        buf = Buffer.concat([buf,this.initCheckSum(buf)]);//计算校验
        length =(buf.length-4);
        buf.writeUInt8(length,2);
        return buf;
    },
    /*回复信息初始化*/
    initResponseData:function (id) {
        let buf = this.initHeader(),length=0x00;
        buf = Buffer.concat([buf,new Buffer([length])]);//length
        buf = Buffer.concat([buf,new Buffer([0x05])]);//frameId
        buf = Buffer.concat([buf,this.initNodeId(id)]);//nodeId
        buf = Buffer.concat([buf,this.initResFlag(0)]);//response flag
        buf = Buffer.concat([buf,this.initResponseSystemTime()]);//response flag
        buf = Buffer.concat([buf,this.initCheckSum(buf)]);//checksum
        length =(buf.length-4);
        buf.writeUInt8(length,2);
        return buf;
    },
    /*继电器控制信息初始化*/
    initSwitchControlData:function (config) {
        let buf = this.initHeader(),
            length=0x00,
            frameId=0x00;
        buf = Buffer.concat([buf,new Buffer([length])]);//length
        buf = Buffer.concat([buf,new Buffer([frameId])]);//frameId
        buf = Buffer.concat([buf,this.initNodeId(config.id)]);//nodeId
        buf = Buffer.concat([buf,this.initResFlag(1)]);// 控制模式
        buf = Buffer.concat([buf,this.initRelayControl(config.switchStatus)]);//继电器状态,
        buf = Buffer.concat([buf,this.initTimeConfig()]);//0周模式,1日模式
        buf = Buffer.concat([buf,this.initSystemTime()]);//系统时间:时分秒
        buf = Buffer.concat([buf,this.initOpenTime(['00','00','00','00','00','00','00','00','00','00','00','00','00','00'])]);//周一至周日的开启时间
        buf = Buffer.concat([buf,this.initCloseTime(['00','00','00','00','00','00','00','00','00','00','00','00','00','00'])]);//周一至周日的关闭时间
        buf = Buffer.concat([buf,this.initCheckSum(buf)]);//计算校验
        length =(buf.length-3);
        buf.writeUInt8(length,2);//设置长度
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
                buf = new Buffer([0xE0]);// 回复
                break;
            case 1:
                buf = new Buffer([0x01]);//控制继电器不控制时间
                break;
            case 2:
                buf = new Buffer([0x02]);//控制时间不控制继电器
                break;
            case 3:
                buf = new Buffer([0x03]);//都控制
                break;
            case 4:
                buf = new Buffer([0x04]);//控制继电器属性
                break;
            default:
                buf = new Buffer([0x00]);
                break;
        }
        return buf;
    },
    initNodeId:function (id) {
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
    initRelayControl:function (status) {
        let buf = new Buffer([0x00]);
        if(status){
            buf = new Buffer([Number('0x'+status)]);
        }
        return buf;
    },
    initTimeConfig:function (type) {
        let buf;
        switch (type){
            case 0:
                buf = new Buffer([0x01]);//周模式
                break;
            case 1:
                buf = new Buffer([0x02]);//日模式
                break;
            default:
                buf = new Buffer([0x00]);
                break;
        }
        return buf;
    },
    initSystemTime:function () {
        let now = new Date(),
            hours=Number('0x'+now.getHours()),
            minutes=Number('0x'+now.getMinutes()),
            seconds=Number('0x'+now.getSeconds()),
            buf = new Buffer([hours,minutes,seconds]);
        return buf;
    },
    initResponseSystemTime:function () {
        let now = new Date(),
            year=Number('0x'+(now.getYear()-100)),
            month=Number('0x'+now.getMonth())+1,
            day=Number('0x'+now.getDate()),
            hours=Number('0x'+now.getHours()),
            minutes=Number('0x'+now.getMinutes()),
            seconds=Number('0x'+now.getSeconds()),
            week=Number('0x'+now.getDay()),
            buf = new Buffer([year,month,day,hours,minutes,seconds,week]);
        return buf;
    },
    initOpenTime:function (arr) {
        let buf = new Buffer([]);
        for (let i=0;i<arr.length;i++){
            let arrayEle = Number('0x'+arr[i]),
                eleBuf = new Buffer([arrayEle]);
            buf=Buffer.concat([buf,eleBuf]);
        }
        return buf;
    },
    initCloseTime:function (arr) {
        let buf = new Buffer([]);
        for (let i=0;i<arr.length;i++){
            let arrayEle = Number('0x'+arr[i]),
                eleBuf = new Buffer([arrayEle]);
            buf=Buffer.concat([buf,eleBuf]);
        }
        return buf;
    },
    initDailyTime:function (config) {
        let buf = new Buffer([]),
            startDayArr=config.startDay,
            endDayArr=config.endDay,
            openTimeArr=config.openTime,
            closeTimeArr=config.closeTime;
        for (let i=0;i<10;i+=2){
            let startMonthEle= Number('0x'+(startDayArr[i]?startDayArr[i]:0)),
                startDayEle= Number('0x'+(startDayArr[i+1]?startDayArr[i+1]:0)),
                endMonthEle=Number('0x'+(endDayArr[i]?endDayArr[i]:0)),
                endDayEle=Number('0x'+(endDayArr[i+1]?endDayArr[i+1]:0)),
                openTimeHourEle=Number('0x'+(openTimeArr[i]?openTimeArr[i]:0)),
                openTimeMinuteEle=Number('0x'+(openTimeArr[i+1]?openTimeArr[i+1]:0)),
                closeTimeHourEle=Number('0x'+(closeTimeArr[i]?closeTimeArr[i]:0)),
                closeTimeMinuteEle=Number('0x'+(closeTimeArr[i+1]?closeTimeArr[i+1]:0)),
                atartMonthEleBuf=new Buffer([startMonthEle]),
                atartDayEleBuf=new Buffer([startDayEle]),
                endMonthEleBuf=new Buffer([endMonthEle]),
                endDayEleBuf=new Buffer([endDayEle]),
                openHourEleBuf=new Buffer([openTimeHourEle]),
                openMinuteEleBuf=new Buffer([openTimeMinuteEle]),
                closeHourEleBuf=new Buffer([closeTimeHourEle]),
                closeMinuteEleBuf=new Buffer([closeTimeMinuteEle]);
            buf=Buffer.concat([buf,atartMonthEleBuf,atartDayEleBuf,endMonthEleBuf,endDayEleBuf,openHourEleBuf,openMinuteEleBuf,closeHourEleBuf,closeMinuteEleBuf]);
        }
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
