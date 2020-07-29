import React from 'react';
import Hummer from 'hummer-rts-sdk';
import HSA from "./HSA";
import {AppId} from "../ProductConfig"

class HSAJS extends HSA {

    _cachedAttributes = null;

    constructor(prop) {
        super(prop);

        this._baseVersion = super.version();
        this._version = "3.1.6";

        this._hummer = null;
        this._client = null;
        this._channel = null;

        this._hummerFlag = -1;
        this._hummerLoginFlag = -1;
        this._hummer = Hummer.createHummer({appid: AppId});

    }

    baseVersion() {
        return this._baseVersion;
    }

    initialize(appId, userId, token) {
        super.initialize(appId, userId, token);

        console.log("HSA-JS.initialize: appId = " + appId + "userId = " + userId + "token = " + token);
        this._log.debug("HSA-JS.initialize: appId=$0, userId=$1, token=$2", appId, userId, token);

        if (!appId) {
            this.invokeInitializeResult({rescode: -1, msg: "App id is null."});
            return;
        }
        if (!userId) {
            this.invokeInitializeResult({rescode: -1, msg: "User id is null."});
            return;
        }

        // token 鉴权需要打开
        // if (!token) {
        //     this.invokeInitializeResult({rescode: -1, msg: "Token is null."});
        //     return;
        // }

        console.log("HSA-JS.initialize: creating Hummer for area: 'CN'.");
        this._log.info("HSA-JS.initialize: creating Hummer for area: 'CN'.");

        this._hummer.on('ConnectionStateChanged', async (data) => {
            console.log("===  ConnectionStateChanged  ===", JSON.stringify(data));
            this._log.info("===  ConnectionStateChanged  ===: data=$0", JSON.stringify(data));
            if (data.state == "CONNECTED") {
                let result = await this._hummer.getInstanceInfo();
                console.log("HSA-JS.getInstanceInfo: getting Hummer getInstanceInfo: info=" + JSON.stringify(result));
                this._log.info("HSA-JS.getInstanceInfo: getting Hummer getInstanceInfo: info=$0", JSON.stringify(result));
            }
            super.ConnectionStateChanged(data);
        });
        this._hummer.on('TokenExpired', (data) => {
            console.log("=== TokenExpired ===");
        });

        this._hummer.setLogLevel(-1);
        this._client = this._hummer.createRTSInstance();

        this._client.on('MessageFromUser', (data) => {
            data.message.data = Hummer.Utify.decodeUtf8BytesToString(data.message.data);
            console.log("接收消息MessageFromUser: " + JSON.stringify(data));
            this.onReceiveUserMessage(data)
        });
        this._hummerFlag = 0;
        // if (this._hummerFlag !== 0) {
        //     delete this._channel;
        //     this._channel = null;
        // }
        //
        // if (this._hummerFlag === 0) {
        //     this.invokeInitializeResult({rescode: 0, msg: "DONE"});
        // }

    }


    onNewHummerError(error) {
        console.log("Error while creating Hummer:", JSON.stringify(error));
        this._log.error("Error while creating Hummer: error=$0", error);

        this._hummerFlag = error.code;

        console.log("HSA-JS.onNewHummerError", JSON.stringify(error));
        this._log.error("HSA-JS.onNewHummerError: error=$0", error);

        if (this._hummerFlag !== 0) {
            this.invokeInitializeResult({rescode: -1, msg: error.message});
        }
    }

    onNewChannelServiceError(error) {
        console.log("Error while creating ChannelService:", JSON.stringify(error));
        this._log.error("Error while creating ChannelService: error=$0", error);

        this._hummerFlag = error.code;

        console.log("HSA-JS.onNewChannelServiceError", JSON.stringify(error));
        this._log.error("HSA-JS.onNewChannelServiceError: error=$0", error);

        if (this._hummerFlag !== 0) {
            this.invokeInitializeResult({rescode: -1, msg: error.message});
        }
    }

    destroy() {
        super.destroy();
        if (this._channel) {
            console.log("HSA-JS.destroying _channel...");
            this._log.info("HSA-JS.destroying _channel...");
            delete this._channel;
            this._channel = null;
            console.log("HSA-JS.destroyed _channel...");
            this._log.info("HSA-JS.destroyed _channel...");
        }

        if (this._hummer) {
            console.log("HSA-JS.destroying _hummer...");
            this._log.info("HSA-JS.destroyed _hummer...");
            delete this._hummer;
            this._hummer = null;
            console.log("HSA-JS.destroyed _hummer...");
            this._log.info("HSA-JS.destroyed _hummer...");
        }
        this._hummerFlag = -1;
        this._hummerLoginFlag = -1;
    }

    login(userId, token) {
        console.log("HSA-JS.login: no action will be executed, login will be executed when initialize is called, the login userId is:", JSON.stringify(userId));
        this._log.info("HSA-JS.login: no action will be executed, login will be executed when initialize is called, the login userId is: $0", userId);
        return new Promise((resolve, reject) => {
            if (this._hummer) {
                try {
                    this._hummer.login({region: 'cn', uid: userId, token: token}).then(result => {
                        console.log("HSA-JS.login Res: " + JSON.stringify(result));
                        resolve(result);
                    }).catch(err => {
                        console.error("HSA-JS.login err:", JSON.stringify(err));
                        reject(err);
                    })
                } catch (e) {
                    throw e;
                }
            }
        });
    }

    logout() {
        return new Promise((resolve, reject) => {
            this._hummer.logout().then(result => {
                console.error("HSA-JS.logout Res:", JSON.stringify(result));
                resolve(result);
            }).catch(err => {
                console.error("HSA-JS.logout err:", JSON.stringify(err));
                reject(err)
            });
        })
    }

    invokeLoginStatus(arg) {
        console.log("HSA-JS.onLoginStatus", JSON.stringify(arg));
        this._log.info("HSA-JS.onLoginStatus: arg=$0", arg);

        this._hummerLoginFlag = arg.code;

        if (this._hummerLoginFlag == 0) {
            this.invokeLoginResult(arg);
        } else {
            super.invokeLoginStatus(arg);
        }
    }

    refreshToken(uid, token) {
        console.log("HSA-JS.refreshToken", JSON.stringify(token));
        this._log.debug("HSA-JS.refreshToken: uid=$0, token=$1", uid, token);

        this._hummer.refreshToken({uid: uid, token: token}).then(res => {
            console.log("HSA-JS.refreshToken result", JSON.stringify(res));
            this._log.debug("HSA-JS.refreshToken result:res=$0", res);
        }).catch(err => {
            console.log("HSA-JS.refreshToken failed", JSON.stringify(err));
            this._log.error("HSA-JS.refreshToken failed:$0", err);
            this.invokeOnError(new Error("HSA-JS.refreshToken failed: " + err.message));
        });
    }

    createRoom(roomId) {
        if (this._client == null) {
            this._client = this._hummer.createRTSInstance();
        }

        if (this._client) {
            this._channel = this._client.createRoom({region: "cn", roomId: roomId});

            this._channel.on("NotifyJoinRoom", (data) => {
                this._log.debug("HSA-JS.NotifyJoinRoom: data=$0", JSON.stringify(data));
                this.onNotifyJoinChannel(data);
            });

            this._channel.on("NotifyLeaveRoom", (data) => {
                this._log.debug("HSA-JS.NotifyLeaveRoom: data=$0", JSON.stringify(data));
                this.onNotifyLeaveChannel(data);
            });

            this.onReceiveRoomMessage(this._channel);
            this.subscribeRoomEvents(this._channel);
            this.onNotifyRoomAttributesChange(this._channel);
            this.onNotifyUserAttributesChange(this._channel);
        }
    }

    //HSA-JS.joinChannel res: {rescode: 0, msg: "OK"}
    joinChannel(channelId) {
        console.log("HSA-JS.joinChannel:", channelId);
        this._log.debug("HSA-JS.joinChannel: channelId=$0", channelId);

        if (!channelId) {
            this.invokeJoinRoomResult({rescode: -1, msg: "Room id is null."});
            return;
        }

        this._roomId = channelId
        return new Promise((resolve, reject) => {
            if (this._client == null) {
                this._client = this._hummer.createRTSInstance();
            }

            if (this._channel) {
                // this._channel = this._client.createRoom({region: "cn", roomId: channelId});
                try {
                    this._channel.join().then(result => {
                        console.log("自己进入频道join res:", result);
                        resolve(result);
                    });
                } catch (err) {
                    reject(err);
                    console.log("join res:", err);
                }
            }
        })

        // this._channel.join().then(res => {
        //     console.log("HSA-JS.joinChannel res:", JSON.stringify(res));
        //     this._log.debug("HSA-JS.joinChannel res:$0", res);
        //
        //     if (this._cachedAttributes) {
        //         this._channel.setUserAttributes(this._cachedAttributes);
        //     }
        //
        //     this.invokeJoinRoomResult(res);
        // }).catch(err => {
        //     console.log("HSA-JS.joinChannel failed: " + JSON.stringify(err));
        //     this._log.error("HSA-JS.joinChannel failed:$0", err);
        //     this.invokeJoinRoomResult({rescode: -1, msg: "exception: " + err.message});
        // });

    }

    join() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this._channel.join();
                this._log.debug("HSA-JS.join result:$0", JSON.stringify(result));
                console.log("HSA-JS.join result: " + JSON.stringify(result));
            } catch (error) {
                this._log.error("HSA-JS.join failed:$0", error);
                console.log("HSA-JS.join failed: " + JSON.stringify(error));
                reject(error);
            }
        });
    }

    onNotifyJoinChannel(msg) {
        console.log("HSA-JS.onNotifyJoinChannel", JSON.stringify(msg));
        this._log.debug("HSA-JS.onNotifyJoinChannel: msg=$0", msg);
        super.invokeOnNotifyJoinChannel(msg);
    }

    //HSA-JS.joinChannel res: {rescode: 0, msg: "OK"}
    leaveChannel(channelId) {
        console.log("HSA-JS.leaveChannel");
        this._log.debug("HSA-JS.leaveChannel: channelId=$0", channelId);

        if (!channelId) {
            this.invokeLeaveRoomResult({rescode: -1, msg: "Room id is null."});
            return;
        }

        let params = {channelId: channelId, extra: {}};
        this._channel.leave().then(res => {
            console.log("HSA.leaveChannel res:", JSON.stringify(res));
            this._log.debug("HSA.leaveChannel res:$0", res);
            this.invokeLeaveRoomResult(res);
        }).catch(err => {
            console.log("HSA-JS.leaveChannel failed: " + JSON.stringify(err));
            this._log.error("HSA-JS.leaveChannel failed:$0", err);
            this.invokeLeaveRoomResult({rescode: -1, msg: "exception: " + err.message});
        });
    }

    onNotifyLeaveChannel(msg) {
        console.log("HSA-JS.onNotifyLeaveChannel", JSON.stringify(msg));
        this._log.debug("HSA-JS.onNotifyLeaveChannel: msg=$0", msg);
        super.invokeOnNotifyLeaveChannel(msg);
    }

    onNotifyCountUpdated(msg) {
        console.log("HSA-JS.MemberCountUpdated", JSON.stringify(msg));
        this._log.debug("HSA-JS.MemberCountUpdated: msg=$0", msg);
        super.invokeOnMemberCountUpdated(msg);
    }

    onNotifyMemberOffline(msg) {
        console.log("HSA-JS.onNotifyMemberOffline", JSON.stringify(msg));
        this._log.debug("HSA-JS.onNotifyMemberOffline: msg=$0", msg);
        super.invokeOnRoomMemberOffline(msg);
    }

    /*
    * HSA-JS.getChannelUserList res: t.default {appid: 1504984159, channelId: "123", users: Array(3), rescode: 0, msg: ""}
    * users: (3) ["123456", "3300235423", "13450268799"]
    * */
    getChannelUserList(channelId) {
        console.log("HSA-JS.getChannelUserList");
        this._log.debug("HSA-JS.getChannelUserList: channelId=$0", channelId);

        if (!channelId) {
            this.invokeGetChannelUserListResult({rescode: -1, msg: "Room id is null"});
            return;
        }
        return new Promise((resolve, reject) => {
            this._channel.getMembers().then(res => {
                console.log("HSA-JS.getChannelUserList res:", JSON.stringify(res));
                this._log.debug("HSA-JS.getChannelUserList res:$0", res);
                // this.invokeGetChannelUserListResult(res);
                resolve(res);
            }).catch(err => {
                console.log("HSA-JS.getChannelUserList failed: " + JSON.stringify(err));
                this._log.error("HSA-JS.getChannelUserList failed: $0", err);
                this.invokeGetChannelUserListResult({rescode: -1, msg: err});
                reject(err);
            });
        })
    }

    getUserAttributes(uid) {
        console.log("HSA-JS.getUserAttributes");
        this._log.debug("HSA-JS.getUserAttributes: uid=$0", uid);

        return new Promise((resolve, reject) => {
            this._channel.getUserAttributes({uid: uid}).then(res => {
                console.log("HSA-JS.getUserAttributes res:", JSON.stringify(res));
                this._log.debug("HSA-JS.getUserAttributes res:$0", res);
                resolve(res);
            }).catch(err => {
                console.log("HSA-JS.getUserAttributes failed: " + JSON.stringify(err));
                this._log.error("HSA-JS.getUserAttributes failed: $0", err);
                reject(err);
            });
        });
    }

    queryUsersOnlineStatus(uids) {
        console.log("HSA-JS.queryUsersOnlineStatus");
        this._log.debug("HSA-JS.queryUsersOnlineStatus: uids=$0", JSON.stringify(uids));

        return new Promise((resolve, reject) => {
            this._client.queryUsersOnlineStatus({uids: uids}).then(res => {
                console.log("HSA-JS.queryUsersOnlineStatus res:", JSON.stringify(res));
                this._log.debug("HSA-JS.queryUsersOnlineStatus res:$0", res);
                let newResult = {onlineUids:[]}

                uids.forEach(uid => {
                    // if (res.onlineStatus[uid]) {
                        newResult.onlineUids.push(uid);
                    // }
                })
                // this.invokeGetChannelUserListResult(res);
                resolve(newResult);
            }).catch(err => {
                console.log("HSA-JS.queryUsersOnlineStatus failed: " + JSON.stringify(err));
                this._log.error("HSA-JS.queryUsersOnlineStatus failed: $0", err);
                this.invokeGetChannelUserListResult({rescode: -1, msg: err.message});
                reject(err);
            });
        });
    }

    //HSA-JS.queryOnlineStatusForUser res: {"rescode":0,"uid":"123456","isOnline":true}
    queryOnlineStatusForUser(userId) {
        console.log("HSA-JS.queryOnlineStatusForUser");
        this._log.debug("HSA-JS.queryOnlineStatusForUser: userId=$0", userId);

        if (!userId) {
            this.invokeQueryOnLineStatusForUserResult({rescode: -1, msg: "User id is null."});
            return;
        }

        this._channel.queryOnlineStatusForUser({uid: userId}).then(res => {
            console.log("HSA-JS.queryOnlineStatusForUser res: " + JSON.stringify(res));
            this._log.debug("HSA-JS.queryOnlineStatusForUser res:$0", res);
            res.msg = "";
            this.invokeQueryOnLineStatusForUserResult(res);
        }).catch(err => {
            console.log("HSA-JS.queryOnlineStatusForUser failed: " + JSON.stringify(err));
            this._log.error("HSA-JS.queryOnlineStatusForUser failed:$0 ", err)
            this.invokeQueryOnLineStatusForUserResult({rescode: -1, msg: err.message});
        })
    }

    //HSA-JS.sendMessageToChannel result: {"appid":1504984159,"uid":"123456","channelId":"123","rescode":0,"msg":"success"}
    sendMessageToChannel(channelId, msgText, reliable, msgType) {
        console.log("HSA-JS.sendMessageToChannel:", msgText);
        this._log.debug("HSA-JS.sendMessageToChannel: msgText=$0", msgText);

        if (!channelId) {
            this.invokeSendMessageToChannelResult({rescode: -1, msg: "Room id is null"});
            return;
        }

        if (!msgText) {
            this.invokeSendMessageToChannelResult({rescode: -1, msg: "Message content is null"});
            return;
        }

        let buffer = Hummer.Utify.encodeStringToUtf8Bytes(msgText);
        let mt = msgType ? "100" : "100";

        let channelMessage = {type: mt, content: buffer};
        this._channel.sendMessage(channelMessage).then(res => {
            console.log("HSA-JS.sendMessageToChannel result: " + JSON.stringify(res));
            this._log.debug("HSA-JS.sendMessageToChannel result: $0", res);
            this.invokeSendMessageToChannelResult(res);
        }).catch(err => {
            console.log("HSA-JS.sendMessageToChannel failed: " + JSON.stringify(err));
            this._log.error("HSA-JS.sendMessageToChannel failed: $0", err);
            this.invokeSendMessageToChannelResult({rescode: -1, msg: err});
        });
    }

    /*
    * HSA.onReceiveChannelMessage {message: {…}, fromUid: "123456"}
    * message:{type: "default", data: Uint8Array(16), appExtras: {channelId: "123"}, serverAcceptedTs: "1577693952684", channelId: "123"}
    */
    onReceiveChannelMessage(msg) {
        let msgText = Hummer.Utify.decodeUtf8BytesToString(msg.message.data);
        console.log("HSA-JS.onReceiveChannelMessage", msgText);
        this._log.debug("HSA-JS.onReceiveChannelMessage: msgText=$0", msgText);
        msg.message.channelId = this.
        super.invokeOnReceiveChannelMessage(msg);
    }

    //HSA-JS.sendMessageToUser result: {"rescode":0,"msg":"ok","timestamp":"1577694145864"}
    sendMessageToUser(userId, msgText, reliable, msgType) {
        console.log("HSA-JS.sendMessageToUser: ", userId);
        this._log.debug("HSA-JS.sendMessageToUser: userId=$0", userId);

        if (!userId) {
            this.invokeSendMessageToUserResult({rescode: -1, msg: "User id is null"});
            return;
        }

        if (!msgText) {
            this.invokeSendMessageToUserResult({rescode: -1, msg: "Message content is null"});
            return;
        }

        let r = reliable === true ? "yes" : "no";
        let buffer = Hummer.Utify.encodeStringToUtf8Bytes(msgText);
        let mt = msgType ? "100" : "100";

        let userMessage = { receiver: userId, type: mt, content: buffer};
        this._client.sendMessageToUser(userMessage).then(res => {
            console.log("HSA-JS.sendMessageToUser result: " + JSON.stringify(res));
            this._log.debug("HSA-JS.sendMessageToUser result:res = $0", res);
            this.invokeSendMessageToUserResult(res);
        }).catch(err => {
            console.log("HSA-JSsendMessageToUser. failed: " + JSON.stringify(err));
            this._log.error("HSA-JSsendMessageToUser. failed:$0", err);
            this.invokeSendMessageToUserResult({rescode: -1, msg: err.message});
        });
    }

    /*
    * HSA.onReceiveMessage {message: {…}, fromUid: "123456"}
    * message: {type: "default", data: Uint8Array(13), appExtras: {}, serverAcceptedTs: "1577694145864"}
    */
    onReceiveUserMessage(msg) {
        let msgText = Hummer.Utify.decodeUtf8BytesToString(msg.message.data);
        console.log("HSA-JS.onReceiveMessage", msgText);
        this._log.info("HSA-JS.onReceiveMessage, msg=$0", msgText);

        super.invokeOnReceiveUserMessage(msg);
    }

    //HSA-JS.setUserAttributes Res:  t.default {appid: 1504984159, uid: "123456", channelId: "123", rescode: 0, msg: "success"}
    setUserAttributes(channelId, key, prop) {
        console.log("HSA-JS.setUserAttributes: key=" + key + ", value=" + prop);
        this._log.debug("HSA-JS.setUserAttributes: channelId=$0, key=$1, value=$2", channelId, key, prop);

        if (!channelId) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "RoomId is null."});
            return;
        }
        if (!key) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "Attribute is null."});
            return;
        }

        let attr = {};
        attr[key] = prop;

        this._cachedAttributes = {attributes: attr, options: {enableNotification: true}};

        this._channel.setUserAttributes(this._cachedAttributes).then((res) => {
            console.log("HSA-JS.setUserAttributes Res: ", JSON.stringify(res));
            this._log.debug("HSA-JS.setUserAttributes Res:$0", res);
            this.invokeSetUserAttributesResult(res);
        }).catch((err) => {
            console.log("HSA-JS.setUserAttributes failed: " + JSON.stringify(err));
            this._log.error("HSA-JS.setUserAttributes Res:$0 ", JSON.stringify(err));
            this.invokeSetUserAttributesResult({rescode: -1, msg: err.message});
        });
    }

    deleteRoomAttributesByKeys(roomId, keys) {
        console.log("HSA-JS.deleteRoomAttributesByKeys: keys = " + JSON.stringify(keys));
        this._log.debug("HSA-JS.deleteRoomAttributesByKeys: roomId = $0, keys = $1", roomId, JSON.stringify(keys));
        if (!roomId) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "RoomId is null."});
            return;
        }
        if (!keys) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "Attribute is null."});
            return;
        }

        this._cachedAttributes = {region: "cn", roomId: roomId, keys: keys, options: {enableNotification: true}};

        return new Promise(async (resolve, reject) => {
            this._channel.on("RoomAttributesDeleted", (data) => {
                console.log("HSA-JS.RoomAttributesDeleted: data = " + JSON.stringify(data));
                this._log.debug("HSA-JS.RoomAttributesDeleted: roomId = $0, data = $1", roomId, JSON.stringify(data));
                resolve(data);
            });
            try {
                let result = await this._channel.deleteRoomAttributesByKeys(this._cachedAttributes);
                console.log("HSA-JS.RoomAttributesDeleted: result = " + JSON.stringify(result));
                this._log.debug("HSA-JS.RoomAttributesDeleted: roomId = $0, result = $1", roomId, JSON.stringify(result));
            } catch (err) {
                console.error(err);
                reject(err);
            }
        });

        // this._channel.deleteRoomAttributesByKeys(this._cachedAttributes).then((res) => {
        //     console.log("HSA-JS.deleteRoomAttributesByKeys Res: ", JSON.stringify(res));
        //     this._log.debug("HSA-JS.deleteRoomAttributesByKeys Res:$0", res);
        //     this.invokeSetUserAttributesResult(res);
        // }).catch((err) => {
        //     console.log("HSA-JS.deleteRoomAttributesByKeys failed: " + JSON.stringify(err));
        //     this._log.error("HSA-JS.deleteRoomAttributesByKeys Res:$0 ", JSON.stringify(err));
        //     this.invokeSetUserAttributesResult({rescode: -1, msg: err});
        // });
    }

    addOrUpdateRoomAttributes(channelId, key, prop) {
        console.log("HSA-JS.addOrUpdateRoomAttributes: key=" + key + ", value=" + prop);
        this._log.debug("HSA-JS.addOrUpdateRoomAttributes: channelId=$0, key=$1, value=$2", channelId, key, prop);

        if (!channelId) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "RoomId is null."});
            return;
        }
        if (!key) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "Attribute is null."});
            return;
        }

        let attr = {};
        attr[key] = prop;

        this._cachedAttributes = {attributes: attr, options: {enableNotification: true}};

        this._channel.addOrUpdateRoomAttributes(this._cachedAttributes).then((res) => {
            console.log("HSA-JS.addOrUpdateRoomAttributes Res: ", JSON.stringify(res));
            this._log.debug("HSA-JS.addOrUpdateRoomAttributes Res:$0", res);
            this.invokeSetUserAttributesResult(res);
        }).catch((err) => {
            console.log("HSA-JS.addOrUpdateRoomAttributes failed: " + JSON.stringify(err));
            this._log.error("HSA-JS.addOrUpdateRoomAttributes Res:$0 ", JSON.stringify(err));
            this.invokeSetUserAttributesResult({rescode: -1, msg: err.message});
        });
    }

    addOrUpdateLocalUserAttributes(channelId, key, prop) {
        console.log("HSA-JS.addOrUpdateLocalUserAttributes: key=" + key + ", value=" + prop);
        this._log.debug("HSA-JS.addOrUpdateLocalUserAttributes: channelId=$0, key=$1, value=$2", channelId, key, prop);

        if (!channelId) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "RoomId is null."});
            return;
        }
        if (!key) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "Attribute is null."});
            return;
        }

        let attr = {};
        attr[key] = prop;

        this._cachedAttributes = {attributes: attr, options: {enableNotification: true}};

        return new Promise((resolve, reject) => {
            this._channel.on("MemberAttributesAddedOrUpdated", (data) => {
                resolve(data);
            });
            this._channel.addOrUpdateUserAttributes(this._cachedAttributes);
        });
    }

    setRoomAttributes(channelId, key, prop) {
        console.log("HSA-JS.setRoomAttributes: key=" + key + ", value=" + prop);
        this._log.debug("HSA-JS.setRoomAttributes: channelId=$0, key=$1, value=$2", channelId, key, prop);

        if (!channelId) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "RoomId is null."});
            return;
        }
        if (!key) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "Attribute is null."});
            return;
        }

        let attr = {};
        attr[key] = prop;

        this._cachedAttributes = {region: "cn", roomId: channelId, attributes: attr, options: {enableNotification: true}};

        this._client.setRoomAttributes(this._cachedAttributes).then((res) => {
            console.log("HSA-JS.setRoomAttributes Res: ", JSON.stringify(res));
            this._log.debug("HSA-JS.setRoomAttributes Res:$0", res);
            this.invokeSetUserAttributesResult(res);
        }).catch((err) => {
            console.log("HSA-JS.setRoomAttributes failed: " + JSON.stringify(err));
            this._log.error("HSA-JS.setRoomAttributes Res:$0 ", JSON.stringify(err));
            this.invokeSetUserAttributesResult({rescode: -1, msg: err.message});
        });
    }

    getRoomAttributes(roomId) {
        console.log("HSA-JS.getRoomAttributes: roomId=" + roomId);
        this._log.debug("HSA-JS.getRoomAttributes: channelId=$0", roomId);

        if (!roomId) {
            this.invokeSetUserAttributesResult({rescode: -1, msg: "RoomId is null."});
            return;
        }

        this._cachedAttributes = {region: "cn", roomId: roomId};

        return new Promise((resolve, reject) => {
            this._channel.getRoomAttributes(this._cachedAttributes).then((res) => {
                console.log("HSA-JS.getRoomAttributes Res: ", JSON.stringify(res));
                this._log.debug("HSA-JS.getRoomAttributes Res:$0", res);
                resolve(res);
            }).catch((err) => {
                console.log("HSA-JS.getRoomAttributes failed: " + JSON.stringify(err));
                this._log.error("HSA-JS.getRoomAttributes Res:$0 ", JSON.stringify(err));
                reject(err);
            });
        });
    }

    /*
    * HSA.onNotifyUserAttributesSet {uid: "123456", channelId: "123", attributes: {…}}
    * attributes: {isMe: "true"}
    */
    onNotifyUserAttributesSet(attr) {
        super.invokeOnNotifyUserAttributesSet(attr);
    }

    /*
    * Failed:
    * HSA-JS.deleteUserAttributesByKeys Res:  t.default {appid: 1504984159, uid: "123456", channelId: "123", rescode: 2004, msg: "can't delete not exist key:isMe"}
    * success:
    * HSA-JS.deleteUserAttributesByKeys Res:  t.default {appid: 1504984159, uid: "123456", channelId: "123", rescode: 0, msg: "success"}
    * */

    /*
    * @para keys : string
    */
    deleteUserAttributesByKeys(channelId, keys, separator) {
        console.log("HSA-JS.deleteUserAttributes", JSON.stringify(keys));
        this._log.info("HSA-JS.deleteUserAttributes: channelId=$0, keys=$1", channelId, keys);

        if (!channelId) {
            this.invokeDeleteUserAttributeResult({rescode: -1, msg: "RoomId is null."});
            return;
        }
        if (!keys) {
            this.invokeDeleteUserAttributeResult({rescode: -1, msg: "Attribute is null."});
            return;
        }

        let params = {keys: keys, options: {enableNotification: true}};

        return new Promise((resolve, reject) => {
            this._channel.on("MemberAttributesDeleted", (data) => {
                resolve(data);
            });
            this._channel.deleteUserAttributesByKeys(params);
        })

        //     .then((res) => {
        //     //HSA-JS.deleteUserAttributesByKeys Res:  t.default {appid: 1504984159, uid: "123456", channelId: "123", rescode: 0, msg: "success"}
        //     console.log("HSA-JS.deleteUserAttributesByKeys Res: ", JSON.stringify(res));
        //     this._log.info("HSA-JS.deleteUserAttributesByKeys Res: $0", res);
        //     this.invokeDeleteUserAttributeResult(res);
        // }).catch((err) => {
        //     console.log("HSA-JS.deleteUserAttributesByKeys failed: " + JSON.stringify(err));
        //     this._log.error("HSA-JS.deleteUserAttributesByKeys failed: $0 ", err);
        //     this.invokeDeleteUserAttributeResult({rescode: -1, msg: err.message});
        // })
    }

    /*
    * HSA-JS.getChannelUserListByAttribute res: t.default {appid: 1504984159, channelId: "123", users: Array(1), rescode: 0, msg: ""}
    * users: ["123456"]
    * */
    getChannelUserListByAttribute(channelId, key, value) {
        console.log("HSA-JS.getChannelUserListByAttribute");
        this._log.debug("HSA-JS.getChannelUserListByAttribute: channelId=$0, key=$1, value=$2", channelId, key, value);

        if (!channelId) {
            this.invokeGetUsersByAttributeResult({rescode: -1, msg: "RoomId is null."});
            return;
        }
        if (!key) {
            this.invokeGetUsersByAttributeResult({rescode: -1, msg: "Attribute is null."});
            return;
        }
        if (!value) {
            this.invokeGetUsersByAttributeResult({rescode: -1, msg: "Attribute value is null."});
            return;
        }

        this._channel.getChannelUserListByAtrribute({channelId: channelId, key: key, prop: value}).then(res => {
            console.log("HSA-JS.getChannelUserListByAttribute res:", JSON.stringify(res));
            this._log.debug("HSA-JS.getChannelUserListByAttribute res: $0", res);
            this.invokeGetUsersByAttributeResult(res);
        }).catch(err => {
            console.log("HSA-JS.getChannelUserListByAttribute failed: " + JSON.stringify(err));
            this._log.error("HSA-JS.getChannelUserListByAttribute failed: $0", err);
            this.invokeGetUsersByAttributeResult({rescode: -1, msg: err.message});
        });
    }

    onNotifyUserAttributesChange(room) {
        const roomEvents = [
            "MemberAttributesSet",
            "MemberAttributesDeleted",
            "MemberAttributesCleared",
            "MemberAttributesAddedOrUpdated"
        ];
        roomEvents.forEach(eventName => {
            room.on(eventName, (data) => {
                console.log(`接收消息${eventName} [${room.region}:${room.roomId}]: ` + JSON.stringify(data));
                data.channelId = room.roomId;
                if (eventName == "MemberAttributesAddedOrUpdated") {
                    this.invokeOnNotifyUserAttributesAddedOrUpdate(data);
                } else if ("MemberAttributesCleared") {
                    this.invokeOnNotifyUserAttributesClear(data);
                } else if ("MemberAttributesDeleted") {
                    this.invokeOnNotifyUserAttributesDelete(data);
                } else if ("MemberAttributesSet") {
                    this.invokeOnNotifyUserAttributesSet(data);
                }
            });
        });
    }

    onNotifyRoomAttributesChange(room) {
        const roomEvents = [
            "RoomAttributesSet",
            "RoomAttributesDeleted",
            "RoomAttributesCleared",
            "RoomAttributesAddedOrUpdated"
        ];
        roomEvents.forEach(eventName => {
            room.on(eventName, (data) => {
                console.log(`接收消息${eventName} [${room.region}:${room.roomId}]: ` + JSON.stringify(data));
                if (eventName == "RoomAttributesAddedOrUpdated") {
                    this.invokeOnNotifyRoomAttributesAddOrUpdate(data);
                } else if (eventName == "RoomAttributesCleared") {
                    this.invokeOnNotifyRoomAttributesClear(data);
                } else if (eventName == "RoomAttributesDeleted") {
                    this.invokeOnNotifyRoomAttributesDelete(data);
                } else if (eventName == "RoomAttributesSet") {
                    this.invokeOnNotifyRoomAttributesSet(data);
                }
            });
        });
    }

    /* 组播消息接收模块 */
    onReceiveRoomMessage(room) {
        room.on('RoomMessage', (data) => {
            data.message.data = Hummer.Utify.decodeUtf8BytesToString(data.message.data);
            console.log(`接收组播消息RoomMessage: [${room.region}:${room.roomId}]:` + JSON.stringify(data));
            data.message.channelId = room.roomId;
            this.invokeOnReceiveChannelMessage(data);
        });
    }

    subscribeRoomEvents(rtsRoom) {
        const roomEvents = [
            "MemberJoined",
            "MemberLeft",
            "MemberCountUpdated",
            "RoomMemberOffline"
        ];
        roomEvents.forEach(eventName => {
            rtsRoom.on(eventName, (data) => {
                console.log(`接收消息${eventName} [${rtsRoom.region}:${rtsRoom.roomId}]:` + JSON.stringify(data));
                if (eventName == "MemberJoined") {
                    this.onNotifyJoinChannel(data);
                } else if (eventName == "MemberLeft") {
                    this.onNotifyLeaveChannel(data);
                } else if (eventName == "RoomMemberOffline") {
                    this.onNotifyMemberOffline(data);
                } else if (eventName == "MemberCountUpdated") {
                    this.onNotifyCountUpdated(data);
                }
            });
        });
    }

}

export default HSAJS;
