/**
 * Created by iqianjin-luming on 2016/10/5.
 */
var Project = require('../model/project');
var Member = require('../model/member');
var Equipment = require('../model/equipment');
var Promise = require('bluebird');
function getProject() {

};
//admin
getProject.prototype.getAllProject=function (callback) {
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
        var getCount=result.map(function (v) {
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
            callback&&callback({title: '监控中心',result:result});
        })
    })
};

//获取摄像头关联的项目
getProject.prototype.getAllCameraProject=function (callback) {
    let promise = new Promise(function (resolve, reject) {
        Project.getNameAndId(function (err,result) { //获取项目名
            if (!err){
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
    promise.then(function(result) {
        // success
        var getCount=result.map(function (v) {
            return new Promise(function (resolve) {
                Equipment.getCountCameraByProject(v.id,function (err,value) {
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
            callback&&callback({title: '监控中心',result:result});
        })
    })
};
//超级管理员
getProject.prototype.getSuperAdminProject=function (user_id,callback) {
    var getAdminUserIdList=function () {
        return new Promise(resolve=>{
           Member.getByOwnerId(user_id,(err,result)=>{
               resolve(result);
           });
        });
    };
    getAdminUserIdList().then(v=>{
        var eachUserIdList=v.map(item=>{
            return new Promise((resolve) => {
                Project.getNameAndIdByManageId(item.id,function (err,result) {
                    if (!err){
                        resolve(result);
                    }
                });
            });
        });
        Promise.all(eachUserIdList).then(result=>{

            let projectAll=[];
            result.forEach((m)=>{
                if(m.length){
                    projectAll=projectAll.concat(m)
                }
            });

            return projectAll;
        }).then(result=>{
            var getCount=result.map(function (v) {
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
                callback&&callback({title: '监控中心',result:result});
            })
        })
    });

};
//管理员
getProject.prototype.getAdminProject=function (user_id,callback) {
    let promise = new Promise(function (resolve, reject) {
        Project.getNameAndIdByManageId(user_id,function (err,result) {
            if (!err){
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
    promise.then(function(result) {
        // success
        var getCount=result.map(function (v) {
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
            callback&&callback({title: '监控中心',result:result});
        })
    })
};
module.exports=new getProject();
