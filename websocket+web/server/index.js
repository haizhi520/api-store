var ws = require("nodejs-websocket")
// websocket 连接
/*  []
{
    name:名称
    type:online/leave/enter 在线/离开/进入
    msg:发言
}
*/
let list = []
let serial = 0 
var server = ws.createServer(function (conn) {
    console.log("New connection")
    // 发送一个消息 （当前的聊天记录）
    // 再发送一个进入的消息（哪个用户进来了）
    conn.nickName = "user:" + serial
    serial ++
    let mes = {
        user:conn.nickName,
        type:"enter",
        msg:"进来了"
    }
    broadcast(JSON.stringify(mes))
    conn.on("text", function (str) {
        let mes = {
            user:conn.nickName,
            type:"online",
            msg:str
        }
        broadcast(JSON.stringify(mes))
    })
    conn.on("close", function (code, reason) {
        let mes = {
            user:conn.nickName,
            type:"leave",
            msg:"离开了"
        }
        broadcast(JSON.stringify(mes))
    })
}).listen(8001)


function broadcast(msg) { // 广播函数 
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}
