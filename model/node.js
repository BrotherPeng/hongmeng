/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../log").logger('socket');
var node = require("../module/db").node;
var ParseData = require("../lib/socket/parseData");
var equipment = require("../model/equipment");
var camera = require("../model/camera");
var Promise = require('bluebird');
var clientList=require('../lib/socket/socketHandle').clientList;
function Node() {
    let _this=this;
    this.getAll=function (res) {
        node.find(function (err,nodes) {
            res.send(nodes)
        })
    };
    /*按项目获取所有节点的最后一条数据*/

    this.getAllLastOneInProject = function (projectId, res) {
        equipment.getAllIdByProject(projectId, function (err, result) {
            if (!err) {
                var actions = result.map(v => {
                    return new Promise(resolve=> {
                        _this.getLastOneNodeById(v.equip_id, function (err, value) {
                            if (err) {
                                return err;
                            } else {
                                if(value){
                                    clientList[v.equip_id]?value.offline=false:value.offline=true;
                                }
                                resolve(value);
                            }
                        })
                    })

                });
                Promise.all(actions).then(v=>res.send(v));
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
        node.find({name:id}).sort({'_id':-1}).limit(1).exec(function (err,nodes) {
            if(nodes[0]){
                let json = ParseData.mongoParse(nodes[0]);
                callback&&callback(err,json);
            }else{
                callback&&callback(err,null);
            }

        })
    }
}
module.exports = new Node();