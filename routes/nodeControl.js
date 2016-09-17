/**
 * Created by iqianjin-luming on 16/8/2.
 */
var express = require('express');
var router = express.Router();
var logger = require("../log").logger('socket');
var node = require("../module/db").node;
var Node = require("../model/node");
var InitData = require('../lib/socket/initData');
var equipment = require("../model/equipment");
var weekTime = require("../model/weekTimeConfig");
var dailyTime = require("../model/dailyTimeConfig");
var Promise = require('bluebird');
let weekTimeServer = require('../server/weekTimeConfigServer');
let dailyTimeServer = require('../server/dailyTimeConfigServer');
/* GET home page. */
router.get('/', function(req, res, next) {
    var clientList = require("../lib/socket/socketHandle").clientList;
    clientList["1001400234700001"].write("response/r/n");
    res.send("ok");
});

router.get('/all', function(req, res, next) {
    Node.getAll(res);
});
//节点状态
router.get('/id', function(req, res, next) {
    var projectId = req.query.projectId;
    // if(req.user[0].role_id===1){
        Node.getAllLastOneInProject(projectId,res);
    // }else if(req.user[0].role_id===2||req.user[0].role_id===3){
    //
    // }else{
    //
    // }

}).post('/id/:id', function(req, res, next) {
    let data,
        id=req.params.id,
        type=Number(req.body.type),
        openTime=req.body.openTime,
        closeTime=req.body.closeTime,
        code=1,
        message='success';

    if(type===0){//周设置
        openTime=openTime.split(',');
        closeTime=closeTime.split(',');
        let config={
            id:id,
            type:type,
            openTime:openTime,
            closeTime:closeTime
        };
        data=InitData.initTimeConfigData(config);
        var clientList = require("../lib/socket/socketHandle").clientList;
        if(clientList[id]){
            clientList[id].write(data);
            weekTimeServer.saveConfig(config);
        }else{
            code=-1;
            message='false'
        }

        res.send({code:code,message:message});
    }else if(type===1){//日设置
        openTime=openTime.split(',');
        closeTime=closeTime.split(',');
        let startDay=req.body.startDay,
            endDay=req.body.endDay;
        startDay=startDay.split(',');
        endDay=endDay.split(',');
        let config = {
            id:id,
            type:type,
            startDay:startDay,
            endDay:endDay,
            openTime:openTime,
            closeTime:closeTime
        };
        data=InitData.initDayTimeConfigData(config);
        var clientList = require("../lib/socket/socketHandle").clientList;
        if(clientList[id]){
            clientList[id].write(data);
            dailyTimeServer.saveConfig(config);
        }else{
            code=-1;
            message='false';
        }
        res.send({code:code,message:message});
    }else{//继电器控制
        let switchStatus=req.body.switchStatus;
        let config = {
            id:id,
            type:type,
            switchStatus:switchStatus
        };
        data=InitData.initSwitchControlData(config);
        var clientList = require("../lib/socket/socketHandle").clientList;
        if(clientList[id]){
            clientList[id].write(data);
        }else{
            code=-1;
            message='false';
        }
        res.send({code:code,message:message});
    }

});

//周模式查询
router.get('/weekTime/id', function(req, res, next) {
    var projectId = req.query.projectId;
    equipment.getAllIdByProject(projectId, function (err, result) {
        if (!err) {
            var actions = result.map(v => {
                return new Promise(resolve=> {
                    weekTime.getByEquipId(v.equip_id, function (err, value) {
                        if (err) {
                            return err;
                        } else {
                            resolve(value[0]);
                        }
                    })
                })

            });
            Promise.all(actions).then(v=>res.send(v));
        } else {
            throw err;
        }
    });
})

//日模式查询
router.get('/dailyTime/id', function(req, res, next) {
    var projectId = req.query.projectId;
    equipment.getAllIdByProject(projectId, function (err, result) {
        if (!err) {
            var actions = result.map(v => {
                return new Promise(resolve=> {
                    dailyTime.getByEquipId(v.equip_id, function (err, value) {
                        if (err) {
                            return err;
                        } else {
                            resolve(value[0]);
                        }
                    })
                })

            });
            Promise.all(actions).then(v=>res.send(v));
        } else {
            throw err;
        }
    });
})
module.exports = router;