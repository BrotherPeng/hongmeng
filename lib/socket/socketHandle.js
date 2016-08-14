/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../../log").logger('socket');
var node = require("../../module/db").node;
var clientList={};
var handle = socket =>{
    socket.name=socket.remoteAddress + ":" + socket.remotePort;
    logger.info("socket "+socket.name+" connect");
    socket.on('end', ()=> {
        logger.info("socket is end")
    });
    socket.on('data',data=>{
        var buf =new Buffer(data),id='',b;
        for(var i=10;i>2;i--){
            b=buf.readInt8(i).toString(16);
            b.length==1?b="0"+b:b=b;
            id+=b;
        }
        logger.info(id);
        if(!clientList[id]){
            clientList[id]=socket;
        }
        var nodeEntity = new node({
            name:id,
            buffer:data
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