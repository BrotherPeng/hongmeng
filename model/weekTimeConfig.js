/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function weekTimeConfig() {
    this.getByEquipId = function (equipId,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from weekTimeConfig where equip_id =?',[equipId], function(err, result) {
                con.release();
                logger.info(result);
                callback(err,result);
            });
        });
    }
    this.create = function(equipment, res) {
        connection.acquire(function(err, con) {
            con.query('insert into equipment set ?', equipment, function(err, result) {
                con.release();
                if (err) {
                    res.render('equipment/error');
                } else {

                    res.render('equipment/success',{title:'监控中心'});
                }
            });
        });
    };
    this.update = function(equipment, res) {
        connection.acquire(function(err, con) {
            con.query('update equipment set ? where id = ?', [equipment, equipment.id], function(err, result) {
                con.release();
                if (err) {
                    res.render('equipment/error');
                } else {
                    res.render('equipment/success',{title:'监控中心'});
                }
            });
        });
    };
    this.delete = function(id, res) {
        connection.acquire(function(err, con) {
            con.query('delete from equipment where id = ?', [id], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: -1, message: 'Failed to delete'});
                } else {
                    res.send({status: 1, message: 'Deleted successfully'});
                }
            });
        });
    };
}
module.exports = new weekTimeConfig();