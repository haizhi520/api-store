
/* 这个页面是作为被推送端的代码 */

// Get HTML elements
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

// Set up WebRTC
let localStream;
let remoteStream;
let pc;

// pc = new RTCPeerConnection();

pc = new RTCConnection(); //初始化RTCPeerConnection //印用的
pc.createConnection() 
let peerConnection = pc.peerConnection;


startBtn.addEventListener("click", startScreenSharing);
stopBtn.addEventListener("click", stopScreenSharing);


// Create WebSocket connection.
const socket = new WebSocket('ws://192.168.4.33:8001');
// Connection opened
socket.addEventListener('open', function (event) {
    console.log("连接成功");
});


// Listen for messages websocket接受消息
socket.addEventListener('message', async function (event) {
    /*拉流的效果 回应*/
    const { type, sdp, iceCandidate } = JSON.parse(event.data)
    if (type === "offer") { // offer
        const answerData = new RTCSessionDescription({ type, sdp });
        answer(answerData)
    } else if (type === "offer_ice") {
        peerConnection.addIceCandidate(iceCandidate)
    }
});
// Signaling functions

// 向信令服务器发送sdp
function sendSignalingData (data) {
    console.log("Sending signaling data:", data);
    socket.send(JSON.stringify(data));
}

// 接受信令服务器内sdp
function receiveSignalingData (data) {
    return data
}

// 监听 onicecandidate 事件，生成 ICE candidate 并发送给远端设备
pc.onicecandidate = e => {
    if (e.candidate) {
        console.log("搜集并发送候选人")
        socket.send(
            JSON.stringify({
                type: `answer_ice`,
                iceCandidate: e.candidate,
            })
        )
    } else {
        console.log("候选人收集完成！")
    }
}
pc.ontrack = e => {
    if (e && e.streams) {
        console.log("收到对方音频/视频流数据...")
        // let remoteVideo = document.getElementById("remoteVideo")
        remoteVideo.srcObject = e.streams[0]
        console.log(remoteVideo, e.streams)
    }
}

const answer = async sdp => {
    const answer = await peerConnection.createAnswer(sdp)
    socket.send(JSON.stringify(answer))
}
