/**
 * Created by iqianjin-luming on 2016/11/27.
 */
var logger = require("../../log").logger('webSocket');
var equip = require("../../model/equipment");
var Promise = require('bluebird');
var handle = client=>{
    let onlineList = require('../socket/socketHandle').onlineList;
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
            if(online[v.project_id]){
                online[v.project_id]+=1
            }else{
                online[v.project_id]=1;
            }

        });
        client.emit('onlineList',online);
    });

};
module.exports = handle;

