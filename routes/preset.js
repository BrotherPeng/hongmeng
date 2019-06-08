/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();
var logger = require('../log').logger('member');
var moment = require('moment');
var Preset = require('../model/preset');
var roles = require('../module/roles');
var Promise = require('bluebird');
/* 人员列表. */
router.get('/list',function(req, res, next) {
    let ownerId = req.user[0].id,
        roleId = req.user[0].role_id;
        Preset.getAll(res);
    
});
/* 删除人员. */
router.get('/del', function(req, res, next) {
    let id=req.query.id;
    Member.delete(id,res);
});
/* 添加人员*/
router.get('/add', function (req, res, next) {
    res.render('member/add', {title: '添加人员', role_id: req.user[0].role_id}); //返回用户角色到前端
}).post('/add', function (req, res, next) {
    let username=req.body.username,
        password=req.body.password,
        role=req.body.role,
        mobile=req.body.mobile,
        email=req.body.email,
        ownerId=req.user[0].id,
        time=moment().format('YYYY-MM-DD HH:mm:ss'),
        users={
            username:username,
            password:password,
            role_id:role,
            mobile:mobile,
            email:email,
            owner_id:ownerId,
            create_time:time
        };
    Member.create(users,res);
});
/* 编辑人员. */
router.get('/edit/:id', function(req, res, next) {
    Member.getById(req.params.id,function (err,result) {
        res.render('member/edit',{title: '编辑人员',result:result})
    });
}).post('/edit/:id',function (req,res,next) {
    let id=req.params.id,
        username=req.body.username,
        password=req.body.password,
        // role=req.body.role, //genice 20170723角色不可编辑
        users={
            id:id,
            username:username,
            password:password,
            // role_id:role,
        };
    Member.update(users,res);
});
module.exports = router;
