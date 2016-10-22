/**
 * Created by iqianjin-luming on 16/9/16.
 */
let weekTimeDao = require('../model/weekTimeConfig');
let dailyTimeDao = require('../model/dailyTimeConfig');
let logger = require("../log").logger('mysql');
let Promise = require('bluebird');
let moment=require('moment');
function weekTimeServer() {

}
/*
 * 1.根据设备id查询是否在日设置中存在，如果存在则删除；
 * 2.根据设备id查询是否在周设置中存在，如果存在则更新，如果不存在则新增
 * */
weekTimeServer.prototype.saveConfig = function (config) {
    let equipId = config.id,
        timeConfig = {};
    timeConfig['equip_id'] = config.id;
    logger.info("开始保存设备："+config.id+"的周设置");
    for (let i = 0; i < config.openTime.length; i += 2) {
        timeConfig['open_time_' + (i / 2 + 1)] = parseInt(config.openTime[i],16) + ':' + parseInt(config.openTime[i + 1],16);
    }
    for (let i = 0; i < config.closeTime.length; i += 2) {
        timeConfig['close_time_' + (i / 2 + 1)] = parseInt(config.closeTime[i],16) + ':' + parseInt(config.closeTime[i + 1],16);
    }
    timeConfig.update_time=moment().format('YYYY-MM-DD HH:mm:ss');
    /*查询dailyTime表是否存在该id*/
    var saveFellow = new Promise((resolve)=> {
        dailyTimeDao.getByEquipId(equipId, (err, result)=> {
            if (result.length) {
                resolve(1);
            } else {
                resolve(0);
            }
        })
    });
    /*存在则删除*/
    saveFellow.then((status)=> {
        if (status !== 0) {
            return new Promise((resolve)=> {
                    dailyTimeDao.delete(equipId, ()=> {
                        resolve(equipId);
                    })
                }
            )

        } else {
            return equipId;
        }
    }).then((equipId)=> {/*根据设备id查询是否在周设置中存在*/
        return new Promise(resolve=> {
            weekTimeDao.getByEquipId(equipId, (err, result)=> {
                if (result.length) {
                    resolve(result[0]);
                } else {
                    resolve(0);
                }
            })
        })

    }).then(result=> {/*存在则更新，不存在则新增*/
        if (result !== 0) {
            logger.info("更新设备："+config.id+"的周设置"+timeConfig);
            weekTimeDao.update(timeConfig, function (err, result) {
                return result;
            });
        } else {
            logger.info("新增设备："+config.id+"的周设置"+timeConfig);
            weekTimeDao.create(timeConfig, function (err, result) {
                if(err){
                    logger.info("新增设备："+config.id+"的周设置错误"+err);
                }else{
                    return result;
                }
            });
        }
    });
}
module.exports = new weekTimeServer();