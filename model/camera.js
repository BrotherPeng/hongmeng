/**
 * Created by iqianjin-luming on 16/8/13.
 */
var connection = require('../module/connection');
var logger = require('../log').logger('mysql');
function Carmera() {
    this.get = function(res) {
        connection.acquire(function(err, con) {
            // con.query('select * from equipment', function(err, result) {
            con.query('SELECT c.id, c.name as cname,c.equip_id,c.key,p.name as pname FROM	camera c LEFT JOIN project p ON p.id = c.project_id where del != 0', function(err, result) {

                con.release();
                logger.info(result);
                console.log('**********************************');
                res.render('camera/list',{title:'摄像机管理',result:result});
            });
        });
    };
    this.getAllIdByProject=function (projectId,callback) {
        connection.acquire(function(err, con) {
            con.query('select equip_id from camera where project_id = ?',[projectId], function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    /*获取项目下的设备数量*/
    this.getCountByProject=function (projectId,callback) {
        connection.acquire(function(err, con) {
            con.query('select count(*) from camera where project_id = ?',[projectId], function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    /*按设备id获取设备所属项目名称*/
    this.getInfoByEquipId=function (equipId,callback) {
        connection.acquire(function(err, con) {
            con.query('select equip_id,project_id from camera where equip_id = ?',[equipId], function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    /*编辑事查看所有项目号及名称*/
    // this.getNameAndId = function (callback) {
    //     connection.acquire(function(err, con) {
    //         con.query('select id,name from project', function(err, result) {
    //             con.release();
    //             callback(err,result);
    //         });
    //     });
    // };

    this.getByName = function (name,callback) {
        connection.acquire(function(err, con) {
            con.query('select * from camera where name = "'+name+'"', function(err, result) {
                con.release();
                callback(err,result);
            });
        });
    };
    this.getById = function (id,callback) {
        connection.acquire(function(err, con) {
            // con.query('select * from equipment where id = "'+id+'"', function(err, result) {
            con.query('SELECT c.id, c.name as cname,c.equip_id,c.key,p.name as pname FROM	camera c LEFT JOIN project p ON p.id = c.project_id where c.id = "'+id+'"', function(err, result) {
                let Eresult = result;
                con.query('select id,name from project',function (err,result) {
                    con.release();
                    logger.info(result);
                    // let Aresult = Eresult.push(result);
                    let res = {
                        Eresult:Eresult,
                        Presult:result
                    };
                    console.log('+++++++++++++++++++');

                    console.log(res);
                    callback(err,res);
                })

            });
        });
    }
    //新增摄像机
    this.create = function(camera, res) {
        connection.acquire(function(err, con) {
            con.query('insert into camera set ?', camera, function(err, result) {
                con.release();
                if (err) {
                    //res.render('equipment/error');
                    res.send({success:false})
                } else {

                    // res.render({success:true},{title:'添加摄像机'});
                    // res.render('camera/add',{title:'摄像机管理',success:true});
                    res.send({success:true})
                }
            });
        });
    };
    // 修改摄像机
    this.update = function(camera, res) {
        console.log(camera)
        connection.acquire(function(err, con) {
            con.query('SELECT id FROM project WHERE project.name = ?', [camera.project_id.toString()], function(err, result) {
                console.log(result);
                if(err){
                    res.send({success:false})
                }else{
                    camera.project_id = result[0].id;
                    console.log(camera.project_id);
                    con.query('update camera set ? where id = ?', [camera, camera.id], function(err, result) {
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
    //删除摄像机
    this.delete = function(id, res) {
        connection.acquire(function(err, con) {
            // con.query('delete from camera where id = ?', [id], function(err, result) {
            //     con.release();
            //     if (err) {
            //         res.send({status: -1, message: 'Failed to delete'});
            //     } else {
            //         res.send({status: 1, message: 'Deleted successfully'});
            //     }
            // });
            con.query('update camera set del = 0 where id = ?', id, function(err, result) {
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
}
module.exports = new Carmera();