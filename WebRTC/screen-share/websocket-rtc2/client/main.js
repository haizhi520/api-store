


// Get HTML elements
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

// Set up WebRTC
let localStream;
let remoteStream;
let pc;

pc = new RTCPeerConnection();

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
    /*拉流的效果*/
    let msg = JSON.parse(event.data)
    // Receive answer from remote peer
    // Here you should implement your own signaling mechanism
    const { type, sdp, iceCandidate } = JSON.parse(event.data)
    if (type === "answer") {
        pc.setRemoteDescription(new RTCSessionDescription({ type, sdp }))
    } else if (type === "answer_ice") {
        pc.addIceCandidate(iceCandidate)
    }
});



async function startScreenSharing () {
    try {
        // Get screen stream
        localStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

        // Show local stream
        localVideo.srcObject = localStream;

        // Set up WebRTC peer connection
        // pc = new RTCPeerConnection();

        // Add local stream to peer connection
        localStream.getTracks().forEach((track) => {
            console.log(track, "track")
            pc.addTrack(track, localStream);
        });

        // Create offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        // Send offer to remote peer
        // Here you should implement your own signaling mechanism
        const offerData = {
            type: "offer",
            sdp: offer.sdp,
        };
        sendSignalingData(offerData);

    } catch (error) {
        console.error("Error starting screen sharing:", error);
    }
}

function stopScreenSharing () {
    // Stop local stream
    localStream.getTracks().forEach((track) => {
        track.stop();
    });
    localVideo.srcObject = null;

    // Stop remote stream
    remoteStream.getTracks().forEach((track) => {
        track.stop();
    });
    remoteVideo.srcObject = null;

    // Close peer connection
    pc.close();
}

// Signaling functions

// 向信令服务器发送sdp
function sendSignalingData (data) {
    // Here you should implement your own signaling mechanism
    // to send the data to the remote peer
    console.log("Sending signaling data:", data);
    socket.send(JSON.stringify(data));
}

// 接受信令服务器内sdp
function receiveSignalingData (data) {
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {

    //         resolve(answerData);
    //     }, 2000);
    // });
    return {
        type: "answer",
        sdp: data.sdp, // "fake sdp"
    };
}

// 监听 onicecandidate 事件，生成 ICE candidate 并发送给远端设备
pc.onicecandidate = e => {
    console.log(e)
    if (e.candidate) {
        console.log("搜集并发送候选人")
        socket.send(
            JSON.stringify({
                type: `offer_ice`,
                iceCandidate: e.candidate,
            })
        )
    } else {
        console.log("候选人收集完成！")
    }
}
