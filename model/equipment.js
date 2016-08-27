/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function Equipment() {
    this.get = function(res) {
        connection.acquire(function(err, con) {
            con.query('select * from equipment', function(err, result) {
                con.release();
                logger.info(result);
                res.render('equipment/list',{title:'监控中心',result:result});
            });
        });
    };
    this.getAllIdByProject=function (projectId,callback) {
        connection.acquire(function(err, con) {
            con.query('select equip_id from equipment where project_id = ?',[projectId], function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    this.getByName = function (name,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from equipment where name = "'+name+'"', function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    this.getById = function (id,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from equipment where id = "'+id+'"', function(err, result) {
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
module.exports = new Equipment();