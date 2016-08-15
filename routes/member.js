/**
 * Created by iqianjin-luming on 16/8/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/list', function(req, res, next) {
    res.render('member/list', { title: '金时佰德智能设备监控中心' });
});
/* GET home page. */
router.get('/add', function(req, res, next) {
    res.render('member/add', { title: '金时佰德智能设备监控中心' });
});
/* GET home page. */
router.get('/edit', function(req, res, next) {
    res.render('member/edit', { title: '金时佰德智能设备监控中心' });
});
module.exports = router;
