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
    logger.debug("socket 地址："+socket.name+" 建立连接，好开心O(∩_∩)O~~");
    socketTotle+=1;
    socket.on('data',data=>{

        var aa = '';
        for(var i = 0; i<data.length; i++){
            if(data[i] < 16){
                aa += '0' + data[i].toString(16) + ' ';
            }else{
                aa += data[i].toString(16) + ' ';
            }
        }
        logger.debug('收到的状态数据：');
        logger.debug(data);
        logger.debug(aa);

        var buf =new Buffer(data),
            id,
            time=parseInt(Date.now()/1000),
            resD,
            isResponse,
            dataLength;
        id =ParseData.bufParse(buf);

        if(id == '1001070523000019' || id == '100107052300003d'){
            logger.debug('发送测试数据。。。');
            socket.write('asd12321321');
        }

        //id获取过程中会校验数据，没有id，则返回
        if(!id){
            return;
        }
        logger.debug("设备"+id+" 通过连接"+socket.name+" 上传数据");
        //看是否是回复数据，是则返回，不处理，回复数据在数据下发后单独监听
        /*let isACKResponse=ParseData.isACKResponse(buf);
        let ackDataLength=ParseData.getACKLength(buf);
        if(isACKResponse===1&&ackDataLength===52){ //云鹏，百得控制箱，用八个ID后面的那个字节表示心跳吧，0-心跳，1-ack
            return;
        }*/

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

            logger.debug('websocket用在线设备id号名称数组：'+onlineArr);
            var getProjectInfo=onlineArr.map(v=>{
                return new Promise(resolve=>{
                    equip.getInfoByEquipId(v,(err,result)=>{
                        resolve(result[0]);
                    })
                })
            });

            new Promise.all(getProjectInfo).then(result=>{
                let online ={};
                logger.debug('websocket用设备项目信息：'+result);

                result.map(v=>{
                    if(!v){
                        return;
                    }
                    if(online[v.project_id]){
                        online[v.project_id]+=1
                    }else{
                        online[v.project_id]=1;
                    }

                });
                logger.debug('websocket用项目下在线设备信息：'+online);

                io.emit('onlineList',online);
            });
        }else{
            onlineList[socket.name] = id;
        }
        logger.debug('socket队列总数：'+socketTotle);
        equip.getInfoByEquipId(id,(err,result)=>{ //查询出项目名称
            //将数据存入mongodb数据库
            // console.log('~~~~~~~~~~~~~~~~~~~~~~~');
            // logger.debug(result);
            // logger.debug('result.length::::::::::::' + result.length);
            // console.log(result[0].name);
            if(result.length > 0){
                let nodeModel = {
                    name: result[0].name,
                    equip_id: result[0].equip_id,
                    buffer: data,
                    time: time
                };
                // logger.debug(nodeModel);
                var nodeEntity = new node(nodeModel);
                nodeEntity.save(function (err) {
                    // logger.debug('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                    // logger.debug(err);
                });
                logger.debug("设备"+id+" 数据保持数据库成功");
                logger.debug('保存收到的状态数据：');
                // logger.debug(aa);
            }
        });
        //返回回复数据
        logger.debug("设备"+id+" 准备返回数据");
        resD=initData.initResponseData(id);
        socket.write(resD);
        logger.debug("设备"+id+" 返回数据成功");

    });
    socket.on("error", () =>{
        logger.debug("socket "+socket.name+" 连接发生错误，好悲哀(；′⌒`)");
        socket.destroy();
        }
    );
    socket.on("close",()=>{
        logger.debug("socket "+socket.name+" is closed 连接关闭，好伤心/(ㄒoㄒ)/~~");
        clientList[onlineList[socket.name]]=null;
        delete onlineList[socket.name];
        socketTotle-=1;
        logger.debug('socket队列总数：'+socketTotle);
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
                if(!v){
                    return;
                }
                if(online[v.project_id]){
                    online[v.project_id]+=1
                }else{
                    online[v.project_id]=1;
                }

            });
            io.emit('onlineList',online);
        });
    });

    socket.setTimeout(1000*45,()=>{
        logger.debug("socket "+socket.name+" 连接超时，准备关闭");
        socket.destroy();
    })
};

/**
 * 下发数据
 * @param id 设备id
 * @param data 下发的16进制数据
 * @param callback
 */
handle.send=(id,data,callback)=>{
    if(clientList[id]){
        writeHEX(id, data, 1, function (result) { //写数据
            callback&&callback(result);
        });
    }else{
        callback&&callback({code:-1,message:'fail',equip_id:id});
        logger.debug(id+" 数据发送失败");
    }

};

clientResult = {};
function writeHEX(id,data,count,callback) {
    if(count == 6){ //第六次还没收到直接返回失败
        logger.debug('第' + count + "次了，失败" + id);
        return callback&&callback({code:-1,message:'fail',equip_id:id});
    }
    clientResult[id] = {
        result: false,
        count: count
    }; //记录还未收到回复
    clientList[id].write(data);
    logger.debug('第' + count + "次通过通道"+clientList[id].name+"向设备"+id+" 发送数据");
    clientList[id].once('data',data=>{
        let buf =new Buffer(data);
        let id =ParseData.bufParse(buf);
        if(!id){ //检验并返回id
            logger.debug('校验失败............');
            logger.debug(id);
            return;
        }
        logger.debug(id);
        let isACKResponse=ParseData.isACKResponse(buf);
        let ackDataLength=ParseData.getACKLength(buf);

        if(isACKResponse===1&&ackDataLength===52){ //云鹏，百得控制箱，用八个ID后面的那个字节表示心跳吧，0-心跳，1-ack
            clientResult[id].result = true; //收到回复
            callback&&callback({code:1,message:'success',equip_id:id});
            consoleData(data); //打印数据
            logger.debug("向设备"+id+" 数据发送成功");
            return;
        }
    });
    //两秒内收不到回复重试，一共重试5次
    setTimeout(function () {
        if(!clientResult[id].result){ //如果还失败
            const count = clientResult[id].count + 1;
            writeHEX(id, data, count, callback);
        }
    }, 3000);
}

function consoleData(data) {
    /********打印数据******/
    logger.debug('once收到的状态数据：');
    var aa = '';
    for(var i = 0; i<data.length; i++){
        if(data[i] < 16){
            aa += '0' + data[i].toString(16) + ' ';
        }else{
            aa += data[i].toString(16) + ' ';
        }
    }
    logger.debug(aa);
    /**********打印数据*************/
}
module.exports = handle;
module.exports.clientList = clientList;
module.exports.onlineList = onlineList;