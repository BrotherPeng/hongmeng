/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function weekTimeConfig() {
    this.getByEquipId = function (equipId,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from dailyTimeConfig where equip_id =?',[equipId], function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    }
    this.create = function(dailyTimeConfig, callback) {
        connection.acquire(function(err, con) {
            con.query('insert into dailyTimeConfig set ?', dailyTimeConfig, function(err, result) {
                con.release();
                callback(err, result);
            });
        });
    };
    this.update = function(dailyTimeConfig, callback) {
        connection.acquire(function(err, con) {
            con.query('update dailyTimeConfig set ? where equip_id = ?', [dailyTimeConfig, dailyTimeConfig.equip_id], function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    this.delete = function(equip_id, callback) {
        connection.acquire(function(err, con) {
            con.query('delete from dailyTimeConfig where equip_id = ?', [equip_id], function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
}
module.exports = new weekTimeConfig();