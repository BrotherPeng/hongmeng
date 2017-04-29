/**
 * Created by iqianjin-luming on 16/8/2.
 */
var express = require('express');
var router = express.Router();
var logger = require("../log").logger('nodeControl');
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
router.get('/', function (req, res) {
    var clientList = require("../lib/socket/socketHandle").clientList;
    clientList["1001400234700001"].write("response/r/n");
    res.send("ok");
});

router.get('/all', function (req, res) {
    Node.getAll(res);
});
//节点状态
router.get('/id', function (req, res) {
    var projectId = req.query.projectId;
    Node.getAllLastOneInProject(projectId, res);
}).post('/id/:id', function (req, res) {
    let data,
        id = req.params.id,
        type = Number(req.body.type),
        openTime = req.body.openTime,
        closeTime = req.body.closeTime,
        btnState = req.body.btnState,
        code = 1,
        message = 'success',
        config;
    if (openTime && closeTime) {
        openTime = openTime.split(',');
        closeTime = closeTime.split(',');
    }
    let sendData = require("../lib/socket/socketHandle").send;

    switch (type){
        case 0:
            config = {
                id: id,
                type: type,
                openTime: openTime,
                closeTime: closeTime,
                btnState: btnState
            };
            data = InitData.initTimeConfigData(config);
            break;
        case 1:
            let startDay = req.body.startDay,
                endDay = req.body.endDay;
            startDay = startDay.split(',');
            endDay = endDay.split(',');
            config = {
                id: id,
                type: type,
                startDay: startDay,
                endDay: endDay,
                openTime: openTime,
                closeTime: closeTime,
                btnState: btnState
            };
            data = InitData.initDayTimeConfigData(config);
            break;
        case 2:
            let switchStatus = req.body.switchStatus;
            config = {
                id: id,
                type: type,
                switchStatus: switchStatus
            };
            data = InitData.initSwitchControlData(config);
            break;
    }


    let sendFun = new Promise(function (resolve) {
        sendData(id, data, function (result) {
            resolve(result)
        });
    });
    sendFun.timeout(10000).then(v=> {
        if(type===0){
            weekTimeServer.saveConfig(config);
        }else if(type===1){
            dailyTimeServer.saveConfig(config);
        }
        res.send(v);
    }).catch(Promise.TimeoutError, function () {
        res.send({code: -2, message: "could not get response data within 2000ms",equip_id:id});//超时-2
    });

});
router.post('/group/id/:id', (req, res) => {
    let program_id = req.params.id,
        type = Number(req.body.type),
        openTime = req.body.openTime,
        closeTime = req.body.closeTime,
        btnState = req.body.btnState,
        code = 1,
        message = 'success',
        data,
        config;
    if (openTime && closeTime) {
        openTime = openTime.split(',');
        closeTime = closeTime.split(',');
    }
    let sendData = require("../lib/socket/socketHandle").send;

    let getEquipId = ()=> {
        return new Promise((resolve)=> {
            equipment.getAllIdByProject(program_id, (err, result)=> {
                if (err) {
                    res.send({code: -1, message: err})
                } else {
                    resolve(result);
                }
            })
        })
    };

    getEquipId().then(result=> {
        let sendDataFun = result.map((v)=> {
            return new Promise(resolve=> {
                let sendFun = new Promise(resolve => {
                    switch (type) {
                        case 0:
                            config = {
                                id: v.equip_id,
                                type: type,
                                openTime: openTime,
                                closeTime: closeTime,
                                btnState:btnState
                            };
                            data = InitData.initTimeConfigData(config);
                            break;
                        case 1:
                            let startDay = req.body.startDay,
                                endDay = req.body.endDay;
                            btnState = req.body.btnState;
                            startDay = startDay.split(',');
                            endDay = endDay.split(',');
                            config = {
                                id: v.equip_id,
                                type: type,
                                startDay: startDay,
                                endDay: endDay,
                                openTime: openTime,
                                closeTime: closeTime,
                                btnState:btnState
                            };
                            data = InitData.initDayTimeConfigData(config);
                            break;
                        case 2:
                            let switchStatus = req.body.switchStatus;
                            config = {
                                id: v.equip_id,
                                type: type,
                                switchStatus: switchStatus
                            };
                            data = InitData.initSwitchControlData(config);
                            break;
                    }
                    sendData(v.equip_id, data, function (result) {
                        resolve(result);
                    });
                });
                sendFun.timeout(10000).then(v=> {
                    if(type===0){
                        weekTimeServer.saveConfig(config);
                    }else if(type===1){
                        dailyTimeServer.saveConfig(config);
                    }
                    resolve(v);
                }).catch(Promise.TimeoutError, function () {
                    resolve({code: -2, message: "could not get response data within 2000ms",equip_id:v.equip_id});//超时-2
                });
            });
        });

        new Promise.all(sendDataFun).then(v=> {
            res.send(v);
        })
    })

});

//周模式查询
router.get('/weekTime/id', function (req, res) {
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
                    });
                });

            });
            Promise.all(actions).then(v=>res.send(v));
        } else {
            throw err;
        }
    });
});

//按设备id单个周模式查询
router.get('/weekTime/:id',(req,res)=>{
    let equipId=req.params.id;
    weekTime.getByEquipId(equipId, function (err, value) {
        if(!err){
            res.send(value);
        }
    });
});



//日模式查询
router.get('/dailyTime/id', function (req, res) {
    var projectId = req.query.projectId;
    equipment.getAllIdByProject(projectId, function (err, result) {
        if (!err) {
            var actions = result.map(v => {
                return new Promise(resolve=> {
                    dailyTime.getByEquipId(v.equip_id, function (err, value) {
                        if (err) {
                            logger.info(err);
                        } else {
                            resolve(value[0]);
                        }
                    });
                });

            });
            Promise.all(actions).then(v=>res.send(v));
        } else {
            throw err;
        }
    });
});
//按设备id单个日模式查询
router.get('/dailyTime/:id',(req,res)=>{
    let equipId=req.params.id;
    dailyTime.getByEquipId(equipId, function (err, value) {
        if(!err){
            res.send(value);
        }
    });
});
module.exports = router;