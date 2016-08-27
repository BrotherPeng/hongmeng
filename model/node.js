/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../log").logger('socket');
var node = require("../module/db").node;
var ParseData = require("../lib/socket/parseData");
var equipment = require("../model/equipment");
function Node() {
    let _this=this;
    this.getAll=function (res) {
        node.find(function (err,nodes) {
            res.send(nodes)
        })
    };
    /*按项目获取所有节点的最后一条数据*/

    this.getAllLastOneInProject=function (projectId,res) {
        let promise = new Promise(function (resolve, reject) {
            equipment.getAllIdByProject(projectId,function (err,result) {
                if (!err){
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        });
        promise.then(function(value) {
            // success
            let promise_1 = new Promise(function (resolve,reject) {
                value.forEach(function (v) {
                    _this.getLastOneNodeById(v.equip_id,function (err,result) {
                        if (!err){
                            resolve(result);
                        } else {
                            nodeList.push(null);
                        }
                    })
                });
            });
            promise_1.then(function (value) {
                res.send(value);
            })

        }, function(value) {
            // failure
        })


    };

    this.getNodeById=function (id,res) {
        node.find({name:id},function (err,nodes) {
            res.send(nodes)
        })
    };

    this.getLastOneNodeById=function (id,callback) {
        node.find({name:id}).sort({'_id':-1}).limit(1).exec(function (err,nodes) {
            if(nodes[0]){
                let json = ParseData.mongoParse(nodes[0].buffer);
                callback&&callback(err,json);
            }else{
                callback&&callback(err,null);
            }

        })
    }
}
module.exports = new Node();