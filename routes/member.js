/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();
var logger = require('../log').logger('member');
var moment = require('moment');
var Users = require('../model/users');
/* 人员列表. */
router.get('/list', function(req, res, next) {
    Users.get(res);
});
/* 删除人员. */
router.get('/del', function(req, res, next) {
    let id=req.query.id;
    Users.delete(id,res);
});
/* 添加人员*/
router.get('/add', function (req, res, next) {
    res.render('member/add', {title: '监控中心'});
}).post('/add', function (req, res, next) {
    let username=req.body.username,
        password=req.body.password,
        role=req.body.role,
        time=moment().format('YYYY-MM-DD HH:mm:ss'),
        users={
            username:username,
            password:password,
            role_id:role,
            create_time:time
        };
    Users.create(users,res);
});
/* 编辑人员. */
router.get('/edit/:id', function(req, res, next) {
    Users.getById(req.params.id,function (err,result) {
        res.render('member/edit',{title: '监控中心',result:result})
    });
}).post('/edit/:id',function (req,res,next) {
    let id=req.params.id,
        username=req.body.username,
        password=req.body.password,
        role=req.body.role,
        users={
            id:id,
            username:username,
            password:password,
            role_id:role,
        };
    Users.update(users,res);
});
module.exports = router;
