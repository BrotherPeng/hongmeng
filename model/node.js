/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../log").logger('socket');
var node = require("../module/db").node;
var ParseData = require("../lib/socket/parseData");
var equipment = require("../model/equipment");
var camera = require("../model/camera");
var Promise = require('bluebird');
var socketHandle=require('../lib/socket/socketHandle');
var redisClient = require("../module/redisClient");

function Node() {
    let _this=this;
    this.getAll=function (res) {
        node.find(function (err,nodes) {
            res.send(nodes)
        })
    };
    /*按项目获取所有节点的最后一条数据*/

    this.getAllLastOneInProject = function (projectId, res) {
        // let clientList=require('../lib/socket/socketHandle').clientList;
        logger.debug('查询开始：' + new Date().toLocaleTimeString());
        equipment.getAllIdByProject(projectId, function (err, result) {
             if (!err) {
                var actions = result.map(v => {
                    return new Promise(resolve=> {
                        _this.getLastOneNodeById(v.equip_id, function (err, value) {
                            // logger.info('查询一次：' + new Date().toLocaleTimeString());
                            if (err) {
                                return err;
                            } else {
                                if(value){
                                    /*if(v.equip_id == '10010707d1100033'){
                                        logger.info('循环到问题设备了');
                                        logger.info(clientList[v.equip_id]);
                                    }*/
                                    // clientList[v.equip_id]?value.offline=false:value.offline=true;
                                    socketHandle.getEquipmentsStatus(v.equip_id)?value.offline=false:value.offline=true;
                                }
                                resolve(value);
                            }
                        })
                    })

                });
                Promise.all(actions).then(v=>{
                    logger.debug('查询结束：' + new Date().toLocaleTimeString());
                    res.send(v);
                });
            } else {
                throw err;
            }
        });
    };

    this.getNodeById=function (id,res) {
        node.find({name:id},function (err,nodes) {
            res.send(nodes)
        })
    };

    this.getLastOneNodeById=function (id,callback) {
        redisClient.get(id, function (err, node) {
            if(!err && node){
                node = JSON.parse(node);
                //redis存的时候把socket上传的data序列化成了{type:'Buffer',data[]} 在此处重新new Buffer()
                node.buffer = new Buffer(node.buffer.data);
                // logger.info(node);
                // logger.info('sss' + node);
                let json = ParseData.mongoParse(node);
                callback&&callback(err, json);
            }else{
                callback&&callback(err,null);
            }
        });

        /*node.find({equip_id:id}).sort({'time':-1}).limit(1).exec(function (err,nodes) {
            if(nodes[0]){
                let json = ParseData.mongoParse(nodes[0]);
                callback&&callback(err,json);
            }else{
                callback&&callback(err,null);
            }
        })*/
    }
}
module.exports = new Node();