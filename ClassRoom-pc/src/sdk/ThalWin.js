import "./THAL"
import ThunderBoltEngine from 'thunder-node-sdk';
import HSA from "./HSA";
import HSAFactory from "./HSAFactory";
import THALEvents from "./THALEvents";

class ThalWin extends ThunderBoltEngine {
    _hsa = new HSA();
    _thalEvents = new THALEvents();

    _appId = "";
    _userId = "";
    _roomId = "";
    _token = "";

    _logFileName = "";

    constructor(props) {
        super(props);
        this._thalEvents._internalEvents = this;

        if (props && props.logFileName) {
            this._logFileName = props.logFileName;
        }
    }

    /**
     * 初始化SDK
     * @param appId
     * @param sceneId
     * @returns {number}
     */
    initialize(appId, sceneId) {
        let thunderResult = super.initialize(appId, sceneId);

        let props = {appId: appId};
        if (this._logFileName) {
            props.logFileName = this._logFileName;
        }

        this._hsa = new HSAFactory().newSDK(props);
        this._hsa._event = this;

        this.bindHsaEvents();
        this._appId = appId;
        return thunderResult;
    }

    createRoom(roomId) {
        this._hsa.createRoom(roomId);
    }

    join() {
        return this._hsa.join();
    }

    /**
     * 进入房间
     * @param token
     * @param roomName
     * @param userId
     * @returns {number}
     */
    joinRoom(token, roomName, userId) {
        console.log("THAL-WIN.joinRoom: token = " + token + "roomName = " + roomName + "userId = " + userId);
        this._roomId = roomName;
        this._userId = userId;
        this._token = token;


        return new Promise(async (resolve, reject) => {
            try {
                if (this._hsa._hummerFlag !== 0) {
                    await this._hsa.initialize(this._appId, userId, token);
                }
                await this._hsa.joinChannel(roomName);
                let result = super.joinRoom(token, roomName, userId);
                resolve(result)
            } catch (err) {
                reject(err)
            }
        })
    }

    getRoomAttributes(roomId) {
        return new Promise(async (resolve, reject) => {
            this._hsa.getRoomAttributes(roomId).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

    leaveRoom() {
        let result = super.leaveRoom();
        if (this._hsa && this._roomId) {
            this._hsa.leaveChannel(this._roomId);
            this._hsa.destroy();
            this._roomId = 0;
            this._userId = 0;
            this._token = "";
        }
        return result;
    }

    leaveRoom(needDestory) {
        let result = super.leaveRoom();
        if (this._hsa && this._roomId) {
            this._hsa.leaveChannel(this._roomId);
            if (needDestory) {
                this._hsa.destroy();
                this._roomId = 0;
                this._userId = 0;
                this._token = "";
            }

        }
        return result;
    }

    updateToken(token) {
        this._hsa.refreshToken(token, this._userId, this._roomId);
        return super.updateToken(token);
    }

    sendMessageToChannel(channelId, msgText, msgType, reliable) {
        this._hsa.sendMessageToChannel(channelId, msgText, reliable, msgType);
    }

    sendMessageToUser(userId, msgText, msgType, reliable) {
        this._hsa.sendMessageToUser(userId, msgText, reliable, msgType);
    }

    /** 设置用户属性
     @param name 需要设置的属性名
     @param value 需要设置的属性值。
     @return 成功(0), 失败(<0)
     * */
    setUserAttributes(name, value) {
        this._hsa.setUserAttributes(this._roomId, name, value);
    }

    /** 添加更新用户属性
     @param name 需要设置的属性名
     @param value 需要设置的属性值。
     @return 成功(0), 失败(<0)
     * */
    addOrUpdateLocalUserAttributes(name, value) {
        return this._hsa.addOrUpdateLocalUserAttributes(this._roomId, name, value);
    }


    /** 添加更新频道属性
     @param name 需要设置的属性名
     @param value 需要设置的属性值。
     @return 成功(0), 失败(<0)
     * */
    addOrUpdateRoomAttributes(name, value) {
        this._hsa.addOrUpdateRoomAttributes(this._roomId, name, value);
    }

    deleteRoomAttributesByKeys(keys) {
        return this._hsa.deleteRoomAttributesByKeys(this._roomId, keys);
    }

    deleteUserAttributesByKeys(keys) {
        return this._hsa.deleteUserAttributesByKeys(this._roomId, keys);
    }

    /** 设置频道属性
     @param name 需要设置的属性名
     @param value 需要设置的属性值。
     @return 成功(0), 失败(<0)
     * */
    setRoomAttributes(name, value) {
        this._hsa.setRoomAttributes(this._roomId, name, value);
    }

    /** 根据属性获取用户列表
     @param name 属性名
     @param value 属性值。
     @return 成功(0), 失败(<0)
     * */
    getUserListByAttribute(name, value) {
        this._hsa.getChannelUserListByAttribute(this._roomId, name, value);
    }

    bindHsaEvents() {
        this._hsa.on(this._hsa.EventNames.onUserJoined, this.onUserJoined, this);
        this._hsa.on(this._hsa.EventNames.onUserLeaved, this.onUserLeaved, this);
        this._hsa.on(this._hsa.EventNames.onMemberCountUpdated, this.onMemberCountUpdated, this);
        this._hsa.on(this._hsa.EventNames.onRoomMemberOffline, this.onRoomMemberOffline, this);
        this._hsa.on(this._hsa.EventNames.onUserAttributeAddedOrUpdate, this.onUserAttributeAddedOrUpdate, this);
        this._hsa.on(this._hsa.EventNames.onUserAttributeDeleted, this.onUserAttributeDeleted, this);
        this._hsa.on(this._hsa.EventNames.onRoomAttributeAddOrUpadte, this.onRoomAttributeAddOrUpadte, this);
        this._hsa.on(this._hsa.EventNames.onRoomAttributeDelete, this.onRoomAttributeDelete, this);
        this._hsa.on(this._hsa.EventNames.onGetUsersByAttributeResult, this.onGetUserByAttribute, this);
        this._hsa.on(this._hsa.EventNames.onMessageFromChannel, this.onReceiveChannelMessage, this);
        this._hsa.on(this._hsa.EventNames.onMessageFromUser, this.onReceiveUserMessage, this);
        this._hsa.on(this._hsa.EventNames.onGetChannelUserListResult, this.onUserListResult, this);
        this._hsa.on(this._hsa.EventNames.onLoginResult, this.onHsaLoginResult, this);
        this._hsa.on(this._hsa.EventNames.onConnectionStateChanged, this.onConnectionStateChanged, this);

        /**
         * 混音启动失败回调
         */
        // onAudioMixingStartFailed()
        // {
        //     this.emit('onAudioMixingStartFailed');
        // }

        /**
         * 混音状态变化回调
         * @param status
         */
        // onAudioMixingStatusChanged(status)
        // {
        //     this.emit('onAudioMixingStatusChanged', status);
        // }
    }

    onHsaLoginResult(arg) {
        if (arg.state == "CONNECTED" && this._roomId) {
            this._hsa.joinChannel(this._roomId);
        }
    }

    onConnectionStateChanged(arg) {
        this._thalEvents.onConnectionStateChanged(arg);
    }

    //App.onUserJoined {uids: Array(1), channelId: "21333"}
    onUserJoined(args) {
        for (let uid of args.uids) {
            this._thalEvents.onUserJoined(uid, 0);
        }
    }

    onUserLeaved(arg) {
        let isRoomChanged = false;
        for (let uid of arg.uids) {
            this._thalEvents.onUserOffline(uid, 1);
        }
    }

    onMemberCountUpdated(arg) {
        this._thalEvents.onMemberCountUpdated(arg);
    }

    onRoomMemberOffline(arg) {
        this._thalEvents.onRoomMemberOffline(arg);
    }

    /*
    *  {uid: "123456", channelId: "123", attributes: {…}}
    * attributes: {isMe: "true"}
    */
    onUserAttributeAddedOrUpdate(arg) {
        this._thalEvents.onUserAttributeAddedOrUpdate(arg.channelId, arg.uid, arg.attributes);
    }

    /*
     *  {uid: "123456", channelId: "123", attributes: {…}}
     * attributes: {isMe: "true"}
    */
    onRoomAttributeAddOrUpadte(arg) {
        this._thalEvents.onRoomAttributeAddOrUpadte(arg.roomId, arg.uid, arg.attributes);
    }

    /*
    * HSA.onNotifyUserAttributesDelete {uid: "123456", channelId: "123", attributes: {…}}
    * attributes: {isMe: "true"}
    * */
    onUserAttributeDeleted(arg) {
        this._thalEvents.onUserAttributesDelete(arg.channelId, arg.uid, arg.attributes);
    }

    /*
    * HSA.onNotifyUserAttributesDelete {uid: "123456", channelId: "123", attributes: {…}}
    * attributes: {isMe: "true"}
    * */
    onRoomAttributeDelete(arg) {
        this._thalEvents.onRoomAttributeDelete(arg.channelId, arg.uid, arg.attributes);
    }

    /*
    * getChannelUserListByAttribute res: t.default {appid: 1504984159, channelId: "123", users: Array(1), rescode: 0, msg: ""}
    * users: ["123456"]
    * */
    onGetUserByAttribute(arg) {
        this._thalEvents.onUserListByAttributes(arg.users);
    }

    getUserList() {
        return this._hsa.getChannelUserList(this._roomId).then(result => {
            return this._hsa.queryUsersOnlineStatus(result.uids);
        }).then(result => {
            // onlineUids
            this.onUserListResult(result);
        });
    }

    /*
    * HSA-JS.getChannelUserList res: t.default {appid: 1504984159, channelId: "123", users: Array(3), rescode: 0, msg: ""}
    * users: (3) ["123456", "3300235423", "13450268799"]
    * */
    onUserListResult(arg) {
        this._thalEvents.onUserList(arg.onlineUids);
    }

    getUserAttributes(uid) {
        return this._hsa.getUserAttributes(uid)
    }

    /*
    * HSA.onReceiveChannelMessage {message: {…}, fromUid: "123456"}
    * message:{type: "default", data: Uint8Array(16), appExtras: {channelId: "123"}, serverAcceptedTs: "1577693952684", channelId: "123"}
    */
    onReceiveChannelMessage(msg) {

        this._thalEvents.onMessageFromChannel(msg.message.channelId, msg.fromUid, msg.message.data, msg.message.type);
    }

    /*
    * HSA.onReceiveMessage {message: {…}, fromUid: "123456"}
    * message: {type: "default", data: Uint8Array(13), appExtras: {}, serverAcceptedTs: "1577694145864"}
    */
    onReceiveUserMessage(msg) {
        let msgText = msg.message.data;
        this._thalEvents.onMessageFromUser(msg.fromUid, msgText, msg.message.type);
    }

    initializeHummer(userId, token) {
        if (this._hsa._hummerFlag !== 0) {
            this._hsa.initialize(this._appId, userId, token);
        }
    }

    login(userId, token) {
        return this._hsa.login(userId, token);
    }
}

export default ThalWin;