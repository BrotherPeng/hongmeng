/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function Equipment() {
    this.get = function(res) {
        connection.acquire(function(err, con) {
            // con.query('select * from equipment', function(err, result) {
            con.query('SELECT e.id, e.name as ename,e.equip_id,e.key,p.name as pname FROM	equipment e LEFT JOIN project p ON p.id = e.project_id', function(err, result) {

                con.release();
                logger.info(result);
                console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
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
    /*获取项目下的设备数量*/
    this.getCountByProject=function (projectId,callback) {
        connection.acquire(function(err, con) {
            con.query('select count(*) from equipment where project_id = ?',[projectId], function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    /*按设备id获取设备所属项目号*/
    this.getInfoByEquipId=function (equipId,callback) {
        connection.acquire(function(err, con) {
            con.query('select equip_id,project_id from equipment where equip_id = ?',[equipId], function(err, result) {
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
            // con.query('select * from equipment where id = "'+id+'"', function(err, result) {
            con.query('SELECT e.id, e.name as ename,e.equip_id,e.key,p.name as pname FROM	equipment e LEFT JOIN project p ON p.id = e.project_id where e.id = "'+id+'"', function(err, result) {
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
                    //res.render('equipment/error');
                    res.send({success:false})
                } else {

                    //res.render('equipment/success',{title:'监控中心'});
                    res.send({success:true})
                }
            });
        });
    };
    this.update = function(equipment, res) {
        console.log(equipment)
        connection.acquire(function(err, con) {
            con.query('SELECT id FROM project WHERE project.name = ?', [equipment.project_id.toString()], function(err, result) {
                console.log(result);
                if(err){
                    res.send({success:false})
                }else{
                    equipment.project_id = result[0].id;
                    console.log(equipment.project_id);
                    con.query('update equipment set ? where id = ?', [equipment, equipment.id], function(err, result) {
                        con.release();
                        if (err) {
                            //res.render('equipment/error');
                            res.send({success:false})
                        } else {
                            //res.render('equipment/success',{title:'监控中心'});
                            res.send({success:true})
                        }
                    });
                }
            })

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