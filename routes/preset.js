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
/* 预置列表. */
router.get('/list', function (req, res, next) {
    let ownerId = req.user[0].id,
        roleId = req.user[0].role_id;
    Preset.getAll(function (err, daily) {
        res.render('preset/list', { title: '预置管理', result: daily });
    });
});
/* 删除预置. */
router.get('/del', function (req, res, next) {
    let id = req.query.id;
    let type = req.query.type;
    Preset.delete(id, type, res);
});
/* 添加预置*/
router.get('/add', function (req, res, next) {
    res.render('preset/add', { title: '添加预置', role_id: req.user[0].role_id }); //返回用户角色到前端
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

    switch (type) {
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

    if (type === 0) {
        weekTimeServer.savePresetConfig(config1, res);
    } else if (type === 1) {
        dailyTimeServer.savePresetConfig(config1, res);
    }

});

router.post('/update', function (req, res, next) {
    let data,
        // id = req.params.id,
        id = Number(req.body.id),
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

    switch (type) {
        case 0:
            config = {
                // id: id,
                type: type,
                openTime: openTime,
                closeTime: closeTime,
                btnState: btnState
            };
            config1 = {
                id: id,
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
                id: id,
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

    if (type === 0) {
        weekTimeServer.savePresetConfig(config1, res);
    } else if (type === 1) {
        dailyTimeServer.savePresetConfig(config1, res);
    }

});

//按设备id单个周模式查询
router.get('/all', (req, res) => {
    Preset.getAll(function (err, value) {
        if (!err) {
            res.send(value);
        }
    });
});

module.exports = router;
