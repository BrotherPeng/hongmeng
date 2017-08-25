/**
 * Created by Administrator on 2017/5/11.
 */
/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();
var logger = require('../log').logger('member');
var moment = require('moment');
var Camera = require('../model/camera');
var Project = require('../model/project');
const fs  = require('fs');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

var io = require('../lib/websocket/websocketServer').io;
// router.post('/upload', function(req, res, next) {
//     io.emit('newImgUrl', {id: req.body.id, url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503553042192&di=b16bd4bfb9d837eaa264f3bc0e9a6edc&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1612522R8-4.jpg'});
// });
var cpUpload = upload.fields([{ name: 'data', maxCount: 1 }]);
router.post('/upload', cpUpload, function(req, res, next) {
    console.log('.............');
    // dirname
    const id = req.body.id;
    const target_path = dirname + '/public/images/' + req.files.data[0].filename + '.jpg';
    const imgUrl = '/images/' + req.files.data[0].filename + '.jpg';
    Camera.updateCameraPic([new Date().getTime(), imgUrl, id], function (result) {
        io.emit('newImgUrl', {id: id, url: imgUrl}); //通知前端刷新图片链接
        res.send({success: true, id: id});
    });
    return;

    fs.rename(req.files.data[0].path, target_path, function(err) {
        if (err){
            return res.send({success: false, message: err.message});
        }
        Camera.updateCameraPic([new Date().getTime(), imgUrl, id], function (result) {
            io.emit('newImgUrl', {id: id, url: imgUrl}); //通知前端刷新图片链接
            res.send({success: true, id: id});
        });
    });

});

/* 摄像机列表. */
router.get('/list', function(req, res, next) {
    switch(req.user[0].role_id){
        case 1:
            Camera.get(res);
            break;
        case 2:
            Camera.get(res);
            break;
        case 3:
            res.send('权限不足');
            break;
        case 4:
            // res.send('权限不足');
            res.render('equipment/list',{title:'摄像机管理', denied: true});
            break;
        case 5:
            res.send('权限不足');
            break;
    };
});

router.get('/id', function (req, res) {
   var projectId = req.query.projectId;
   Camera.getAllCameraInProject(projectId, res);
});

/*router.get('/refresh', function (req, res) {
   var cameraId = req.query.cameraId;
   Camera.getUpdateCameraPic(cameraId, res);
});*/

/* 删除摄像机. */
router.get('/del', function(req, res, next) {
    let id=req.query.id;
    Camera.delete(id,res);
});
/* 添加摄像机*/
router.get('/add', function (req, res, next) {
    logger.info(req.user[0].role_id);
    if(req.user[0].role_id != 1 && req.user[0].role_id !=2){
        logger.info('没有添加权限');
        return res.render('camera/add',{ denied: true });
    }
    Project.getNameAndId((err,result)=>{
        console.log(result)
        res.render('camera/add',{result:result});
    })
}).post('/add', function (req, res, next) {
    let name=req.body.name,
        user_id=req.user[0].id,
        equip_id=req.body.equip_id,
        key=req.body.key,
        project_id=req.body.project_id,
        time=moment().format('YYYY-MM-DD HH:mm:ss'),
        camera={
            name:name,
            equip_id:equip_id,
            key:key,
            user_id:user_id,
            project_id:project_id,
            del:1,
            create_time:time
        };
    Camera.create(camera,res);
});
/* 编辑摄像机 */
router.get('/edit/:id', function(req, res, next) {
    Camera.getById(req.params.id,function (err,result) {
        res.render('camera/edit',{title: '摄像机管理',result:result})
    });
}).post('/edit/:id',function (req,res,next) {
    console.log(req.body)
    let id=req.params.id,
        name=req.body.name,
        project_id=req.body.project_id,
        equip_id=req.body.equip_id,
        key=req.body.key,
        camera={
            id:id,
            project_id:project_id,
            name:name,
            equip_id:equip_id,
            key: key
        };
    Camera.update(camera,res);
});

// router.get('/addCamera', function(req, res, next) {
//     // Equipment.getById(req.params.id,function (err,result) {
//     //     res.render('equipment/addCamera',{title: '监控中心',result:result})
//     // });
//     res.render('camera/add',{title: '摄像机管理'});
// })
module.exports = router;
