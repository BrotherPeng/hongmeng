var express = require('express');
var router = express.Router();
var Project = require('../model/project');
var Equipment = require('../model/equipment');
var Promise = require('bluebird');
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
        var getCount=result.map(function (v,i) {
            return new Promise(function (resolve) {
                Equipment.getCountByProject(v.id,function (err,value) {
                    if(!err){
                        resolve(value);
                    }
                })
            })
        });
        Promise.all(getCount).then(count=>{
            count.map(function (v,i) {
               result[i].count=v[0]['count(*)']
            });
            res.render('index', {title: '监控中心',result:result});
        })
    })

});

module.exports = router;
