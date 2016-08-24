/**
 * Created by iqianjin-luming on 16/8/2.
 */
var express = require('express');
var router = express.Router();
var logger = require("../log").logger('socket');
var node = require("../module/db").node;
var Node = require("../model/node");
/* GET home page. */
router.get('/', function(req, res, next) {
    var clientList = require("../lib/socket/socketHandle").clientList;
    clientList["1001400234700001"].write("response/r/n");
    res.send("ok");
});

router.get('/all', function(req, res, next) {
    Node.getAll(res);
});
router.get('/id/:id', function(req, res, next) {
    let id=req.params.id;
    Node.getLastOneNodeById(id,res);
});
module.exports = router;