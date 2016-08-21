/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();
var logger = require('../log').logger('member');
var moment = require('moment');
var Member = require('../model/member');
var roles = require('../module/roles');
/* 人员列表. */
router.get('/list',function(req, res, next) {
    let ownerId = req.user[0].id;
    if(req.user.is('admin')){
        Member.getAll(res);
    }else if(roles.can('access member page')){
        Member.getByOwnerId(ownerId,function (err,result) {
            res.render('member/list',{title:'监控中心',result:result});
        });
    }else{
        res.render("只有admin才有此权限");
    }
});
/* 删除人员. */
router.get('/del', function(req, res, next) {
    let id=req.query.id;
    Member.delete(id,res);
});
/* 添加人员*/
router.get('/add', function (req, res, next) {
    res.render('member/add', {title: '监控中心'});
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
    Member.update(users,res);
});
module.exports = router;
