/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();
var logger = require('../log').logger('member');
var moment = require('moment');
var Member = require('../model/member');
var Project = require('../model/project');
/* 项目列表. */
router.get('/list', function(req, res, next) {
    Project.get(res);
});
/* 删除项目. */
router.get('/del', function(req, res, next) {
    let id=req.query.id;
    Project.delete(id,res);
});
/* 添加项目*/
router.get('/add', function (req, res, next) {
    let id = req.user[0].id;
    Member.getIdAndNameByOwnerIdLimitRole(id,function (err,result) {
        res.render('project/add', {title: '监控中心',result:result});
    })
}).post('/add', function (req, res, next) {
    let name=req.body.name,
        owner_company=req.body.owner_company,
        manage_company=req.body.manage_company,
        create_name=req.user[0].username,
        manage_id=req.body.manage_id,
        comment=req.body.comment,
        time=moment().format('YYYY-MM-DD HH:mm:ss'),
        project={
            name:name,
            create_name:create_name,
            owner_company:owner_company,
            manage_company:manage_company,
            manage_id:manage_id,
            comment:comment,
            create_time:time
        };
    Project.create(project,res);
});
/* 编辑项目 */
router.get('/edit/:id', function(req, res, next) {
    Project.getById(req.params.id,function (err,result) {
        res.render('project/edit',{title: '监控中心',result:result})
    });
}).post('/edit/:id',function (req,res,next) {
    let id=req.params.id,
        name=req.body.name,
        project={
            id:id,
            name:name,
        };
    console.log(req);
    Project.update(project,res);
});
module.exports = router;
