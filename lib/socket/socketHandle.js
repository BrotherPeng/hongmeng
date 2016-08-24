/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../../log").logger('socket');
var node = require("../../module/db").node;
var ParseData= require("./parseData");
var moment = require('moment');
var clientList={};
var handle = socket =>{
    socket.name=socket.remoteAddress + ":" + socket.remotePort;
    logger.info("socket "+socket.name+" connect");
    socket.on('end', ()=> {
        logger.info("socket is end")
    });
    socket.on('data',data=>{
        var buf =new Buffer(data),id,time=parseInt(Date.now()/1000);
        id =ParseData.bufParse(buf);
        console.log(id);
        if(!clientList[id]){
            clientList[id]=socket;
        }
        var nodeEntity = new node({
            name:id,
            buffer:data,
            time:time
        });
        nodeEntity.save(function (error,doc) {
            if(error){
            }else{
            }
        })
        
    });
    socket.write('hello\r\n');
    socket.pipe(socket);
};
module.exports = handle;
module.exports.clientList = clientList;