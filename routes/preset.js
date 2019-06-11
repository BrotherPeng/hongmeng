/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();
var logger = require('../log').logger('member');
var moment = require('moment');
var Preset = require('../model/preset');
var roles = require('../module/roles');
var Promise = require('bluebird');
var InitData = require('../lib/socket/initData');
let weekTimeServer = require('../server/weekTimeConfigServer');
let dailyTimeServer = require('../server/dailyTimeConfigServer');
/* 人员列表. */
router.get('/list',function(req, res, next) {
    let ownerId = req.user[0].id,
        roleId = req.user[0].role_id;
        Preset.getAll(res);
    
});
/* 删除人员. */
router.get('/del', function(req, res, next) {
    let id=req.query.id;
    Member.delete(id,res);
});
/* 添加人员*/
router.get('/add', function (req, res, next) {
    res.render('preset/add', {title: '添加人员', role_id: req.user[0].role_id}); //返回用户角色到前端
}).post('/add', function (req, res, next) {
    let data,
        // id = req.params.id,
        type = Number(req.body.type),
        openTime = req.body.openTime,
        closeTime = req.body.closeTime,
        btnState = req.body.btnState,
        code = 1,
        message = 'success',
        config,
        config1;
    if (openTime && closeTime) {
        openTime = openTime.split(',');
        closeTime = closeTime.split(',');
    }

    switch (type){
        case 0:
            config = {
                // id: id,
                type: type,
                openTime: openTime,
                closeTime: closeTime,
                btnState: btnState
            };
            config1 = {
                // id: id,
                type: type,
                openTime: req.body.openTime.split(','),
                closeTime: req.body.closeTime.split(','),
                btnState: btnState,
                name: req.body.name, 
                describe: req.body.describe
            };
            break;
        case 1:
            let startDay = req.body.startDay,
                endDay = req.body.endDay;
            startDay = startDay.split(',');
            endDay = endDay.split(',');
            config = {
                // id: id,
                type: type,
                startDay: startDay,
                endDay: endDay,
                openTime: openTime,
                closeTime: closeTime,
                btnState: btnState
            };
            config1 = {
                // id: id,
                type: type,
                startDay: startDay,
                endDay: endDay,
                openTime: req.body.openTime.split(','),
                closeTime: req.body.closeTime.split(','),
                btnState: btnState,
                name: req.body.name, 
                describe: req.body.describe
            };
            break;
        case 2:
            let switchStatus = req.body.switchStatus;
            config = {
                id: id,
                type: type,
                switchStatus: switchStatus
            };
            break;
    }

    if(type===0){
        weekTimeServer.savePresetConfig(config1, res);
    }else if(type===1){
        dailyTimeServer.saveConfig(config1, res);
    }

});
/* 编辑人员. */
router.get('/edit/:id', function(req, res, next) {
    Member.getById(req.params.id,function (err,result) {
        res.render('member/edit',{title: '编辑人员',result:result})
    });
}).post('/edit/:id',function (req,res,next) {
    let id=req.params.id,
        username=req.body.username,
        password=req.body.password,
        // role=req.body.role, //genice 20170723角色不可编辑
        users={
            id:id,
            username:username,
            password:password,
            // role_id:role,
        };
    Member.update(users,res);
});
module.exports = router;
