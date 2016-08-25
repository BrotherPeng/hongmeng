/**
 * Created by iqianjin-luming on 16/8/2.
 */
var logger = require("../log").logger('socket');
var node = require("../module/db").node;
var ParseData = require("../lib/socket/parseData");
function Node() {
    this.getAll=function (res) {
        node.find(function (err,nodes) {
            res.send(nodes)
        })
    }
    this.getNodeById=function (id,res) {
        node.find({name:id},function (err,nodes) {
            res.send(nodes)
        })
    }
    this.getLastOneNodeById=function (id,res) {
        node.find({name:id}).sort({'_id':-1}).limit(1).exec(function (err,nodes) {
            let json = ParseData.mongoParse(nodes[0].buffer);
            res.send(json);
        })
    }
}
module.exports = new Node();