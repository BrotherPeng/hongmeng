/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function Project() {
    this.get = function(res) {
        connection.acquire(function(err, con) {
            
        // select p.id,p.name,p.owner_company,p.manage_company,p.create_name,u.username,p.comment from  project p left join users u on p.manage_id = u.id
            con.query('select ' +
                'a.`id`,a.`name`,a.`owner_company`,a.`manage_company`,a.`create_name`,b.`email`,a.`create_time`,a.`comment`,b.`username` as `manage_name` ' +
                // 'from `project` a,`users` b where a.`manage_id`=b.`id`', function(err, result) {
                'from `project` a,`users` b where a.`manage_id`=b.`id`', function(err, result) {
            // con.query('select p.id,p.name,p.owner_company,p.manage_company,p.create_name,b.manage_id,u.username,p.comment from  project p left join users u on p.manage_id = u.id', function(err, result) {
                con.release();
                // logger.info(result);
                res.render('project/list',{title:'项目管理',result:result});
            });
        });
    };
    this.getByCreateName = function (name,callback) {
        connection.acquire(function(err, con) {
            // con.query('select * from project where create_name = "'+name+'"', function(err, result) {
            con.query('select p.id,p.name,p.owner_company,p.manage_company,p.create_name,p.manage_id,u.username,p.comment from  project p left join users u on p.manage_id = u.id where p.create_name = "'+name+'"', function(err, result) {
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

    this.getCount = function (res) {
        connection.acquire(function(err, con) {
            con.query('select  count(*) as Count from  project', function(err, result) {
                con.release();
                // callback(err,result);
                if(err){

                }else{
                    res.send(result);
                }
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
    //新增项目
    this.create = function(project, res) {
        connection.acquire(function(err, con) {
            con.query('insert into project set ?', project, function(err, result) {
                con.release();
                if (err) {
                    //res.render('project/error');
                    res.send({success:false})
                } else {

                    //res.render('project/success',{title:'监控中心'});
                    res.send({success:true})
                }
            });
        });
    };
    this.update = function(project, res) {
        connection.acquire(function(err, con) {
            con.query('update project set ? where id = ?', [project, project.id], function(err, result) {
                con.release();
                if (err) {
                    // res.render('project/error');
                    res.send({success:false})
                } else {
                    // res.render('project/success',{title:'监控中心'});
                    res.send({success:true})
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