var ws = require("nodejs-websocket")

const cusSender = [];
const cusReader = [];

// websocket 连接
var server = ws.createServer(function (conn) {
    console.log("建立了一个新的连接的效果")
    conn.on("text", function (str) {
        broadcast(str)
    })
    conn.on("close", function (code, reason) {
        console.log("close")
        broadcast("close")
    })
    conn.on("error", function (code, reason) {
        console.log("error")
        broadcast("error")
    })
}).listen(8001)


/*
    ice
    offer
    answer
*/ 
function broadcast (msg) { // 广播函数 
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}
