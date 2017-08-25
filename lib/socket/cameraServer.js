const net = require('net');
const server = net.createServer();
var io=require('../websocket/websocketServer').io;
var logger = require("../../log").logger('socket');
var equip = require("../../model/equipment");

let sockets = {};
let socketIds = {};
server.listen(3006, '127.0.0.1');
server.on('connection', function (sk) {
    sk.name = sk.remoteAddress + ":" + sk.remotePort;
    logger.info('..................设备已连接...................');
    // console.info();
    sk.on("data", function (data) {
        logger.info('..........................heart.........................');
        data = data.toString();
        if (data.indexOf('heart') > -1) { //心跳 heart&1212121
            const id = data.split('&')[1];
            sockets[sk.name] = sk; //按id保存连接实例
            socketIds[id] = sk.name; //保存在线的id
            let ids = [];
            for(let a in socketIds){
                ids.push(a);
            }
            equip.getProjectOfCamera(ids.join(','), function (err, result) {
                try {
                    io.emit('socketIds',result);
                }catch (e){
                    logger.info(e);
                }
            });
        }
    });

    //断线
    sk.on('end', function () {
        logger.info('连接结束');
        clearInterval(interval); //清除定时器
    });

    sk.on('close', function () {
        logger.info('连接关闭');
        clearInterval(interval); //清除定时器
        delete sockets[sk.name]; //连接关闭就删掉
        delete socketIds[sk.name];
        io.emit('socketIds',socketIds);
    });

    sk.on('error', function (data) {
        logger.error('连接错误');
        sk.destroy();
        clearInterval(interval); //清除定时器
    });

    let interval = setInterval(function () {
        try {
            sk.write('getpicture&111');
        }catch (e){
            logger.error(e);
        }
    }, 10000);
});



exports.sockets = sockets;
exports.socketIds = socketIds;