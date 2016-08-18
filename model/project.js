/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function Project() {
    this.get = function(res) {
        connection.acquire(function(err, con) {
            con.query('select * from project', function(err, result) {
                con.release();
                logger.info(result);
                res.render('project/list',{title:'监控中心',result:result});
            });
        });
    };
    this.getByName = function (name,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from project where name = "'+name+'"', function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    this.getById = function (id,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from project where id = "'+id+'"', function(err, result) {
                con.release();
                logger.info(result);
                callback(err,result);
            });
        });
    }
    this.create = function(project, res) {
        connection.acquire(function(err, con) {
            con.query('insert into project set ?', project, function(err, result) {
                con.release();
                if (err) {
                    res.render('project/error');
                } else {

                    res.render('project/success',{title:'监控中心'});
                }
            });
        });
    };
    this.update = function(project, res) {
        connection.acquire(function(err, con) {
            con.query('update project set ? where id = ?', [project, project.id], function(err, result) {
                con.release();
                if (err) {
                    res.render('project/error');
                } else {
                    res.render('project/success',{title:'监控中心'});
                }
            });
        });
    };
    this.delete = function(id, res) {
        connection.acquire(function(err, con) {
            con.query('delete from project where id = ?', [id], function(err, result) {
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
module.exports = new Project();