var express = require('express');
var logger = require('../log');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '监控中心' });
});

module.exports = router;
