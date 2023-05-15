


// Get HTML elements
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

// Set up WebRTC
let localStream;
let remoteStream;
let pc;

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
        // Receive answer from remote peer
        // Here you should implement your own signaling mechanism
        const answerData = await receiveSignalingData(event);
        const answer = new RTCSessionDescription(answerData);
        await pc.setRemoteDescription(answer);

        // Show remote stream
        remoteStream = pc.getRemoteStreams()[0];
        remoteVideo.srcObject = remoteStream;
});



async function startScreenSharing () {
    try {
        // Get screen stream
        localStream = await navigator.mediaDevices.getDisplayMedia();

        // Show local stream
        localVideo.srcObject = localStream;

        // Set up WebRTC peer connection
        pc = new RTCPeerConnection();

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


        /*拉流的效果*/
        // // Receive answer from remote peer
        // // Here you should implement your own signaling mechanism
        // const answerData = await receiveSignalingData();
        // const answer = new RTCSessionDescription(answerData);
        // await pc.setRemoteDescription(answer);

        // // Show remote stream
        // remoteStream = pc.getRemoteStreams()[0];
        // remoteVideo.srcObject = remoteStream;






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
function sendSignalingData (data) {
    // Here you should implement your own signaling mechanism
    // to send the data to the remote peer
    console.log("Sending signaling data:", data);
    socket.send(JSON.stringify(data));
}

// function receiveSignalingData () {
//     // Here you should implement your own signaling mechanism
//     // to receive the data from the remote peer
//     console.log("Receiving signaling data...");
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             const answerData = {
//                 type: "answer",
//                 sdp: "fake sdp",
//             };
//             console.log("Received signaling data:", answerData);
//             resolve(answerData);
//         }, 2000);
//     });
// }

function receiveSignalingData (event) {
    let msg = JSON.parse(event.data)
    console.log(msg,"msg");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const answerData = {
                type: "answer",
                sdp: msg.sdp, // "fake sdp"
            };
            console.log("Received signaling data:", answerData);
            resolve(answerData);
        }, 2000);
    });
}


