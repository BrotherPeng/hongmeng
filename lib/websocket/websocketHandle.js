/**
 * Created by iqianjin-luming on 2016/11/27.
 */
var logger = require("../../log").logger('webSocket');
var equip = require("../../model/equipment");
var Promise = require('bluebird');


var handle = client=>{
    let onlineList = require('../socket/socketHandle').onlineList;

    let sockets = require('../socket/cameraServer').sockets;
    let socketIds = require('../socket/cameraServer').socketIds;

    let onlineArr = [];
    logger.info('建立webSocket链接');
    for(let x in onlineList){
        onlineArr.push(onlineList[x]);
    }
    logger.info('webSocket处理的在线设备数组'+onlineArr);
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
        client.emit('onlineList',online);
    });
    client.on('refreshImg', function (data) { //刷新获取最新的图片
        logger.info(data);
        let socket = sockets[socketIds[data.equip_id]];
        if(socket){
            socket.write('getpicture&111'); //取出设备id和连接向客户端要数据
        }

    });
};
module.exports = handle;

