/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();
var logger = require('../log').logger('member');
var moment = require('moment');
var Equipment = require('../model/equipment');
var Project = require('../model/project');
/* 项目列表. */
router.get('/list', function(req, res, next) {
    logger.info('角色...');
    logger.info(req.user[0].role_id);
    switch(req.user[0].role_id){
        case 1:
            Equipment.get(res);
            break;
        case 2:
            Equipment.get(res);
            break;
        case 3:
            res.send('权限不足');
            break;
        case 4:
            res.render('equipment/list',{title:'设备管理', denied: true});
            break;
        case 5:
            res.send('权限不足');
            break;
    };
});
/* 删除项目. */
router.get('/del', function(req, res, next) {
    let id=req.query.id;
    Equipment.delete(id,res);
});
/* 添加项目*/
router.get('/add', function (req, res, next) {
    logger.info(req.user[0].role_id);
    if(req.user[0].role_id != 1 && req.user[0].role_id !=2){
        logger.info('没有添加权限');
        return res.render('equipment/add',{ denied: true });
    }
    Project.getNameAndId((err,result)=>{
        console.log(result)
        res.render('equipment/add',{result:result});
    })
}).post('/add', function (req, res, next) {
    let name=req.body.name,
        user_id=req.user[0].id,
        equip_id=req.body.equip_id,
        key=req.body.key,
        project_id=req.body.project_id,
        time=moment().format('YYYY-MM-DD HH:mm:ss'),
        equipment={
            name:name,
            equip_id:equip_id,
            key:key,
            user_id:user_id,
            project_id:project_id,
            create_time:time
        };
    Equipment.create(equipment,res);
});
/* 编辑设备信息 */
router.get('/edit/:id', function(req, res, next) {
    Equipment.getById(req.params.id,function (err,result) {
        res.render('equipment/edit',{title: '编辑设备信息',result:result})
    });
}).post('/edit/:id',function (req,res,next) {
    console.log(req.body)
    let id=req.params.id,
        name=req.body.name,
        project_id=req.body.project_id,
        equip_id=req.body.equip_id,
        key=req.body.key,
        equipment={
            id:id,
            project_id:project_id,
            name:name,
            equip_id:equip_id,
            key: key
        };
    Equipment.update(equipment,res);
});

router.get('/addCamera', function(req, res, next) {
    // Equipment.getById(req.params.id,function (err,result) {
    //     res.render('equipment/addCamera',{title: '监控中心',result:result})
    // });
        res.render('equipment/addCamera',{title: '设备管理'});
})
module.exports = router;
