/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../../log").logger('socket');
var node = require("../../module/db").node;
var ParseData= require("./parseData");
var initData = require('../socket/initData');
var io=require('../websocket/websocketServer').io;
let Promise = require('bluebird');
var equip = require("../../model/equipment");
var clientList={},onlineList={},socketTotle=0;

var handle = socket =>{
    socket.name=socket.remoteAddress + ":" + socket.remotePort;
    logger.info("socket 地址："+socket.name+" 建立连接，好开心O(∩_∩)O~~");
    socketTotle+=1;
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
        logger.info("设备"+id+" 通过连接"+socket.name+" 上传数据");
        //看是否是回复数据，是则返回，不处理，回复数据在数据下发后单独监听
        isResponse=ParseData.isResponse(buf);
        dataLength=ParseData.getLength(buf);
        if(isResponse===224&&dataLength<30){
            return;
        }
        //每次都更新socket队列
        clientList[id] = socket;
        if(!onlineList[socket.name]){
            onlineList[socket.name] = id;
            let onlineArr = [];
            for(let x in onlineList){
                onlineArr.push(onlineList[x]);
            }
            var getProjectInfo=onlineArr.map(v=>{
                return new Promise(resolve=>{
                    equip.getInfoByEquipId(v,(err,result)=>{
                        resolve(result[0]);
                    })
                })
            });
            new Promise.all(getProjectInfo).then(result=>{
                let online ={};
                result.map(v=>{
                    if(online[v.project_id]){
                        online[v.project_id]+=1
                    }else{
                        online[v.project_id]=1;
                    }

                });
                io.emit('onlineList',online);
            });
        }else{
            onlineList[socket.name] = id;
        }
        logger.info('socket队列总数：'+socketTotle);
        //将数据存入mongodb数据库
        var nodeEntity = new node({
            name:id,
            buffer:data,
            time:time
        });
        nodeEntity.save();
        logger.info("设备"+id+" 数据保持数据库成功");
        //返回回复数据
        logger.info("设备"+id+" 准备返回数据");
        resD=initData.initResponseData(id);
        socket.write(resD);
        logger.info("设备"+id+" 返回数据成功");

    });
    socket.on("error", () =>{
        logger.info("socket "+socket.name+" 连接发生错误，好悲哀(；′⌒`)");
        socket.destroy();
        }
    );
    socket.on("close",()=>{
        logger.info("socket "+socket.name+" is closed 连接关闭，好伤心/(ㄒoㄒ)/~~");
        clientList[onlineList[socket.name]]=null;
        delete onlineList[socket.name];
        socketTotle-=1;
        logger.info('socket队列总数：'+socketTotle);
        let onlineArr = [];
        for(let x in onlineList){
            onlineArr.push(onlineList[x]);
        }
        var getProjectInfo=onlineArr.map(v=>{
            return new Promise(resolve=>{
                equip.getInfoByEquipId(v,(err,result)=>{
                    resolve(result[0]);
                })
            })
        });
        new Promise.all(getProjectInfo).then(result=>{
            let online ={};
            result.map(v=>{
                if(online[v.project_id]){
                    online[v.project_id]+=1
                }else{
                    online[v.project_id]=1;
                }

            });
            io.emit('onlineList',online);
        });
    });

    socket.setTimeout(1000*23,()=>{
        logger.info("socket "+socket.name+" 连接超时，准备关闭");
        socket.destroy();
    })
};
handle.send=(id,data,callback)=>{
    if(clientList[id]){
        clientList[id].write(data);
        logger.info("通过通道"+clientList[id].name+"向设备"+id+" 发送数据");
        clientList[id].once('data',data=>{
            callback&&callback({code:1,message:'success',equip_id:id});
            logger.info("向设备"+id+" 数据发送成功");
        })
    }else{
        callback&&callback({code:-1,message:'fail',equip_id:id});
        logger.info(id+" 数据发送失败");
    }

};
module.exports = handle;
module.exports.clientList = clientList;
module.exports.onlineList = onlineList;