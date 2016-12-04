/**
 * Created by iqianjin-luming on 2016/11/27.
 */
var server = require('http').createServer();
var io = require('socket.io')(server);
var handle = require('./websocketHandle');
var webSocket = function(port){
    this.init(port);
};
webSocket.prototype={
    init:port=>{
        io.on('connection',handle);
        server.listen(port);
    }
}
module.exports={webSocket:webSocket,io:io};
