/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function Project() {
    this.get = function(res) {
        connection.acquire(function(err, con) {
            con.query('select ' +
                'a.`id`,a.`name`,a.`owner_company`,a.`manage_company`,a.`create_name`,b.`email`,a.`create_time`,a.`comment`,b.`username` as `manage_name` ' +
                'from `project` a,`users` b where a.`manage_id`=b.`id`', function(err, result) {
                con.release();
                res.render('project/list',{title:'监控中心',result:result});
            });
        });
    };
    this.getByCreateName = function (name,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from project where create_name = "'+name+'"', function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    this.getNameAndId = function (callback) {
        connection.acquire(function(err, con) {
            con.query('select id,name from project', function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    this.getNameAndIdByManageId = function (manageId,callback) {
        connection.acquire(function(err, con) {
            con.query('select id,name from project where manage_id=?', manageId,function(err, result) {
                con.release();
                callback(err,result);
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
    };
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