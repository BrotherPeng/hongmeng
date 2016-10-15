/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../../log").logger('socket');
var node = require("../../module/db").node;
var ParseData= require("./parseData");
var initData = require('../socket/initData');
var clientList={},onlineList={},sendList={};
var handle = socket =>{
    socket.name=socket.remoteAddress + ":" + socket.remotePort;
    logger.info("socket "+socket.name+" connect");
    socket.on('end', ()=> {
        logger.info("socket is end");
        clientList[onlineList[socket.name]]=null;
    });
    socket.on('data',data=>{
        var buf =new Buffer(data),
            id,
            time=parseInt(Date.now()/1000),
            resD,
            isResponse,
            dataLength;
        id =ParseData.bufParse(buf);
        //id获取过程中会校验数据，没有id，则返回
        if(!id){
            return;
        }
        logger.info(id+"----socket "+socket.name);
        //看是否是回复数据，是则返回，不处理，回复数据在数据下发后单独监听
        isResponse=ParseData.isResponse(buf);
        dataLength=ParseData.getLength(buf);
        if(isResponse===224&&dataLength<30){
            return;
        }
        //看socket队列中是否存在，有则跳过，无则加上
        if(!clientList[id]){
            clientList[id]=socket;
            onlineList[socket.name]=id;
        }
        //将数据存入mongodb数据库
        var nodeEntity = new node({
            name:id,
            buffer:data,
            time:time
        });
        nodeEntity.save(function (error,doc) {
            if(error){
            }else{
            }
        });
        //返回回复数据
        resD=initData.initResponseData(id);
        socket.write(resD);

    });
    socket.on("error", err =>{
            console.log("Caught flash policy server socket error: ");
            console.log(err.stack);
        }
    );
    socket.on("close",()=>{
        logger.info("socket "+socket.name+" close");
    });
    socket.setTimeout(1000*120,()=>{
        clientList[onlineList[socket.name]]=null;
    })
};
handle.send=(id,data,callback)=>{
    if(clientList[id]){
        clientList[id].write(data);
        clientList[id].once('data',data=>{
            callback&&callback({code:1,message:'success',equip_id:id});
        })
    }else{
        callback&&callback({code:-1,message:'fail',equip_id:id});
    }

};
module.exports = handle;
module.exports.clientList = clientList;
