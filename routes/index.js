var express = require('express');
var logger = require('../log');
var router = express.Router();
var Project = require('../model/project');

/* GET home page. */
router.get('/', function(req, res, next) {
    let promise = new Promise(function (resolve, reject) {
        Project.getNameAndId(function (err,result) {
            if (!err){
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
    promise.then(function(result) {
        // success
        console.log(result);
        res.render('index', {title: '监控中心',result:result});
    }, function(value) {
        // failure
    })
});

module.exports = router;
