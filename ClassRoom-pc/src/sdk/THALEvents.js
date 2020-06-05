import Events from "events";

class THALEvents {
    _internalEvents = new Events.EventEmitter();

    emitThalEvents(eventName, ...args) {
        if (!eventName) {
            console.warn("Invalid eventName to emit internal event");
            return;
        }

        if (!this._internalEvents) {
            console.warn("Invalid event emitter.");
            return;
        }

        try {
            this._internalEvents.emit(eventName, ...args);
        } catch (e) {
            console.warn('Failed to emit internal events:' + eventName + ', exception: ' + JSON.stringify(e));
        }
    }

    /**
     * 加入房间成功回调
     * @param roomName 房间名
     * @param uid 用户ID
     * @param elapsed 从调用 [joinRoom](#joinRoom) API 回调该事件的耗时（毫秒)
     */
    onJoinRoomSuccess(roomName, uid, elapsed) {
        this.emitThalEvents('onJoinRoomSuccess', roomName, uid, elapsed);
    };

    /**
     * 离开房间回调
     */
    onLeaveRoom() {
        this.emitThalEvents('onLeaveRoom');
    }

    /**
     * 收到消息的回调
     * @param channelId 房间Id
     * @param msgText 消息的内容
     * @param msgType 消息类型
     */
    onMessageFromChannel(channelId, userId, msgText, msgType) {
        this.emitThalEvents('onMessageFromChannel', channelId, userId, msgText, msgType);
    }

    /**
     * 收到消息的回调
     * @param userId 用户ID
     * @param msgText 消息的内容
     * @param msgType 消息类型
     */
    onMessageFromUser(userId, msgText, msgType) {
        this.emitThalEvents('onMessageFromUser', userId, msgText, msgType);
    }

    /**
     * 说话音量回调
     * @param speakers 说话者（数组）。每个 speaker 包括：
     *      uid：说话者的用户 ID。
     *      volume：说话者的音量。
     *      pts：播放时间戳
     * @param totalVolume 说话者数量
     */
    onPlayVolumeIndication(speakers, totalVolume) {
        this.emitThalEvents('onPlayVolumeIndication', speakers, totalVolume);
    }

    /**
     * 试音输入音量通知
     * @param volume 音量 [0-100]
     */
    onInputVolume(volume) {
        this.emitThalEvents('onInputVolume', volume);
    }

    /**
     * 试音输出音量通知
     * @param volume 音量 [0-100]
     */
    onOutputVolume(volume) {
        this.emitThalEvents('onOutputVolume', volume);
    }

    /**
     * 业务鉴权结果回调
     * @param bPublish true：开播鉴权；false：播放鉴权
     * @param result 鉴权结果 0：成功 其他值：失败
     */
    onBizAuthResult(bPublish, result) {
        this.emitThalEvents('onBizAuthResult', bPublish, result);
    }

    /**
     * SDK 鉴权结果回调
     * @param result 鉴权结果AUTH_RESULT:
     *      AUTHRES_SUCCUSS(0)：鉴权成功
     *      AUTHRES_ERR_SERVER_INTERNAL(10000)：服务器内部错误，可以重试
     *      AUTHRES_ERR_NO_TOKEN(10001)：没有带token，需要调用[ updateToken:]
     *      AUTHRES_ERR_TOKEN_ERR(10002)：token校验失败（数字签名不对），可能使用的appSecret不对
     *      AUTHRES_ERR_APPID(10003)：token中appid跟鉴权时带的appid不一致
     *      AUTHRES_ERR_UID(10004)：token中uid跟鉴权时带的uid不一致
     *      AUTHRES_ERR_TOKEN_EXPIRE(10005)：token已过期
     *      AUTHRES_ERR_NO_APP(10006)： app不存在，没有在管理后台注册
     *      AUTHRES_ERR_TOKEN_WILL_EXPIRE(10007)：token即将过期
     *      AUTHRES_ERR_NO_BAND(10008)：用户被封禁
     */
    onSdkAuthResult(result) {
        this.emitThalEvents('onSdkAuthResult', result);
    }

    /**
     * token即将过期回调
     * @param token 过期的token
     */
    onTokenWillExpire(token) {
        this.emitThalEvents('onTokenWillExpire', token);
    }

    /**
     * token过期回调
     */
    onTokenRequest() {
        this.emitThalEvents('onTokenRequest');
    }

    /**
     * 用户封禁状态变化回调
     * @param status true：封禁；false：解禁
     */
    onUserBanned(status) {
        this.emitThalEvents('onUserBanned', status);
    }

    /**
     * 有其他用户加入当前房间回调
     * @param uid 用户 ID
     * @param elapsed 从用户调用 joinChannel 到该回调触发的延迟（毫秒)
     */
    onUserJoined(uid, elapsed) {
        this.emitThalEvents('onUserJoined', uid, elapsed);
    }

    /**
     * 用户离开当前房间回调
     * @param uid 用户 ID
     * @param reason 离线原因：
     *      USER_OFFLINE_QUIT(1)：用户主动离开
     *      USER_OFFLINE_DROPPED (1)：因过长时间收不到对方数据包，超时掉线
     *      USER_OFFLINE_BECOME_AUDIENCE (2)：用户身份从主播切换为观众（直播模式下）
     */
    onUserOffline(uid, reason) {
        this.emitThalEvents('onUserOffline', uid, reason);
    }

    /**
     * 房间用户数更新回调
     * @param data
     */
    onMemberCountUpdated(data) {
        this.emitThalEvents('onMemberCountUpdated', data);
    }

    /**
     * 房间用户数更新回调
     * @param data
     */
    onRoomMemberOffline(data) {
        this.emitThalEvents('onRoomMemberOffline', data);
    }

    /**
     * 混音启动失败回调
     */
    onAudioMixingStartFailed() {
        this.emitThalEvents('onAudioMixingStartFailed');
    }

    /**
     * 混音状态变化回调
     * @param status
     */
    onAudioMixingStatusChanged(status) {
        this.emitThalEvents('onAudioMixingStatusChanged', status);
    }

    /**
     * 成功发送本地视频首帧回调
     * @param elapsed 从调用 joinChannel 到发生此事件经过的时间（毫秒）
     */
    onFirstLocalVideoFrameSent(elapsed) {
        this.emitThalEvents('onFirstLocalVideoFrameSent', elapsed);
    }

    /**
     * 成功发送本地音频首帧回调
     * @param elapsed 从调用 joinChannel 到发生此事件经过的时间（毫秒）
     */
    onFirstLocalAudioFrameSent(elapsed) {
        this.emitThalEvents('onFirstLocalAudioFrameSent', elapsed);
    }

    /**
     * 远端用户音频流开启/停止通知
     * @param uid 远端用户Id
     * @param stop true：音频流停止；false：音频流开启。
     */
    onRemoteAudioStopped(uid, stop) {
        this.emitThalEvents('onRemoteAudioStopped', uid, stop);
    }

    /**
     * 远端用户视频流开启/停止通知
     * @param uid 远端用户Id
     * @param stop true：视频流停止；false：视频流开启。
     */
    onRemoteVideoStopped(uid, stop) {
        this.emitThalEvents('onRemoteVideoStopped', uid, stop);
    }

    /**
     * 本地或远端视频分辨率改变回调
     * @param uid 用户id
     * @param width 宽
     * @param height 高
     * @param rotation 预留，未实现
     */
    onVideoSizeChanged(uid, width, height, rotation) {
        this.emitThalEvents('onVideoSizeChanged', uid, width, height, rotation);
    }

    /**
     * 用户的网络上下行质量报告回调
     * @param uid 用户 ID
     * @param txQuality 该用户的上行网络质量
     * @param rxQuality 该用户的下行网络质量
     * @remark 网络质量：
     *       THUNDER_QUALITY_UNKNOWN(0)：质量未知
     *       THUNDER_QUALITY_EXCELLENT (1)：网络质量极好
     *       THUNDER_QUALITY_GOOD (2)：网络质量好
     *       THUNDER_QUALITY_POOR (3)：网络质量较好，用户感受有瑕疵但不影响沟通
     *       THUNDER_QUALITY_BAD (4)：网络质量一般，勉强能沟通但不顺畅
     *       THUNDER_QUALITY_VBAD (5)：网络质量非常差，基本不能沟通
     */
    onNetworkQuality(uid, txQuality, rxQuality) {
        this.emitThalEvents('onNetworkQuality', uid, txQuality, rxQuality);
    }

    /**
     * 跟服务器网络连接状态回调
     * @param status 网络连接状态
     *       THUNDER_CONNECTION_STATUS_CONNECTING(0):连接中
     *       THUNDER_CONNECTION_STATUS_CONNECTED(1):连接成功
     *       THUNDER_CONNECTION_STATUS_DISCONNECTED(2):连接断开
     */
    onConnectionStatus(status) {
        this.emitThalEvents('onConnectionStatus', status);
    }

    /**
     * 跟服务器网络连接中断回调
     */
    onConnectionLost() {
        this.emitThalEvents('onConnectionLost');
    }

    /**
     * 本地网络类型发生改变回调
     * @param type 网络连接类型
     *       THUNDER_NETWORK_TYPE_UNKNOWN(0)：网络连接类型未知
     *       THUNDER_NETWORK_TYPE_DISCONNECTED(1)：网络连接已断开
     *       THUNDER_NETWORK_TYPE_CABLE(2)：有线网络
     *       THUNDER_NETWORK_TYPE_WIFI (3)：无线Wi-Fi（包含热点）
     *       THUNDER_NETWORK_TYPE_MOBILE(4)：移动网络，没能区分2G,3G,4G网络
     *       THUNDER_NETWORK_TYPE_MOBILE_2G(5)：2G 移动网络
     *       THUNDER_NETWORK_TYPE_MOBILE_3G(6)：3G 移动网络
     *       THUNDER_NETWORK_TYPE_MOBILE_4G(7)：4G 移动网络
     */
    onNetworkTypeChanged(type) {
        this.emitThalEvents('onNetworkTypeChanged', type);
    }

    /**
     * cdn推流结果回调
     * @param url 推流的URL
     * @param errorCode 推流的错误码
     *       THUNDER_PUBLISH_CDN_ERR_SUCCESS(0):推流成功
     *       THUNDER_PUBLISH_CDN_ERR_TOCDN_FAILED(1):推流到外部服务器(CDN)失败
     *       THUNDER_PUBLISH_CDN_ERR_THUNDERSERVER_FAILED(2):推流到thunder内部服务器失败
     *       THUNDER_PUBLISH_CDN_ERR_THUNDERSERVER_STOP(3):停止推流
     */
    onPublishStreamToCDNStatus(url, errorCode) {
        this.emitThalEvents('onPublishStreamToCDNStatus', url, errorCode);
    }

    /**
     * 上下行流量统计回调
     * @param stats 具体的流量统计数据
     * @remark 周期性回调，每2秒回调一次
     */
    onRoomStats(stats) {
        this.emitThalEvents('onRoomStats', stats);
    }

    /**
     * 用户设置、更改属性的回调
     * @param roomId 用户所在的房间Id
     * @param userId 用户的Id
     * @param attribute 用户删除的属性
     */
    onUserAttributesSet(roomId, userId, attribute) {
        this.emitThalEvents('onUserAttributesSet', roomId, userId, attribute);
    }
    /**
     * 用户添加、更改属性的回调
     * @param roomId 用户所在的房间Id
     * @param userId 用户的Id
     * @param attribute 用户删除的属性
     */
    onUserAttributeAddedOrUpdate(roomId, userId, attribute) {
        this.emitThalEvents('onUserAttributeAddedOrUpdate', roomId, userId, attribute);
    }

    /**
     * 用户删除属性的回调
     * @param roomId 用户所在的房间Id
     * @param userId 用户的Id
     * @param attribute 用户删除的属性
     */
    onUserAttributesDelete(roomId, userId, attribute) {
        this.emitThalEvents('onUserAttributesDelete', roomId, userId, attribute);
    }

    /**
     * 用户删除频道属性的回调
     * @param roomId 用户所在的房间Id
     * @param userId 用户的Id
     * @param attribute 用户删除的属性
     */
    onRoomAttributeDelete(roomId, userId, attribute) {
        this.emitThalEvents('onRoomAttributeDelete', roomId, userId, attribute);
    }

    onRoomAttributeAddOrUpadte(roomId, userId, attribute) {
        this.emitThalEvents('onRoomAttributeAddOrUpadte', roomId, userId, attribute);
    }

    /**
     * 根据属性查询用户的回调
     * @param userIds 用户id的数组
     */
    onUserListByAttributes(userIds) {
        this.emitThalEvents('onUserListByAttributes', userIds);
    }

    onUserList(userIds){
        this.emitThalEvents('onUserList', userIds);
    }

    onConnectionStateChanged(data) {
        this.emitThalEvents('onConnectionStateChanged', data);
    }
}

export default THALEvents;