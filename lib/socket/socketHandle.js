/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../../log").logger('socket');
var node = require("../../module/db").node;
var redisClient = require("../../module/redisClient");
var ParseData= require("./parseData");
var initData = require('../socket/initData');
var io=require('../websocket/websocketServer').io;
let Promise = require('bluebird');
var equip = require("../../model/equipment");
let datastore = require("./datastore");
var clientList={},onlineList=[],socketTotle=0;


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


        // if(id == 'zzzzzzzzzzzz'){
            logger.info("设备"+id+" 通过连接"+socket.name+" 上传数据");
            var aa = '';
            for(var i = 0; i<data.length; i++){
                if(data[i] < 16){
                    aa += '0' + data[i].toString(16) + ' ';
                }else{
                    aa += data[i].toString(16) + ' ';
                }
            }
            logger.info('收到的状态数据：');
            logger.info(data);
            logger.info(aa);
            // logger.info(clientList[id]);
        // }

        // logger.info("设备"+id+" 通过连接"+socket.name+" 上传数据");
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
        let isExist = false;
        for(let i=0; i<onlineList.length; i++){ // [{'socket': 123},{'socket': 456}]
            if(onlineList[i][socket.name] && onlineList[i][socket.name] == id){ // 从数组中找这个id存不存在
                isExist = true
            }
        }
        // if(!onlineList[socket.name]){ //不存在当前连接就保存
        if(!isExist){ //不存在当前连接就保存
            // onlineList[socket.name] = id;
            let sk_id = {}
            sk_id[socket.name] = id; // 连接名字对应id
            onlineList.push(sk_id);

            let onlineArr = [];
            for(let i=0; i<onlineList.length; i++) { // [{'socket': 123},{'socket': 456}]
                for(let x in onlineList[i]){
                    onlineArr.push(onlineList[i][x]);
                }
            }


            logger.info('websocket用在线设备id号名称数组：');
            logger.info(JSON.stringify(onlineArr));
            logger.info(JSON.stringify(onlineList));
            if(datastore.equipmentsMap[id]){ //先从内存拿数据
                let online ={};
                /*datastore.equipments.map(v=>{
                    if(!v){
                        return;
                    }
                    if(online[v.project_id]){
                        online[v.project_id]+=1
                    }else{
                        online[v.project_id]=1;
                    }
                });*/
                for(let e in datastore.equipmentsMap){
                    let v = datastore.equipmentsMap[e];
                    if(!v){
                        continue;
                    }
                    if(online[v.project_id]){
                        online[v.project_id]+=1
                    }else{
                        online[v.project_id]=1;
                    }
                }
                logger.info('websocket datastore 用项目下在线设备信息：'+online);
                io.emit('onlineList',online);
            }else {
                var getProjectInfo=onlineArr.map(v=>{
                    return new Promise(resolve=>{
                        equip.getInfoByEquipId(v,(err,result)=>{ //每个设备的信息
                            datastore.equipmentsMap[v] = result[0];

                            resolve(result[0]);

                        })
                    })
                });

                new Promise.all(getProjectInfo).then(result=>{
                    let online ={};
                    logger.debug('websocket用设备项目信息：'+result);

                    var testIds = [];

                    result.map(v=>{
                        if(!v){
                            return;
                        }
                        if(online[v.project_id]){
                            online[v.project_id]+=1;

                            /*if(v.project_id == 24){
                                testIds.push(v);
                                logger.info(JSON.stringify(testIds));
                                logger.info(testIds.length);
                            }*/

                        }else{
                            online[v.project_id]=1;
                        }

                    });
                    logger.debug('websocket用项目下在线设备信息：'+online);
                    datastore.equipments = result; //所有设备信息
                    io.emit('onlineList',online);
                });
            }


        }else{
            // onlineList[socket.name] = id;
        }
        logger.debug('socket队列总数：'+socketTotle);
        /*if(id == '1001070523000029' || id == '1001070523000004'){
            logger.info('在线。。。。。。。');
            logger.info(id);
        }*/
        if(datastore.equipmentsMap[id]){
            const result = datastore.equipmentsMap[id];
            let nodeModel = {
                name: result.name,
                equip_id: result.equip_id,
                buffer: data,
                time: time
            };
            // logger.info('..................................................');
            // logger.info(nodeModel);
            redisClient.set(id, JSON.stringify(nodeModel));
            var nodeEntity = new node(nodeModel);
            nodeEntity.save(function (err) {});

            logger.debug("设备"+id+" 数据保持数据库成功");
            logger.debug('保存收到的状态数据：');
        }else{
            equip.getInfoByEquipId(id,(err,result)=>{ //查询出项目名称

                //将数据存入mongodb数据库
                // console.log('~~~~~~~~~~~~~~~~~~~~~~~');
                // logger.debug(result);
                // logger.debug('result.length::::::::::::' + result.length);
                // console.log(result[0].name);
                if(result.length > 0){
                    datastore.equipmentsMap[result[0].equip_id] = result[0];
                    let nodeModel = {
                        name: result[0].name,
                        equip_id: result[0].equip_id,
                        buffer: data,
                        time: time
                    };
                    redisClient.set(id, JSON.stringify(nodeModel));
                    logger.info('======================================');
                    // logger.info(nodeModel);
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
        }

        logger.info('在线id');
        logger.info(JSON.stringify(onlineList));
        for(let b in clientList){
            logger.info(b);
        }

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

        for(let i=0; i<onlineList.length; i++){ // [{'socket': 123},{'socket': 456}]
            if(onlineList[i][socket.name]){ // 从数组中找这个id存不存在
                let eid = onlineList[i][socket.name]; //取出设备id

                logger.info("socket "+socket.name+ " " + eid + " is closed 连接关闭，好伤心/(ㄒoㄒ)/~~");
                clientList[onlineList[i][socket.name]]=null;
                onlineList.splice(i, 1); // 删除这个socketname下的所有id

                socketTotle-=1;
                logger.info('socket队列总数：'+socketTotle);
                let onlineArr = [];
                for(let i=0; i<onlineList.length; i++) { // [{'socket': 123},{'socket': 456}]
                    for(let x in onlineList[i]){
                        onlineArr.push(onlineList[i][x]);
                    }
                }

                if(datastore.equipmentsMap[eid]){ //先从内存拿数据
                    logger.info('删除缓存数据.................');
                    logger.info(datastore.equipmentsMap[eid]);
                    delete datastore.equipmentsMap[eid]; //删除缓存数据
                    logger.info('删除后.................');
                    logger.info(datastore.equipmentsMap[eid]);

                    let online ={};
                    for(let e in datastore.equipmentsMap){
                        let v = datastore.equipmentsMap[e];
                        if(!v){
                            continue;
                        }
                        if(online[v.project_id]){
                            online[v.project_id]+=1
                        }else{
                            online[v.project_id]=1;
                        }
                    }
                    logger.debug('websocket datastore 用项目下在线设备信息：'+online);

                    io.emit('onlineList',online);
                    logger.info('----------------------------');
                    logger.info(online);
                }else {
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
                        datastore.equipments = result; //数据保存在内存
                        io.emit('onlineList',online);
                    });
                }
            }
        }

        /*let eid = onlineList[socket.name]; //取出设备id
        logger.info("socket "+socket.name+ " " + eid + " is closed 连接关闭，好伤心/(ㄒoㄒ)/~~");
        clientList[onlineList[socket.name]]=null;
        delete onlineList[socket.name];

        socketTotle-=1;
        logger.info('socket队列总数：'+socketTotle);
        let onlineArr = [];
        for(let x in onlineList){
            onlineArr.push(onlineList[x]);
        }*/



    });

    socket.setTimeout(1000*45,()=>{
        logger.info("socket "+socket.name+" 连接超时，准备关闭");
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

var clear = function () {
    //修改了设备之后有可能项目id不同了，重新统计所有数据

    logger.info('修改了项目');
    datastore.equipmentsMap = {};
    datastore.equipments = [];
    clientList = {};
    onlineList = [];
    socketTotle = 0;
};

//获取设备状态
var getEquipmentsStatus = function (eid) {
    if(clientList[eid]){
        return true;
    }
    return false;
};


/**
 * 更新控制中心的设备统计数量
 */
var getOnline = function () {
    if(datastore.equipments.length > 0){ //先从内存拿数据
        let online ={};
        for(let e in datastore.equipmentsMap){
            let v = datastore.equipmentsMap[e];
            if(!v){
                continue;
            }
            if(online[v.project_id]){
                online[v.project_id]+=1
            }else{
                online[v.project_id]=1;
            }
        }
        io.emit('onlineList',online);
        logger.info('socketHandle----------------------------');
        logger.info(online);
    }else {
        let onlineArr = [];
        logger.info('用户打开或刷新控制中心');
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
            datastore.equipments = result; //数据保存在内存
            io.emit('onlineList',online);
        });
    }
};

module.exports = handle;
module.exports.clientList = clientList;
module.exports.onlineList = onlineList;
module.exports.clear = clear;
module.exports.getEquipmentsStatus = getEquipmentsStatus;
module.exports.getOnline = getOnline;