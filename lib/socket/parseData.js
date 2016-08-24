/**
 * Created by iqianjin-luming on 16/8/23.
 */
function ParseData() {
}
ParseData.prototype={
    bufParse:function (buf) {
        return this.checkData(buf)
    },
    mongoParse:function (buf) {
        return this.getJson(buf);
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
    getJson:function (buf) {
        var json={};
        json.id=this.getId(buf);
        return json;
    }

};
module.exports=new ParseData();