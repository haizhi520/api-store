var ws = require("nodejs-websocket")
var http = require("http")
var fs = require("fs")


const cusSender = [];
const cusReader = [];

var server = http.createServer(function (request, response) {
    var { url, method } = request
    response.setHeader('Access-Control-Allow-Origin', '*')
    /* 获取当前的sdp信息 */
    if (url === '/data' && method == "GET") {
        fs.readFile('./data.json', function (err, data) {
            if (!err) {
                response.writeHead(200, { "Content-Type": "text/json;charset=UTF-8" });
                response.end(data);
            } else {
                throw err;
            }
        })
    } else {
        console.log("err");
    }
    /* 获取当前所有的候选人信息 */
    if (url === '/getAnswerList' && method == "GET") {
        fs.readFile('./data.json', function (err, data) {
            if (!err) {
                response.writeHead(200, { "Content-Type": "text/json;charset=UTF-8" });
                response.end(data);
            } else {
                throw err;
            }
        })
    } else {
        console.log("err");
    }
});
server.listen(8080);

// websocket 连接
var websocketServer = ws.createServer(function (conn) {
    console.log("建立了一个新的连接的效果")
    let sdpData = getOfferServer()
    if (sdpData) {
        broadcast(sdpData)
    }
    conn.on("text", function (str) {
        let isOffer = isSender(str)
        if (isOffer) {
            conn["admin"] = true //给分享端增加一个标志位
            addOfferServer(str);
        }
        broadcast(str)
    })
    conn.on("close", function (code, reason) {
        console.log("close")
        // 如何知道谁断开了websocket ，是ice还是offer
        // broadcast("close")
        if (conn["admin"]) {
            // let isOffer = isSender(JSON.stringify(data))
            // if(!isOffer) clearOfferServer();
            clearOfferServer()
        } else {

        }


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
    close_answer 
    close_offer
*/
function broadcast (msg) { // 广播函数 
    websocketServer.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}
function isSender (str) { // 筛选出来连接是offer还是answer
    let obj = JSON.parse(str)  // offer answer
    if (obj.type === "offer") {
        return true
    } else {
        return false
    }
}

function addOfferServer (str) { // 添加一个连接的分享的server
    fs.readFile("./data.json", function (err, data) {
        if (!err) {
            let obj = JSON.parse(data)
            if (obj.offer.uuid === "admin") { // 若存在则不需要写入
                return
            }
            let newStr = JSON.parse(str)
            obj.offer.sdp = newStr.sdp;
            obj.offer.uuid = "admin";
            let newObj = JSON.stringify(obj)
            // 将数据写入文件
            fs.writeFile('./data.json', newObj, (err) => {
                if (err) throw err;
                console.log('File saved successfully!');
            });
            return ""
        } else {
            return ""
        }
    })
}
function getOfferServer () { // 获取是否有正在分享的offer
    fs.readFile("./data.json", function (err, data) {
        if (!err) {
            let obj = JSON.parse(data)
            if (obj.offer.sdp) {
                const offerData = {
                    type: "offer",
                    sdp: obj.offer.sdp,
                };
                return JSON.stringify(offerData)
            } else {
                return ""
            }
        } else {
            return ""
        }
    })
}
function clearOfferServer () { // 获取是否有正在分享的offer并清空
    fs.readFile("./data.json", function (err, data) {
        if (!err) {
            let obj = JSON.parse(data)
            obj.offer.sdp = "";
            obj.offer.uuid = "";
            let newObj = JSON.stringify(obj)
            // 将数据写入文件
            fs.writeFile('./data.json', newObj, (err) => {
                if (err) throw err;
                console.log('File saved successfully!');
            });
        } else {
            return ""
        }
    })
}