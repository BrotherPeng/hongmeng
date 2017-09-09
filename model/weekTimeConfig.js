/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function weekTimeConfig() {
    this.getByEquipId = function (equipId,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from weekTimeConfig where equip_id =?',equipId, function(err, result) {
                logger.debug('weekTimeConfig...');
                logger.debug(err);
                con.release();
                callback(err,result);
            });
        });
    }
    this.create = function(weekTimeConfig, callback) {
        connection.acquire(function(err, con) {
            con.query('insert into weekTimeConfig set ?', weekTimeConfig, function(err, result) {
                con.release();
                if (err) {
                    callback(err,result);
                } else {
                    callback(err,result);
                }
            });
        });
    };
    this.update = function(weekTimeConfig, callback) {
        connection.acquire(function(err, con) {
            con.query('update weekTimeConfig set ? where equip_id = ?', [weekTimeConfig, weekTimeConfig.equip_id], function(err, result) {
                con.release();
                if (err) {
                    callback(err,result);
                } else {
                    callback(err,result);
                }
            });
        });
    };
    this.delete = function(equip_id, callback) {
        connection.acquire(function(err, con) {
            con.query('delete from weekTimeConfig where equip_id = ?', [equip_id], function(err, result) {
                con.release();
                if (err) {
                    callback(err,result);
                } else {
                    callback(err,result);
                }
            });
        });
    };
}
module.exports = new weekTimeConfig();