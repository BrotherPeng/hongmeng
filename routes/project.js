/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();
var logger = require('../log').logger('member');
var moment = require('moment');
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
    res.render('project/add', {title: '监控中心'});
}).post('/add', function (req, res, next) {
    let name=req.body.name,
        user_id=req.user[0].id,
        time=moment().format('YYYY-MM-DD HH:mm:ss'),
        project={
            name:name,
            user_id:user_id,
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
