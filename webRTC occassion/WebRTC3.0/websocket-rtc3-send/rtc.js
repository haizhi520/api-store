class RTCConnection {
    constructor(configuration) {
        this.configuration = configuration;
        this.peerConnection = null;
    }

    createConnection () {
        // 第一步需要创建rtc连接
        this.peerConnection = new RTCPeerConnection(this.configuration);
        // 监听候选者事件
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // send ICE candidate to remote peer
            }
        };
        //  监听连接状态
        this.peerConnection.oniceconnectionstatechange = (event) => {
            console.log(`ICE state: ${this.peerConnection.iceConnectionState}`);
        };
        // 添加track轨道
        this.peerConnection.ontrack = (event) => {
            // handle incoming media stream
        };
    }
    // 创建offer （发送端）
    async createOffer () {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        return offer;
    }
    // 创建回应（接收端）
    async createAnswer (offer) {
        await this.peerConnection.setRemoteDescription(offer);
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        return answer;
    }
    // 设置远端描述
    async setRemoteDescription (description) {
        await this.peerConnection.setRemoteDescription(description);
    }
    // 设置本地描述
    async setLocalDescription (description) {
        await this.peerConnection.setLocalDescription(description);
    }
    // 设置候选人
    async addIceCandidate (candidate) {
        await this.peerConnection.addIceCandidate(candidate);
    }
}