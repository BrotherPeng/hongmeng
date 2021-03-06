/**
 * Created by iqianjin-luming on 16/8/23.
 */
var logger = require("../../log").logger('parseData');
function ParseData() {
}
ParseData.prototype={
    bufParse:function (buf) {
        return this.checkData(buf)
    },
    isResponse:function (buf) {
        let flag;
        flag=buf.readUInt8(12);
        return  flag;
    },
    isACKResponse:function (buf) {
        let flag;
        flag=buf.readUInt8(18);
        return  flag;
    },
    getLength:function (buf) {
        let l;
        l=buf.readUInt8(2);
        return  l;
    },
    getACKLength:function (buf) {
        let l;
        l=buf.readUInt8(2);
        return  l;
    },
    checkData:function (buf) {
        if(!buf)return false;
        return this.checkSum(buf)
    },
    checkSum:function (buf) {
        let checkSum=0;
        for(var i=3;i<buf.length;i++){
            checkSum+=buf.readUInt8(i);
        };

        if((checkSum&0xff)!=255){
            return false;
        }else{
            return this.getId(buf)
        }
    },
    getId:function (buf) {
        let id='',b='';
        for(var i=10;i>2;i--){
            b=buf.readUInt8(i).toString(16);
            b.length==1?b=("0"+b):b=b;
            id+=b;
        }
        return id;
    },
    mongoParse:function (nodeData) {
        return this.getJson(nodeData);
    },
    getJson:function (nodeData) {
        // logger.info(nodeData);
        let buf=nodeData.buffer;
        var json={};
        json.name = nodeData.name;
        json.id = this.getId(buf);
        json.temperature = this.getTemperature(buf);
        let voltage_1 = this.getVoltage_1(buf);
        json.voltage_1 = voltage_1 > 2000 ? 0 : voltage_1;
        let voltage_2 = this.getVoltage_2(buf);
        json.voltage_2 = voltage_2 > 2000 ? 0 : voltage_2;
        let voltage_3 = this.getVoltage_3(buf);
        json.voltage_3 = voltage_3 > 2000 ? 0 : voltage_3;

        // logger.info('::::::json.voltage_1::::::json.voltage_2::::::json.voltage_3::::::');
        // logger.info(voltage_1 + ' ' + voltage_2 + ' ' + voltage_3);

        json.electric_1 = this.getElectric_1(buf);
        json.electric_2 = this.getElectric_2(buf);
        json.electric_3 = this.getElectric_3(buf);
        json.shakeStatus = this.getShakeStatus(buf);
        json.gateStatus = this.getGateStatus(buf);
        json.relay = this.getRelay(buf);
        json.timeConfig = this.getTimeConfig(buf);
        json.lastChangeTime = this.getLastChangeTime(buf);
        json.updateTime=this.translateTime(nodeData.time);
        return json;
    },
    translateTime:longType=>{
        let UTC,paramTime=longType+'';
        paramTime.length===10?UTC=new Date(parseInt(longType+'000')):UTC=new Date(parseInt(longType));
        let month=UTC.getMonth()+1;
        let day=UTC.getDate();
        let h=UTC.getHours();
        let m=UTC.getMinutes();
        let s=UTC.getSeconds();
        let time=month+'月'+day+'日'+' '+h+':'+m+':'+s;
        return time;
    },
    getTemperature:function (buf) {
        let temperature;
        temperature=buf.readFloatLE(19);
        return temperature;
    },
    getVoltage_1:function (buf) {
        let voltage;
        voltage=buf.readFloatLE(23);
        return voltage;
    },
    getVoltage_2:function (buf) {
        let voltage;
        voltage=buf.readFloatLE(27);
        return voltage;
    },
    getVoltage_3:function (buf) {
        let voltage;
        voltage=buf.readFloatLE(31);
        return voltage;
    },
    getElectric_1:function (buf) {
        let electric;
        electric=buf.readFloatLE(35);
        return electric;
    },
    getElectric_2:function (buf) {
        let electric;
        electric=buf.readFloatLE(39);
        return electric;
    },
    getElectric_3:function (buf) {
        let electric;
        electric=buf.readFloatLE(43);
        return electric;
    },
    getShakeStatus:function (buf) {
        let shakeStatus;
        shakeStatus=buf.readInt8(47);
        shakeStatus=(shakeStatus&1)===1?'无':'有';
        return shakeStatus;
    },
    getGateStatus:function (buf) {
        let gateStatus;
        gateStatus=buf.readInt8(48);
        gateStatus=(gateStatus&1)===1?'关':'开';
        return gateStatus;
    },
    getRelay:function (buf) {
        let relay,relayArr=[];
        relay = buf.readUInt8(49);
        relayArr[0]=(relay&1)===1?'开':'关';
        relayArr[1]=(relay&2)===2?'开':'关';
        relayArr[2]=(relay&4)===4?'开':'关';
        relayArr[3]=(relay&8)===8?'开':'关';
        relayArr[4]=(relay&16)===16?'开':'关';
        relayArr[5]=(relay&32)===32?'开':'关';
        relayArr[6]=(relay&64)===64?'开':'关';
        relayArr[7]=(relay&128)===128?'开':'关';
        return relayArr;
    },
    getTimeConfig:function (buf) {
        let timeConfig;
        timeConfig = buf.readInt8(50);
        timeConfig==1?timeConfig='周模式':timeConfig='日模式';
        return timeConfig;
    },
    getLastChangeTime:function (buf) {
        let lastChangeTime;
        lastChangeTime = buf.readInt8(51).toString()+'-'+buf.readInt8(52).toString()+' '+buf.readInt8(53).toString()+':'+buf.readInt8(54).toString();
        return lastChangeTime;
    }
};
module.exports=new ParseData();