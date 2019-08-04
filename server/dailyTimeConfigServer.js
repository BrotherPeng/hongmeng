/**
 * Created by iqianjin-luming on 16/9/16.
 */
let weekTimeDao = require('../model/weekTimeConfig');
let dailyTimeDao = require('../model/dailyTimeConfig');
let preset = require('../model/preset');
let logger = require("../log").logger('mysql');
let Promise = require('bluebird');
function dailyTimeServer() {

}
/*
 * 1.根据设备id查询是否在日设置中存在，如果存在则删除；
 * 2.根据设备id查询是否在周设置中存在，如果存在则更新，如果不存在则新增
 * */
dailyTimeServer.prototype.saveConfig = function (config) {
    let equipId = config.id,
        timeConfig = {};
    timeConfig.day_conf = config.btnState;
    timeConfig['equip_id'] = config.id;
    for (let i = 0; i < config.startDay.length; i += 2) {
        timeConfig['start_' + (i / 2 + 1)] = config.startDay[i] + '-' + config.startDay[i + 1];
    }
    for (let i = 0; i < config.endDay.length; i += 2) {
        timeConfig['end_' + (i / 2 + 1)] = config.endDay[i] + '-' + config.endDay[i + 1];
    }
    for (let i = 0; i < config.openTime.length; i += 2) {
        let h = parseInt(config.openTime[i]),
            m = parseInt(config.openTime[i + 1]);
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        timeConfig['open_' + (i / 2 + 1)] = h + ':' + m;
    }
    for (let i = 0; i < config.closeTime.length; i += 2) {
        let h = parseInt(config.closeTime[i]),
            m = parseInt(config.closeTime[i + 1]);
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        timeConfig['close_' + (i / 2 + 1)] = h + ':' + m;
    }
    /*查询weekTime表是否存在该id*/
    var saveFellow = new Promise((resolve) => {
        weekTimeDao.getByEquipId(equipId, (err, result) => {
            if (result.length) {
                resolve(1);
            } else {
                resolve(0);
            }
        })
    });
    /*存在则删除*/
    saveFellow.then((status) => {
        if (status !== 0) {
            return new Promise((resolve) => {
                weekTimeDao.delete(equipId, () => {
                    resolve(equipId);
                })
            }
            )

        } else {
            return equipId;
        }
    }).then((equipId) => {/*根据设备id查询是否在日设置中存在*/
        return new Promise(resolve => {
            dailyTimeDao.getByEquipId(equipId, (err, result) => {
                if (result.length) {
                    resolve(result[0]);
                } else {
                    resolve(0);
                }
            })
        })

    }).then(result => {/*存在则更新，不存在则新增*/
        if (result !== 0) {
            dailyTimeDao.update(timeConfig, function (err, result) {
                logger.info(result);
                logger.info(err);
                return result;
            });
        } else {
            dailyTimeDao.create(timeConfig, function (err, result) {
                logger.info(result);
                logger.info(err);
                return result;
            });
        }
    });
}


dailyTimeServer.prototype.savePresetConfig = function (config, res) {
    // let equipId = config.id,
    let timeConfig = { name: config.name, describe: config.describe };
    timeConfig.day_conf = config.btnState;
    // timeConfig['equip_id'] = config.id;
    for (let i = 0; i < config.startDay.length; i += 2) {
        timeConfig['start_' + (i / 2 + 1)] = config.startDay[i] + '-' + config.startDay[i + 1];
    }
    for (let i = 0; i < config.endDay.length; i += 2) {
        timeConfig['end_' + (i / 2 + 1)] = config.endDay[i] + '-' + config.endDay[i + 1];
    }
    for (let i = 0; i < config.openTime.length; i += 2) {
        let h = parseInt(config.openTime[i]),
            m = parseInt(config.openTime[i + 1]);
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        timeConfig['open_' + (i / 2 + 1)] = h + ':' + m;
    }
    for (let i = 0; i < config.closeTime.length; i += 2) {
        let h = parseInt(config.closeTime[i]),
            m = parseInt(config.closeTime[i + 1]);
        if (h < 10) {
            h = '0' + h;
        }
        if (m < 10) {
            m = '0' + m;
        }
        timeConfig['close_' + (i / 2 + 1)] = h + ':' + m;
    }

    if (config.id) {
        preset.updateDailyPreset(timeConfig, config.id, res);
    } else {
        preset.createDailyPreset(timeConfig, res);
    }

}

module.exports = new dailyTimeServer();