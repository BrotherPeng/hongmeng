/**
  * Created by liyun on 2017/2/14.
  * Author: yunpengl@genice.cc
  * Date: 2017/2/14
  * Time: 9:50
  * 
  */


'use strict';
var redis = require("redis");
var logger = require("../log").logger('redisClient');
var redisClient = redis.createClient(6379, '127.0.0.1', {db: 2});//创建redis连接，选择数据库2
redisClient.on("error", function (err) {
    logger.error('redisClient start: ' + err);
});

module.exports = redisClient;