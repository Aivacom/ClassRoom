import React, {Component} from 'react';

const {net, dialog} = require('electron').remote;
const clipboard = require('electron').clipboard;
import './app.css';
import "white-web-sdk/style/index.css";

import ThalFactory from "../sdk/ThalFactory";
import Token from "../common/TokenThunder"
import LocaleFactory from "../locale/LocaleFactory";

import NetworkStatusButton from "./NetworkStatusButton";
import RoomSetting from "./RoomSetting";
import renderUtils from "../common/RenderUtils"
import AppConstant from '../common/AppConstant'
import WhiteBoardTools from "./WhiteBoardTools";

import {Room, RoomPhase, RoomWhiteboard, WhiteWebSdk, ViewMode} from "white-react-sdk";
import NetlessBoardRoom from "../whiteBoard/NetlessBoardRoom";
import LogoImage from "./LogoImage";
import ChatMessage from "../common/ChatMessage";
import UserChatCourse from "./UserChatCourse";
import {UserCursor} from "@netless/cursor-adapter";
import LogFactory from "../log/LogFactory";
import HttpApi from "../common/HttpApi";
import {AppId} from "../ProductConfig"
import {
    flatMap,
    concatMap,
    filter,
    debounceTime,
    distinctUntilChanged,
    bufferTime,
    delay,
    take,
    catchError,
    map, retry, tap
} from "rxjs/operators";
import {BehaviorSubject, Observable, range, forkJoin, zip, throwError, of, timer} from "rxjs";
import {retryWhen} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";
import "rxjs/operator/do";
import Axios from "axios";
import * as _ from 'lodash';
import * as defer from "rxjs";

const fs = require('fs');
const compressing = require('compressing');


/*
data in state.canvas:

{
    uid: '',
    canvas: document.getElementById("remoteUser1"),
}

data of user
{
uid: "",
nickName: "",
role:
}

* */

class App extends Component {
    UserRole_Publisher = "1";
    UserRole_Watcher = "2";

    LogFileName = "ClassRoom-PC.log";

    EncoderConfigMode = 101;

    _sdk = new WhiteWebSdk();
    _board = new NetlessBoardRoom();

    _api = new HttpApi();

    _log = new LogFactory().New("localFile", {logFileName: this.LogFileName, logPrefix: "--- App: "});

    requestor = new BehaviorSubject(null);

    obsArray = new BehaviorSubject([]);
    userListObs$ =  this.obsArray.asObservable();

    constructor(props) {
        super(props);
        var cursor = new UserCursor();
        let thunderEngine = this.getThunderEngine();
        this.state = {
            appid: AppId,
            roomId: '',
            testUserId: String(parseInt(Math.random() * (90000000) + 10000000, 10)),
            uid: String(parseInt(Math.random() * (90000000) + 10000000, 10)),
            userName: '',
            // joinRoom 方法中传入 cursor 对象
            cursorAdapter: cursor,
            lang: new LocaleFactory().load(props.language),

            isBoardJoined: false,
            joinedBoardRooms: [],
            boardContent: 0,
            BoardToken: '',
            boardUuid: '',

            isHandOn: false,
            isClassBegin: false,
            classBeginSeconds: 0,
            classBeginText: '00:00',

            videoDeviceIndex: 0,
            audioDeviceId: "",

            networkQuality: 0,
            waitingSeconds: 0,
            handingUserIds: [],
            connectingUserId: 0,
            talkingUserId: 0,

            joinedRoom: false,
            isLoopback: false,
            canvas: [],
            isMuteAll: false,
            users: [],
            joinedUsers: [],
            muteUsers: [],
            userMessages: [],

            inited: false,
            isHummerInited: false,
            isMicOn: false,
            isCameraOn: false,
            isStarted: false,

            joinStatusTip: '',

            joinBtnDisabled: false,
            startBtnDisabled: true,
            stopBtnDisabled: true,

            roomMembers: [],
            room: null,
            roomState: null,
            zoomNumber: 1,
            currentApplianceName: "pencil",
            testInputVolume: 0,
            classVideoAddress: "",
            PPTMode: true,
            scenes: [],
            images: [],
            isPlaying: false
        };
        this.state.classNote = this.state.lang.Welcome;
        this.state.classVideoAddress = this.state.lang.ComingSoon;
        this._log.debug('set class note: $0', this.state.classNote);
        console.log("log is saved to: " + this._log.logFileNameFull);

        this.requestor.pipe(bufferTime(800),
            filter(users => users.length > 0))
            .subscribe(users => {
                try {
                    console.log("App.onMessageFromUser" + ", users: " + JSON.stringify(users));
                } catch (e) {

                }
                if (users.length > 0) {
                    this.addUserNew(users);
                }
            });
    }

    addUserToObservableArray(item) {
        this.userListObs$.pipe(take(1)).subscribe(val => {
            console.log(val)
            const newArr = [...val, item];
            this.obsArray.next(newArr);
        });
    }

    removeUserToObservableArray(idx) {
        this.array$.pipe(take(1)).subscribe(val => {
            const arr = this.obsArray.getValue()
            arr.splice(idx, 1)
            this.obsArray.next(arr)
        })
    }

    indexOf(item, array) {
        if (!array) {
            return false;
        }

        for (let i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    }

    remove(item, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                break;
            }
        }
    }

    isMute(userId) {
        return this.state.isMuteAll || this.indexOf(userId, this.state.muteUsers) >= 0;
    }

    addHanding(userId) {
        if (!userId) {
            return;
        }

        if (this.indexOf(userId, this.state.handingUserIds) >= 0) {
            try {
                let btn = document.getElementById("mike0_" + userId);
                btn.style.display = "";
                btn = document.getElementById("mike1_" + userId);
                btn.style.display = "none";
            } catch (e) {

            }
            return;
        }

        this.state.handingUserIds.push(userId);
        this.setState(this.state);
        let btn = document.getElementById("mike0_" + userId);
        if (btn)
            btn.style.display = "";
    }

    removeHanding(userId) {
        this._log.debug("remove handing $0", userId);

        if (!userId || this.indexOf(userId, this.state.handingUserIds) < 0) {
            let btn = document.getElementById("mike0_" + userId);
            if (btn) {
                btn.style.display = "none";
            }

            btn = document.getElementById("mike1_" + userId);
            if (btn) {
                btn.style.display = "none";
            }
            return;
        }
        this.remove(userId, this.state.handingUserIds);
        this.setState(this.state);
        let btn = document.getElementById("mike0_" + userId);
        if (btn) {
            btn.style.display = "none";
        }
    }

    isHanding(userId) {
        return this.indexOf(userId, this.state.handingUserIds) >= 0;
    }

    isTalking(userId) {
        return userId === this.state.talkingUserId;
    }

    buildCommand(key, value, jsonValue) {
        return JSON.stringify({
            "key": key,
            "value": value == null ? '' : (typeof value == 'number' ? String(value) : value),
            jsonValue: jsonValue == null ? '' : jsonValue
        });
    }

    sendRoomCommand(key, value, jsonValue) {
        let engine = this.getThunderEngine();
        let command = this.buildCommand(key, value, jsonValue);

        engine.sendMessageToChannel(this.state.roomId, command, "default", true);
    }

    sendUserCommand(userId, key, value, jsonValue, reliable) {
        let engine = this.getThunderEngine();
        let command = this.buildCommand(key, value, jsonValue);

        engine.sendMessageToUser(userId, command, "default", reliable === true);
    }

    /**
     * 老师进入频道初始化举手状态
     * key：restart
     * value：1:重置
     */
    initHandState() {
        // this.sendRoomCommand("class_restart");
        // this.sendRoomStateToAll();
    }

    initClassState() {
        let data = {
            nick_name: `${this.state.uid}`,
            uid: this.state.uid,
            video: this.state.isCameraOn? "1": "0",
            audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: this.state.isHandOn? "1" : "0",
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }

        // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
        this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
    }

    /**
     * 学生申请举手/取消举手
     * key：hand
     * value：0:取消举手，1:申请举手
     */
    startHands() {
        // this.sendRoomCommand("hand", '1');
        let data = {
            nick_name: `${this.state.uid}`,
            uid: this.state.uid,
            video: this.state.isCameraOn? "1": "0",
            audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: "1",
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }

        // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
        this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
    }

    /**
     * 取消举手
     * key：hand
     * value：0:取消举手，1:申请举手
     */
    stopHands() {
        // this.sendRoomCommand("hand", '0');
        // let data = Object.assign({}, this.state.roomAttrs, {open_hand: "0"});
        let data = {
            nick_name: "",
            uid: this.state.uid,
            video: this.state.isCameraOn? "1": "0",
            audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: '0',
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }

        // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
        this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
    }

    sendRoomStateToUser(userId) {
        let rs = {
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: this.state.isHandOn ? '1' : '0',
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid
        };

        this.sendUserCommand(userId, 'class_state', null, rs);
    }

    sendRoomStateToAll() {
        let rs = {
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: this.state.isHandOn ? '1' : '0',
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid
        };

        this.sendRoomCommand('class_state', null, rs);
    }

    sendClassNote() {
        this.sendRoomCommand('public_message', this.state.classNote);
    }

    /**
     * 发送频道消息
     * @param message
     */
    sendChatMessageToRoom(message) {
        let msg = {
            msg_content: message,
            msg_time: Date.now() / 1000,
            msg_nickname: this.state.userName
        };
        this.sendRoomCommand('message', null, msg);
    }

    /**
     * 发送消息给用户
     * @param userId
     * @param message
     */
    sendChatMessageToUser(userId, message) {
        let msg = {
            msg_content: message,
            msg_time: Date.now() / 1000,
            msg_nickname: this.state.userName
        };
        this.sendUserCommand(userId, 'message', null, msg);
    }

    /**
     * 老师同意连麦
     * key：mike
     * value：0:断开连麦，1:同意连麦
     * @param userId
     */
    agreeUserTalk(userId) {
        if (this.state.isPlaying) {
            this.showStudentMsg(this.state.lang.turnDeviceError1);
            return;
        }

        if (this.state.talkingUserId && userId !== this.state.talkingUserId) {
            this.showStudentMsg(this.state.lang.StudentConnectErrMsg);
            return;
        }
        if (this.state.connectingUserId && userId !== this.state.connectingUserId) {
            this.showStudentMsg(this.state.lang.StudentConnectErrMsg);
            return;
        }

        let user = this.getUser(userId);

        let data = {
            key: "online",
            value: {
                nickname: user ? user.nickName : "",
                uid: userId,
                video: "1",
                audio: "1",
                role: "2"
            }
        }

        this.getThunderEngine().addOrUpdateRoomAttributes(userId, JSON.stringify(data));

        // this.getThunderEngine().addOrUpdateLocalUserAttributes("linkId", userId).then((res) => {
        //     console.log("APP.addOrUpdateLocalUserAttributes Res: ", JSON.stringify(res));
        //     this._log.debug("APP.addOrUpdateUserAttributes Res:$0", res);
        //     this.sendUserCommand(userId, "mike", 1);
        // }).catch((err) => {
        //     console.log("APP.addOrUpdateUserAttributes failed: " + JSON.stringify(err));
        //     this._log.error("APP.addOrUpdateUserAttributes Res:$0 ", JSON.stringify(err));
        // });

        this.waitingTalk(userId);

        let btn = document.getElementById("mike0_" + userId);
        btn.style.display = "none";
        btn = document.getElementById("mike1_" + userId);
        btn.style.display = "";
        this.setState({
            connectingUserId: userId
        })
    }

    /**
     * 老师断开连麦
     * key：mike
     * value：0:断开连麦，1:同意连麦
     * @param userId
     */
    rejectUserTalk(userId) {
        if (this.state.waitingSeconds > 0) {
            return;
        }
        let btn = document.getElementById("mike1_" + userId);
        btn.style.display = "none";
        btn = document.getElementById("videoStudent");
        btn.style.display = "none";


        this.getThunderEngine().deleteRoomAttributesByKeys([userId]).then(res => {
            this.playUserVideo(userId, true);
        });

        this.getThunderEngine().deleteUserAttributesByKeys(["linkId"]).then(res => {
            this.sendUserCommand(userId, "mike", 0, '', true);
            this.playUserVideo(userId, true);
        });

        // 清除学生网络信号状态
        let onLineUsers = this.state.users;
        onLineUsers.forEach((user, index) => {
            user.networkQuality = null;
        });
    }

    waitingTalk(userId) {
        this.state.waitingSeconds = 15;
        this.setState(this.state);
        let canvas = document.getElementById("videoStudent");
        canvas.style.display = "";
        canvas = document.getElementById("videoStudentTime");
        canvas.style.display = "";

        setTimeout(this.waiting.bind(this), 1000, userId);
    }

    waiting(userId) {
        if (this.state.talkingUserId && this.state.talkingUserId === userId) {
            this.state.waitingSeconds = 0;
            return;
        }

        if (this.state.talkingUserId && this.state.talkingUserId !== userId) {
            console.log("App.waiting: other people is talking, stop waiting...");
            return;
        }
        if (this.state.connectingUserId && this.state.connectingUserId !== userId) {
            console.log("App.waiting: other people is connecting, stop waiting...");
            return;
        }

        if (this.state.talkingUserId === userId) {
            console.log("App.waiting: start talking, stop waiting...");
            let canvas = document.getElementById("videoStudentTime");
            canvas.style.display = "none";
            return;
        }

        if (this.state.waitingSeconds <= 0) {
            console.log("App.waiting: waiting expired, stop waiting...");
            this.rejectUserTalk(userId);
            return;
        }

        this.state.waitingSeconds--;
        this.setState(this.state);
        setTimeout(this.waiting.bind(this), 1000, userId);
    }

    onUserJoined(uid, elapsed) {
        console.log("App.onUserJoined, uid = " + uid);
        if (uid === this.state.uid) {
            console.log("ignored user joined of me.");
            this.closeUniqueDialog('dialog003');
            return;
        }
        if (uid === this.state.testUserId) {
            console.log("ignored user joined of test id.");
            return;
        }

        // this.addUser(uid, uid, 2);
        this.getUserAttr([uid]);
        // this.sendRoomStateToUser(uid);
        // this.setState(this.state);
    }

    formatDate(date) {
        return date.getFullYear() + "-" +
            (date.getMonth() + 1) + "-" +
            date.getDay() + "-" +
            date.getHours() + ":" +
            date.getMinutes() + ":" +
            date.getSeconds() + "." +
            date.getMilliseconds();
    }

    formatNow() {
        return this.formatDate(new Date()) + " ";
    }

    /**
     * 用户离开频道回调
     * @param uid
     * @param reason
     */
    onUserLeaved(uid, reason) {
        console.log(this.formatNow() + "App.onUserLeaved, uid = " + uid);

        if (uid === this.state.uid && this.state.joinedRoom === true) {
            this.handleExit();
        } else if (uid === this.state.talkingUserId) {
            this.playUserVideo(uid, true);
            this.getThunderEngine().deleteRoomAttributesByKeys([uid]);
            this.removeUser(uid);
            this.getThunderEngine().getRoomAttributes(this.state.roomId).then(result => {
                let attributes = result.attributes;
                if (attributes.StudentAnchor) {
                    let jsonStr = attributes.StudentAnchor;
                    if (jsonStr && jsonStr.uid === uid) {
                        this.getThunderEngine().deleteRoomAttributesByKeys("StudentAnchor");
                    }
                }
            });

        } else if (uid === this.state.connectingUserId) {
            let canvas = document.getElementById("videoStudent");
            canvas.style.display = 'none';
            canvas = document.getElementById("videoStudentTime");
            canvas.style.display = 'none';

            this.state.connectingUserId = 0;
            this.remove(uid, this.state.handingUserIds);
            this.removeHanding(uid);
            this.showUserMuteStatus(uid);
            this.remove(uid, this.state.muteUsers);
            this.removeUser(uid);
            this.setState(this.state);
        } else {
            this.removeHanding(uid);
            this.showUserMuteStatus(uid);
            this.remove(uid, this.state.muteUsers);
            this.removeUser(uid);
            this.setState(this.state);
        }
    }

    /**
     * 用户角色回调
     * @param roomId
     * @param userId
     * @param attribute
     */
    onUserAttributeAddedOrUpdate(roomId, userId, attribute) {
        console.log("App.onUserAttributeAddedOrUpdate, roomId:" + roomId + ", userId: " + userId + ", attr: " + JSON.stringify(attribute));
        let nickname = JSON.parse(_.get(attribute, `${userId}`)).nickname;
        console.log(`nickname = ${nickname}`);

        if (userId != this.state.uid) {
            let users = this.state.users;
            let user = {
                uid: userId,
                nickName: nickname,
                role: 2
            }
            let result = this.indexOfUsers(user, users);
            let needUpdate = false;
            if (result == -1) {
                needUpdate = true;
                users.push(user);
            } else {
                users[result].nickName = nickname;
            }

            if (needUpdate) {
                this.setState({
                    users: users
                })
            }
            // this.addUser(userId, attribute.userId.nickname, "2");
        }

        if (userId == this.state.uid) {

        }
    }

    onUserAttributeDeleted(roomId, userId, attribute) {
        let users = this.state.users;
        let index = this.indexOfUsers({uid: userId}, users);
        users.splice(index, 1);
        this.setState({
            users: users
        })
    }

    onRoomAttributeAddOrUpadte(roomId, userId, attribute) {
        console.log("App.onRoomAttributeAddOrUpadte, roomId:" + roomId + ", userId: " + userId + ", attr: " + JSON.stringify(attribute));
        if (!this.state.isClassBegin) {
            console.log("Class dose not begin, no attribute will be handled.");
            return;
        }

        // if (attribute.StudentAnchor && attribute.StudentAnchor.uid === this.state.uid) {
        //     if (attribute.role) {
        //         this.handleSelfRoleChanged(attribute.role);
        //     }
        //
        //     console.log("ignore attribute change of me.");
        //     return;
        // }

        if (attribute.StudentAnchor) {
            // this.handleUserRoleChanged(userId, attribute.role);
            this.playUserVideo(userId, false);
        }
    }

    onRoomAttributeDelete(roomId, userId, attribute) {

    }

    handleSelfRoleChanged(role) {
        if (role == this.UserRole_Watcher) {
            if (this.state.isClassBegin && this.state.isCameraOn === false) {
                let engine = this.getThunderEngine();
                engine.cancelVideoCanvas(this.state.uid);
                engine.stopVideoPreview();
                engine.stopVideoDeviceCapture();
                engine.stopLocalVideoStream(true);
            }
        }
    }

    handleUserChangedRoomAttr(uid, role) {
        console.log("App.handleUserChangedRoomAttr, uid: " + uid, +", role:" + role);
        if (uid === this.state.uid) {
            console.log("ignored role changed from me.");
            return;
        }

        let user = this.getUser(uid);
        if (user) {
            user.role = role;
        } else {
            this.addUser(uid, uid, this.UserRole_Watcher);
            this.setState(this.state);
        }

        if (role === this.UserRole_Watcher) {
            if (uid === this.state.talkingUserId) {
                this.playUserVideo(uid, true);
            }
        }
        if (role === this.UserRole_Publisher) {
            if (uid === this.state.connectingUserId) {
                this.playUserVideo(uid, false);
            }
        }
    }

    indexOfUsers(item, array) {
        if (!item) {
            return -1;
        }

        if (!array || array.length == 0) {
            return -1;
        }

        for (let i = 0; i < array.length; i++) {
            if (array[i].uid === item.uid) {
                return i;
            }
        }
        return -1;
    }

    addUserNew(array) {
        if (array && array.length > 0) {

        } else {
            return;
        }


        try {
            // 拷贝两个数组
            let joinedUsers = Array.from(this.state.joinedUsers);
            let onLineUsers = Array.from(this.state.users);

            // 过滤出符合条件的User
            let onLineUsersTemp = Array.from(array.filter(arrayUser => arrayUser ? !(arrayUser.uid === arrayUser.nickname) : false));
            console.log("onLineUsersTemp: " + JSON.stringify(onLineUsersTemp));
            // 迭代加入用户表
            onLineUsersTemp.forEach(arrayUser => {
                if (arrayUser) {

                    var indexTemp = this.indexOfUsers(arrayUser, onLineUsers);
                    var tempRole = null;
                    while (indexTemp >= 0) {
                        if (!tempRole) {
                            tempRole = onLineUsers[indexTemp].role ? onLineUsers[indexTemp].role : null;
                        }
                        if (onLineUsers[indexTemp].uid === arrayUser.uid) {
                            onLineUsers.splice(indexTemp, 1);
                        }
                        indexTemp = this.indexOfUsers(arrayUser, onLineUsers);
                    }

                    // 如果是教师，放在第一位
                    if (arrayUser.uid === this.state.uid) {
                        onLineUsers.unshift({
                            uid: arrayUser.uid,
                            nickName: arrayUser.nickName,
                            role: arrayUser.role ? arrayUser.role : tempRole
                        });
                    } else {
                        onLineUsers.push({
                            uid: arrayUser.uid,
                            nickName: arrayUser.nickName,
                            role: arrayUser.role ? arrayUser.role : tempRole
                        });
                    }
                }
            });

            // 刚加进来的，nickName = uid，没有设置过，过滤出不是用户表的数据
            let joinedUsersTemp = Array.from(array.filter(arrayUser => (this.indexOfUsers(arrayUser, onLineUsers) === -1)));

            // 爹在加入待定用户组
            joinedUsersTemp.forEach(arrayUser => {
                if (arrayUser) {
                    let user = {
                        uid: arrayUser.uid,
                        nickName: arrayUser.nickName === arrayUser.uid ? arrayUser.uid : arrayUser.nickName,
                        role: arrayUser.role
                    };

                    var indexTemp = this.indexOfUsers(user, joinedUsers);
                    while (indexTemp >= 0) {
                        if (joinedUsers[indexTemp].uid === arrayUser.uid) {
                            joinedUsers.splice(indexTemp, 1);
                        }
                        indexTemp = this.indexOfUsers(user, joinedUsers);
                    }
                    joinedUsers.push(user);
                    console.log("onLineUsersTemp: " + JSON.stringify(joinedUsers));
                }
            });
            // 再次过滤和用户表是否有重复
            let oldJoinedUsersTemp = joinedUsers.filter(arrayUser => (this.indexOfUsers(arrayUser, onLineUsers) === -1));

            this.state.joinedUsers = oldJoinedUsersTemp;
            this.state.users = onLineUsers;
            this.setState(this.state);
            console.log("onLineUsersTemp this.state.users: " + JSON.stringify(this.state.users));
        } catch (e) {
            throw e;
        }
    }

    addUser(uid, nickName, role) {
        this.requestor.next({uid: uid, nickName: nickName, role: role});
    }

    removeUser(uid) {
        for (let i = 0; i < this.state.users.length; i++) {
            let user = this.state.users[i];

            if (user.uid === uid) {
                this.state.users.splice(i, 1);
                break;
            }
        }
    }

    getUser(uid) {
        for (let i = 0; i < this.state.users.length; i++) {
            let user = this.state.users[i];

            if (user.uid === uid) {
                return user;
            }
        }

        return null;
    }

    setUserRole(uid, role) {
        for (let i = 0; i < this.state.users.length; i++) {
            let user = this.state.users[i];

            if (user.uid === uid) {
                user.role = role;
                return;
            }
        }
    }

    componentDidMount() {
        this.initEngine();
        if (this.state.inited) {
            this.initDeviceList();
            this.initCanvas();

            this.refreshVideoCanvas();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
        if (this.state.inited) {
            this.destroyEngine();
            this.state.inited = false;
        }
    }

    componentWillMount() {
        window.addEventListener("resize", this.onWindowResize);

    }

    onWindowResize = e => {
        if (this.state.room) {
            this.state.room.moveCamera({centerX: 0, centerY: 0});
            this.state.room.refreshViewSize();
            this.state.room.convertToPointInWorld({x: 0, y: 0});
        }

        this.refreshVideoCanvas();
        this.getThunderEngine().resizeRenderers();
    };

    showMessageBox(msg) {
        const options = {
            title: this.state.lang.dialogMessageTitle,
            message: msg,
        };

        dialog.showMessageBox(options);
    }

    getThunderEngine() {
        if (!this.thunderEngine) {
            this.thunderEngine = new ThalFactory().new({logFileName: this.LogFileName}, "win");
            let i = this._log.logFileNameFull.lastIndexOf("\\");
            let logPath = this._log.logFileNameFull.substring(0, i);
            console.log("logPath : " + logPath);
            this.thunderEngine.setLogFilePath(logPath)
            this.subscribeEvents(this.thunderEngine);
            window.thunderEngine = this.thunderEngine;
        }
        return this.thunderEngine
    }

    /**
     * SDK回调事件
     * @param thunderEngine
     */
    subscribeEvents = (thunderEngine) => {
        thunderEngine.on('onJoinRoomSuccess', (roomName, uid, elapsed) => {
            this.onJoinRoomSuccess(roomName, uid, elapsed);
        });
        thunderEngine.on('onLeaveRoom', () => {
            this.onLeaveRoom();
        });

        thunderEngine.on('onTokenWillExpire', (token) => {
            this.updateToken();
        });
        thunderEngine.on('onRemoteAudioStopped', (uid, stop) => {
            this.onRemoteAudioStopped(uid, stop);
        });
        thunderEngine.on('onInputVolume', (volume) => {
            this.onInputVolume(volume);
        });

        thunderEngine.on("onUserJoined", this.onUserJoined.bind(this));
        thunderEngine.on("onUserOffline", this.onUserLeaved.bind(this));
        thunderEngine.on("onMemberCountUpdated", this.onMemberCountUpdated.bind(this));
        thunderEngine.on("onRoomMemberOffline", this.onRoomMemberOffline.bind(this));
        thunderEngine.on("onUserAttributeAddedOrUpdate", this.onUserAttributeAddedOrUpdate.bind(this));
        thunderEngine.on("onUserAttributeDeleted", this.onUserAttributeDeleted.bind(this));
        thunderEngine.on("onRoomAttributeAddOrUpadte", this.onRoomAttributeAddOrUpadte.bind(this));
        thunderEngine.on("onRoomAttributeDelete", this.onRoomAttributeDelete.bind(this));
        thunderEngine.on("onNetworkQuality", this.onNetworkQuality.bind(this));
        thunderEngine.on("onMessageFromChannel", this.onMessageFromChannel.bind(this));
        thunderEngine.on("onMessageFromUser", this.onMessageFromUser.bind(this));
        thunderEngine.on('onUserList', this.onUserListResult.bind(this));
        thunderEngine.on('onConnectionStateChanged', this.onConnectionStateChanged.bind(this));
        thunderEngine.on('onPlayVolumeIndication', (speakers, totalVolume) => {
            this.onPlayVolumeIndication(speakers, totalVolume);
        });
        thunderEngine.on('onCaptureVolumeIndication', (totalVolume, cpt, micVolume) => {
            this.onCaptureVolumeIndication(totalVolume, cpt, micVolume);
        });
    };

    onCaptureVolumeIndication(totalVolume, cpt, micVolume) {
        console.log("App.onCaptureVolumeIndication: totalVolume = " + totalVolume + " micVolume: = " + micVolume);
        if (micVolume< 0) {
            micVolume = 0;
        }

        if (micVolume > 100) {
            micVolume = 100;
        }

        this.teacherVomumeRef.current.src = renderUtils.getImage("/images/voice/voice_user_" + parseInt(micVolume / 20) + ".png");
    }

    teacherVomumeRef = React.createRef();
    studentVomumeRef = React.createRef();

    onPlayVolumeIndication(speakers, totalVolume) {
        // speakers = [{uid: "59155752", volume: 15}]
        console.log("App.onPlayVolumeIndication: speakers = " + JSON.stringify(speakers) + "totalVolume: = " + totalVolume);
        speakers.forEach(speak => {
            if (speak.uid === this.state.uid) {
                this.teacherVomumeRef.current.src = renderUtils.getImage("/images/voice/voice_user_" + parseInt(speak.volume / 20) + ".png");
            } else if (speak.uid === this.state.talkingUserId){
                this.studentVomumeRef.current.src = renderUtils.getImage("/images/voice/voice_user_" + parseInt(speak.volume / 20) + ".png");
            }
        });
    }

    onRoomMemberOffline(data) {
        console.log("App.onRoomMemberOffline: data = " + JSON.stringify(data));
        this._log.debug("App.onRoomMemberOffline: data = " + JSON.stringify(data));
        this.needUpdateRoomAttr = true;
        if (this.connectState == "CONNECTED") {
            this.reSetState();
        }
    }

    onMemberCountUpdated(data) {
        console.log("App.onMemberCountUpdated: data = " + JSON.stringify(data));
        this._log.debug("App.onMemberCountUpdated: data = " + JSON.stringify(data));

    }

    connectState = "";
    needUpdateRoomAttr = false;

    reSetState() {
        console.log("App.reSetState");
        this._log.debug("App.reSetState");
        let data = {
            nick_name: this.state.userName,
            uid: this.state.uid,
            video: this.state.isCameraOn ? "1" : "0",
            audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: this.state.isHandOn ? "1" : "0",
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }

        zip(fromPromise(this.getThunderEngine().join()), fromPromise(this.getThunderEngine().getRoomAttributes(this.state.roomId)).pipe(flatMap(async (result) => {
            let keys = Object.keys(result.attributes);
            console.log("App.getRoomAttributes result keys = " + JSON.stringify(keys));
            this._log.debug("App.getRoomAttributes result keys = " + JSON.stringify(keys));

            keys = keys.filter(key => key != "Teacher");
            keys.forEach(key => {
                this.playUserVideo(key, true);
            });
            try {
                return fromPromise(this.getThunderEngine().deleteRoomAttributesByKeys(keys));
            } catch (err) {
                console.error(err);
                Observable.throwError(err);
            }
        })), Observable.create((observer => {
            this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
            observer.next();
        }))).subscribe((res) => {
                this._log.debug("App.reSetState: next = " + JSON.stringify(res));
                console.log("App.reSetState: next = " + JSON.stringify(res));
            }, (error) => {
                this._log.debug("App.reSetState: error = " + JSON.stringify(error));
                console.error("App.reSetState: error = " + error);
            },
            () => {
                this._log.debug("App.reSetState: complete");
                console.log("App.reSetState: complete");
                this.needUpdateRoomAttr = false;
            });
    }

    onConnectionStateChanged(data) {
        console.log("App.onConnectionStateChanged: data = " + JSON.stringify(data));
        this._log.debug("App.onConnectionStateChanged: data = " + JSON.stringify(data));
        if (data.state == "CONNECTED" && this.connectState == "RECONNECTING") {
            try {
                if (this.needUpdateRoomAttr) {
                    this.reSetState();
                    // this.needUpdateRoomAttr = false;
                }
            } catch (err) {
                throw err;
            }
        }
        this.connectState = data.state;

    }

    getUserAttr(userIds) {
        console.log("App.getUserAttr: userIds = " + JSON.stringify(userIds));
        let getUserAttrObs = [];
        try {
            for (var i = 0; i < userIds.length; i++) {
                let uid = userIds[i];
                if (uid === this.state.uid) {
                    continue;
                }

                Observable.create(async (obs) => {
                    let result = await this.getThunderEngine().getUserAttributes(uid);
                    if (!result.attributes || !result.attributes[`${result.uid}`]) {
                        obs.error("error");
                    }
                    obs.next(result);
                }).pipe(retryWhen(errors =>
                    errors.pipe(
                        flatMap((error, count) => {
                            if (error == "error") {
                                console.log(error);
                                return ++count >= 3 ? throwError(error) : timer(count * 1000);
                            } else {
                                return throwError(error);
                            }
                        }))
                )).subscribe((userAttr) => {
                    console.log("getUserAttributes " + JSON.stringify(userAttr));

                    let users = this.state.users;
                    let needUpdate = false;
                    // userAttrs.forEach((userAttr, index) => {
                    console.log("Observable.forkJoin getUserAttributes userInfo = " + JSON.stringify(userAttr));

                    if (userAttr.attributes && userAttr.uid && userAttr.attributes[`${userAttr.uid}`] && JSON.parse(userAttr.attributes[`${userAttr.uid}`]).nickname) {
                        // this.addUser(userAttr.uid, JSON.parse(userAttr.attributes[`${userAttr.uid}`]).nickname, 2);
                        let user = {
                            uid: userAttr.uid,
                            nickName: JSON.parse(userAttr.attributes[`${userAttr.uid}`]).nickname,
                            role: 2
                        }

                        let result = this.indexOfUsers(user, users);
                        if (result == -1) {
                            needUpdate = true;
                            users.push(user);
                        } else {
                            users[result].nickName = JSON.parse(userAttr.attributes[`${userAttr.uid}`]).nickname;
                        }
                        console.log("this.state.users length = " + JSON.stringify(users));
                    }

                    if (needUpdate) {
                        this.setState({
                            users: users
                        });
                    }
                    }, (error) => {
                        console.error(error);
                    }, () => {
                        console.error("getUserAttributes complete");
                    });
            };
        } catch (err) {
            console.log("Observable.forkJoin getUserAttributes" + JSON.stringify(err));
        }
    }

    onUserListResult(userIds) {
        console.log("App.onUserList: " + JSON.stringify(userIds));

        this.state.joinedRoom = true;

        this.getUserAttr(userIds);

        // this.initHandState();
        // this.getThunderEngine().setUserAttributes("role", this.UserRole_Watcher);
        this.initClassState();

        this.state.joinStatusTip = this.state.lang.roomSettingLoadingEnumDevices;
        this.refreshDevices();

        this.state.joinStatusTip = this.state.lang.roomSettingLoadingEnterRoom;
        this.state.joinBtnDisabled = true;
        this.state.startBtnDisabled = false;
        this.state.stopBtnDisabled = true;

        let mask = document.getElementById('enterMask');
        let d = document.getElementById('dialogRoomParameters');
        if (d) {
            d.style.display = 'none';
        }
        if (mask) {
            mask.style.display = 'none';
        }

        if (!userIds) {
            return;
        }

        // for (let i = 0; i < userIds.length; i++) {
        //     if (userIds[i] === this.state.uid) {
        //         continue;
        //     }
        //     if (userIds[i] === this.state.testUserId) {
        //         continue;
        //     }
        //
        //     this.addUser(userIds[i], userIds[i], this.UserRole_Watcher);
        //
        // }
        this.setState(this.state);

    }

    /**
     * 聊天室消息
     * @param userId
     * @param msgText
     */
    onMessageFromUser(userId, msgText) {
        console.log("App.onMessageFromUser" + ", userId: " + userId + ", text: " + msgText);

        if (!userId) {
            console.log("Invalid userId onMessageFromUser.");
            return;
        }

        this.handleMessage('', userId, msgText);
    }

    /**
     * 频道消息
     * @param channelId
     * @param userId
     * @param msgText
     */
    onMessageFromChannel(channelId, userId, msgText) {
        console.log("App.onMessageFromChannel" + ", userId: " + userId + ", text: " + msgText);
        if (!userId) {
            console.log("Invalid user id in onMessageFromChannel.");
            return;
        }

        this.handleMessage(this.state.roomId, userId, msgText);
    }

    handleMessage(channelId, userId, msgText) {
        if (channelId && channelId !== this.state.roomId) {
            return;
        }

        if (userId !== this.state.uid) {
            let user = this.getUser(userId);
            if (!user) {
                this.addUser(userId, userId, this.UserRole_Watcher);
                this.setState(this.state);
            }
        }

        let msg = JSON.parse(msgText);

        if (!msg) {
            console.error("Bad json data on handing message from user: " + userId + ", msg text: " + msgText);
            return;
        }

        if (!msg.key) {
            console.error("BAD message command: No field 'key', msg text: " + msgText);
            return;
        }

        if (msg.key === "hand") {
            this.handleHand(userId, msg);
        } else if (msg.key === 'message') {
            this.handleChatMessage(channelId ? AppConstant.ChatMessageType.FromChannel : AppConstant.ChatMessageType.FromUser, userId, msg, msgText);
        } else if (msg.key === "stu_nickname") {
            this.updateUserNickName(userId, msg);
        } else if (msg.key === "class_mute") {
            if ('1' === msg.value) {
                this.showStudentMsg(this.state.lang.ChatDisableNotice);
            } else if ('0' === msg.value) {
                this.showStudentMsg(this.state.lang.ChatEnableNotice);
            }

        }
    }

    updateUserNickName(userId, msg) {
        this.addUser(userId, msg.value);
    }

    /**
     * 聊天室消息
     * @param msgType
     * @param userId
     * @param msg
     * @param msgText
     */
    handleChatMessage(msgType, userId, msg, msgText) {
        if (!msg.jsonValue) {
            console.error("Invalid chat message(No 'jsonValue') from: " + userId + ", msg: " + msgText);
            return;
        }
        if (!msg.jsonValue.msg_content) {
            console.error("Invalid chat message(No 'jsonValue.msg_content') from: " + userId + ", msg: " + msgText);
            return;
        }
        if (!msg.jsonValue.msg_time) {
            console.error("Invalid chat message(No 'jsonValue.msg_time') from: " + userId + ", msg: " + msgText);
            return;
        }
        if (!msg.jsonValue.msg_nickname) {
            console.error("Invalid chat message(No 'jsonValue.msg_nickname') from: " + userId + ", msg: " + msgText);
            return;
        }

        let mc = new ChatMessage();
        mc.fromType = msgType;
        mc.fromUserId = userId;
        mc.fromUserName = msg.jsonValue.msg_nickname;
        mc.fromUserRole = userId === this.state.uid ? AppConstant.ChatMessageUserRole.Teacher : AppConstant.ChatMessageUserRole.Student;

        mc.sendTimeStamp = msg.jsonValue.msg_time * 1000;
        mc.sendTimeText = this.timeStampToChatText(mc.sendTimeStamp);
        mc.content = msg.jsonValue.msg_content;

        // this.state.userMessages.push(mc);
        // this.setState(this.state);
        this.setState({
            userMessages: this.state.userMessages.concat([mc])
        })
    }

    timeStampToChatText(timeStamp) {
        let date = new Date(timeStamp);

        let h = date.getHours();
        let m = date.getMinutes();

        return String(h < 10 ? '0' + h : h)
            + ':'
            + String(m < 10 ? '0' + m : m);
    };

    handleHand(userId, msg) {
        if (userId === this.state.uid) {
            console.log("ignored hand action from me.");
            return;
        }

        if (msg.jsonValue && msg.jsonValue.netQuality != null) {
            for (let i = 0; i < this.state.users.length; i++) {
                if (this.state.users[i].uid === userId) {
                    this.state.users[i].networkQuality = msg.jsonValue.netQuality;
                    this.setState(this.state);
                    break;
                }
            }
        }

        if (!this.state.isHandOn) {
            console.log("Hand up is not open, no hand action will be handled.");
            return;
        }
        let isHandUp = msg.value == 1 || (msg.jsonValue && msg.jsonValue.state == 1);

        if (isHandUp) {
            this.addHanding(userId);
        } else {
            this.removeHanding(userId);
        }

        if (msg.jsonValue.netQuality != null) {
            for (let i = 0; i < this.state.users.length; i++) {
                if (this.state.users[i].uid === userId) {
                    this.state.users[i].networkQuality = msg.jsonValue.netQuality;
                    break;
                }
            }
        }
    }

    /**
     * 网络状态回调
     * @param uid
     * @param txQuality
     * @param rxQulity
     */
    onNetworkQuality(uid, txQuality, rxQulity) {
        console.log("onNetworkQuality, uid:" + uid + ", tx: " + txQuality);
        //0 meas me, read it from console logs.
        if (uid == 0 || uid === this.state.uid) {
            let quality = this.state.talkingUserId ? rxQulity < txQuality ? rxQulity : txQuality : txQuality;
            if (quality === this.state.networkQuality) {
                return;
            }
            this.state.networkQuality = quality;

            this.setState(this.state);
        } else {
            this.state.users.forEach((user, index) => {
                if (user.uid == uid) {
                    user.networkQuality = txQuality;
                }
            });
        }
    }

    /**
     * 初始化SDK
     */
    initEngine = () => {
        if (this.state.appid === '') {
            this.showMessageBox('Please input your app id!');
            return;
        }
        let thunderEngine = this.getThunderEngine();
        this.state.inited = thunderEngine.initialize(AppId, 0) === 0;
        this.thunderEngine.setAudioVolumeIndication(500, 0);
    };

    initCanvas = () => {
        this.state.canvas.push({
            uid: '',
            canvas: document.getElementById("videoStudent"),
        });
    };

    /**
     * 销毁SDK
     */
    destroyEngine = () => {
        let thunderEngine = this.getThunderEngine();
        thunderEngine.destroyEngine();
    };

    onTokenSuccess(token) {
        this.state.joinStatusTip = this.state.lang.roomSettingLoadingEnterRoom;
        this.state.joinBtnDisabled = false;
        this.setState(this.state);
        return new Promise(async (resolve, reject) => {
            let thunderEngine = this.getThunderEngine();
            thunderEngine.leaveRoom();

            await thunderEngine.login(this.state.uid, token);

            let r = await thunderEngine.joinRoom(token, this.state.roomId, this.state.uid);

            if (r !== 0) {
                this.state.joinStatusTip = this.state.lang.roomSettingLoadingEnterRoomFailed + r;
                this.state.joinBtnDisabled = false;
                this.setState(this.state);
                resolve()
            }
        })

    }

    onTokenFailed(data) {
        this.state.joinStatusTip = this.state.lang.roomSettingLoadingRequestTokenFailed;
        this.state.joinBtnDisabled = false;
        this.setState(this.state);
    }

    handleJoinRoom = () => {
        if (this.state.uid === '') {
            this.showMessageBox('Please input your user id!');
            return;
        }
        if (this.state.roomId === '') {
            this.showMessageBox('Please input a room id!');
            return;
        }

        this.state.joinStatusTip = this.state.lang.roomSettingLoadingRequestToken;
        this.state.joinBtnDisabled = false;
        this.setState(this.state);

        let token = new Token({
            appId: this.state.appid,
            userId: this.state.uid,
            roomId: this.state.roomId,
            target: this
        });
        token.request()
            .then(async (token) => await this.onTokenSuccess(token))
            .catch(this.onTokenFailed.bind(this))
    };

    handleTestChannel = () => {
        this.setState(this.state);
    };

    handleTokenUpdate(token) {
        let thunderEngine = this.getThunderEngine();
        let r = thunderEngine.updateToken(token);
    }

    handleTokenUpdateFailed(arg) {
        this.showMessageBox(this.state.lang.EngineUpdateTokenFailed);
    }

    updateToken = () => {
        this._token.request(this.handleTokenUpdate, this.handleTokenUpdateFailed);
    };

    getCanvas = (uid) => {
        return this.state.canvas[0].canvas;
    };

    cancelCanvas = (uid) => {
        this.state.canvas[0].uid = "";
    };

    initDeviceList = () => {
        let thunderEngine = this.getThunderEngine();
        let devices = thunderEngine.enumVideoDevices();
        settingVideoDevices.options.length = 0;
        for (let i = 0; i < devices.length; i++) {
            settingVideoDevices.options.add(new Option(devices[i].name, devices[i].index));
        }

        devices = thunderEngine.enumAudioInputDevices();
        settingMicDevices.options.length = 0;
        for (let i = 0; i < devices.length; i++) {
            settingMicDevices.options.add(new Option(devices[i].desc, devices[i].id));
        }

        if (this.state.audioDeviceId === "") {
            this.state.audioDeviceId = devices[0].id;
        }
    };

    onJoinRoomSuccess = (roomName, uid, elapsed) => {
        console.log('onJoinRoomSuccess: room=' + roomName + ', uid=' + uid);
        if (uid === this.state.testUserId) {
            this.state.joinStatusTip = this.state.lang.roomSettingLoadingCheckTeacher;

            this.state.joinBtnDisabled = true;
            this.setState(this.state);
            this.getThunderEngine().getUserList().then(result => {
                console.log('onJoinRoomSuccess getUserList: userList =' + JSON.stringify(result));
            });
        } else if (uid === this.state.uid) {
            this.state.joinStatusTip = this.state.lang.roomSettingLoadingGetStudentList;
            this.state.joinBtnDisabled = true;
            this.setState(this.state);
            this.getThunderEngine().getUserList().then(result => {
                console.log('onJoinRoomSuccess getUserList: userList =' + JSON.stringify(result));
            });
        } else {
            console.warn('Unknown room joining: room=' + roomName + ', uid=' + uid);
            this.getThunderEngine().leaveRoom();
        }
    };

    onLeaveRoom = () => {
        console.log("App.onLeaveRoom");
    };

    playUserVideo = (uid, stop) => {
        if (stop) {
            this.getThunderEngine().cancelVideoCanvas(uid);
            let canvas = this.getCanvas(uid);
            if (canvas) {
                canvas.style.display = "none";
            }
            this.cancelCanvas(uid);

            if (this.state.connectingUserId) {
                this.state.connectingUserId = 0;
                return;
            }

            if (this.state.talkingUserId > 0 && uid === this.state.talkingUserId) {
                this.state.connectingUserId = 0;
                this.state.talkingUserId = 0;
                this.getThunderEngine().stopRemoteAudioStream(uid, true);
                this.getThunderEngine().stopRemoteVideoStream(uid, true);
            }
        } else {
            if (!this.state.connectingUserId) {
                return;
            }

            if (this.state.connectingUserId > 0 && uid !== this.state.connectingUserId) {
                console.log("Video play: user is not handing:" + uid + ", handing user is: " + this.state.connectingUserId);
                return;
            }

            this.state.talkingUserId = uid;
            this.state.connectingUserId = 0;

            this.getThunderEngine().stopRemoteAudioStream(uid, false);
            this.getThunderEngine().stopRemoteVideoStream(uid, false);

            let canvas = this.getCanvas(uid);
            if (!canvas) {
                console.log("Video play: canvas is invalid.");
                return;
            }
            this.getThunderEngine().setVideoCanvas(uid, canvas, 2);
            canvas.style.display = "";

            let mask = document.getElementById("videoStudentTime");
            mask.style.display = "none";
        }
        this.setState(this.state);
    };

    onRemoteAudioStopped = (uid, stop) => {
        console.log("onRemoteAudioStopped:" + uid + ", stop: " + stop);
        if (stop) {

        } else {
            this.playUserVideo(uid, stop);
        }

    };

    onRemoteVideoStopped = (uid, stop) => {
        console.log("onRemoteVideoStopped:" + uid + ", stop: " + stop);
        if (stop) {

        } else {
            this.playUserVideo(uid, stop);
        }
    };

    onInputVolume = (volume) => {
        this.setState({testInputVolume: volume});
    };

    onVideoChanged(elementId) {

        let videoSelect = document.getElementById('settingVideoDevices');

        if (!videoSelect) {
            return;
        }

        let index = videoSelect.selectedIndex;

        let engine = this.getThunderEngine();

        engine.startVideoDeviceCapture(index);
        engine.startVideoDeviceCapture(index);

    };

    onAudioChanged(elementId) {
        let engine = this.getThunderEngine();

        if (this.state.audioDeviceId != elementId.target.value) {
            engine.stopAudioInputDeviceTest();
            this.setState({testInputVolume: 0});

            engine.stopLocalAudioStream(true);
            // engine.disableAudioEngine();
            // engine.enableAudioEngine();
            engine.enableLocalVideoCapture(true);
            engine.setAudioInputtingDevice(settingMicDevices.value);
            engine.stopLocalAudioStream(false);

            engine.startAudioInputDeviceTest(0);

        }

    };

    refreshVideoCanvas = () => {
    };

    applyDeviceSettings() {
        let engine = this.getThunderEngine();

        let videoIndex = Number(settingVideoDevices.value);
        let micId = settingMicDevices.value;
        let videoChanged = false;
        let micChanged = false;

        if (videoIndex !== this.state.videoDeviceIndex) {
            this.state.videoDeviceIndex = videoIndex;
            videoChanged = true;
        }

        if (micId !== this.state.audioDeviceId) {
            this.state.audioDeviceId = micId;
            micChanged = true;
        }

        videoChanged = true;
        if (this.state.isStarted && this.state.isCameraOn) {

            if (videoChanged) {
                engine.stopLocalVideoStream(true);
                engine.stopVideoPreview();
                engine.disableVideoEngine();

                // engine.enableVideoEngine();
                engine.startVideoDeviceCapture(this.state.videoDeviceIndex);
                engine.setVideoCanvas(this.state.uid, document.getElementById("videoMe"), 2);
                engine.setVideoEncoderConfig({playType: 1, publishMode: this.EncoderConfigMode});
                engine.setMediaMode(1);
                engine.setRoomMode(1);
                engine.startVideoPreview();
                engine.stopLocalVideoStream(false);

                // engine.enableVideoEngine();
                engine.startVideoDeviceCapture(this.state.videoDeviceIndex);
                engine.startVideoPreview();
            }

            if (micChanged) {
                engine.stopLocalAudioStream(true);
                // engine.disableAudioEngine();
                // engine.enableAudioEngine();
                engine.setAudioInputtingDevice(this.state.audioDeviceId);
                engine.stopLocalAudioStream(false);
            }

        } else if (!this.state.isStarted && this.state.isCameraOn) {
            if (videoChanged) {
                engine.setVideoEncoderConfig({playType: 1, publishMode: this.EncoderConfigMode});
                engine.setMediaMode(1);
                engine.setRoomMode(1);
                engine.setVideoCanvas(this.state.uid, document.getElementById("videoMe"), 2);
                // engine.enableVideoEngine();
                engine.startVideoDeviceCapture(this.state.videoDeviceIndex);
                engine.startVideoPreview();

                // engine.enableVideoEngine();
                engine.startVideoDeviceCapture(this.state.videoDeviceIndex);
                engine.startVideoPreview();

                if (this.state.isMicOn) {
                    // engine.enableAudioEngine();
                    engine.setAudioInputtingDevice(this.state.audioDeviceId);
                    engine.stopLocalAudioStream(false);
                } else {
                    engine.stopLocalAudioStream(true);
                    engine.disableAudioEngine();
                }
            }
        }
        this.closeUniqueDialog('dialog001');
        this.getThunderEngine().stopAudioInputDeviceTest();
    }

    refreshDevices() {
        let videoList = document.getElementById('settingVideoDevices');
        let audioList = document.getElementById('settingMicDevices');

        this.initDeviceList();
    }

    showUniqueDialog(dialogId) {
        let mask = document.getElementById('dialogMask');
        let d = document.getElementById(dialogId);
        if (!d || !mask) {
            return;
        }

        mask.style.display = '';
        d.style.display = '';
    }

    closeUniqueDialog(dialogId) {
        let mask = document.getElementById('dialogMask');
        let d = document.getElementById(dialogId);
        if (d) {
            d.style.display = 'none';
        }
        if (mask) {
            mask.style.display = 'none';
        }
    }

    applyRoomParameters() {
        //set userId as the same value with roomId
        // this.state.uid = this.state.roomId;
        zip(fromPromise(this.getToken()).pipe(flatMap(token => fromPromise(this.enterRoom(token)))))
            .subscribe((result) => {
                console.log(JSON.stringify(result));
            }, (error) => {
                console.error(error);
            }, () => {

            });
        // this.initBoardRoom(this.state.boardUuid)
        //     .then((uuid) => {
        //         console.log("Netless board UUID: " + uuid);
        //         this.state.boardUuid = uuid;
        //         return this.getToken();
        //     })
        //     .then((token) => {
        //         return this.enterRoom(token);
        //     })
        //     .catch((errMsg) => {
        //         this.state.joinStatusTip = errMsg;
        //         this.setState(this.state);
        //     })
    }

    initBoardRoom(uuid) {
        let board = this._board;
        return new Promise((resolve, reject) => {
            if (uuid) {
                this.setState({
                    joinStatusTip: this.state.lang.JoinWhiteBoard,
                    boardUuid: uuid
                });
                board.enterRoom(uuid)
                    .then((arg) => {
                        resolve(uuid);
                    })
                    .catch((result) => {
                        reject(this.state.lang.JoinWhiteBoardFail + "：" + result.message);
                    });
            } else {
                this.setState({
                    joinStatusTip: this.state.lang.CreateWhiteBoard,
                });
                board.createRoom(this.state.roomId, 0)
                    .then((arg) => {

                        this.initBoardRoom(arg.uuid)
                            .then((uuid) => {
                                resolve(uuid);
                            })
                            .catch((msg) => {
                                reject(msg);
                            })
                    })
                    .catch((result) => {
                        var resultNew = this.state.lang.CreateWhiteBoardFail + "：" + result.message;
                        reject(resultNew);
                    });
            }
        });
    }

    getToken() {
        this.state.joinStatusTip = this.state.lang.roomSettingLoadingRequestToken;
        this.state.joinBtnDisabled = true;
        this.setState(this.state);

        this.state.testUserId = String(parseInt(Math.random() * (90000000) + 10000000, 10));

        let token = new Token({
            appId: this.state.appid,
            userId: this.state.testUserId,
            roomId: this.state.roomId,

            target: this
        });
        return new Promise((resolve, reject) => {
            if (token.HttpUrl.length == 0) {
                resolve("");
                return;
            }
            token.request()
                .then((token) => {
                    resolve(token);
                })
                .catch((errMsg) => {
                    this.state.joinBtnDisabled = false;
                    let resultNew = this.state.lang.roomSettingLoadingRequestTokenFailed + ': ' + errMsg;
                    reject(resultNew);
                })
        });
    }

    enterRoom(token) {

        return new Promise(async (resolve, reject) => {
            this.state.joinStatusTip = this.state.lang.roomSettingLoadingEnterRoom;
            this.state.joinBtnDisabled = true;

            this.setState(this.state);
            let thunderEngine = this.getThunderEngine();
            thunderEngine.leaveRoom();

            console.log("this.state.uid = " + this.state.uid);
            try {
                await thunderEngine.login(this.state.uid, token);
            } catch (err) {
                reject(this.state.lang.roomSettingLoadingEnterRoomFailed);
                return;
            }

            console.log("this.state.testUserId = " + this.state.uid);
            thunderEngine.createRoom(this.state.roomId);
            let roomAttributes = await thunderEngine.getRoomAttributes(this.state.roomId);

            let r = await thunderEngine.joinRoom(token, this.state.roomId, this.state.uid);
            console.log("this.state.testUserId = " + this.state.uid);
            console.log("joinRoom result = " + r);
            if (r === 0) {
                resolve();
            } else {
                this.state.joinStatusTip = this.state.lang.roomSettingLoadingEnterRoomFailed + r;

                this.state.joinBtnDisabled = false;
                this.setState(this.state);

                reject(this.state.lang.roomSettingLoadingEnterRoomFailed + r);
            }
        });
    }

    handleExit() {
        if (this.state.isClassBegin) {
            this.showUniqueDialog('dialog003');
        } else {
            this.onLogoutConfirm();
        }

    }

    toggleMic() {
        if (!this.state.isClassBegin) {
            let error = document.getElementById("turnDeviceError");
            error.style.display = "flex";
            setTimeout(() => {
                error.style.display = "none";
            }, 2000);
            return;
        }

        // 停止音乐
        this.playMusic(false);

        // if (this.state.isPlaying) {
        //     let error = document.getElementById("turnDeviceError");
        //     let errorContent = document.getElementById("turnDeviceErrorContent");
        //     error.style.display = "flex";
        //     errorContent.innerText = this.state.lang.turnDeviceError1;
        //     setTimeout(() => {
        //         error.style.display = "none";
        //         errorContent.innerText = this.state.lang.turnDeviceError;
        //     }, 2000);
        //     return;
        // }

        let engine = this.getThunderEngine();
        let micOnState = !this.state.isMicOn;

        this.setState({
            isMicOn: micOnState
        })

        if (this.state.isStarted) {
            if (micOnState) {
                // engine.enableAudioEngine();
                engine.setAudioInputtingDevice(settingMicDevices.value);
                engine.stopLocalAudioStream(false);
                engine.enableCaptureVolumeIndication(500, 0, 0, 0);
                // let data = Object.assign({}, this.state.roomAttrs, {audio: "1"});
                let data = {
                    nick_name: "",
                    uid: this.state.uid,
                    video: this.state.isCameraOn? "1": "0",
                    audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
                    role: "Teacher",
                    public_message: this.state.classNote,
                    class_mute: this.state.isMuteAll ? '1' : '0',
                    open_hand: this.state.isHandOn? "1" : "0",
                    board_state: this.state.isBoardJoined ? '1' : '0',
                    board_uuid: this.state.boardUuid,
                    class_state: this.state.isClassBegin ? "1" : "0"
                }
                // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
                this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
            } else {
                engine.stopLocalAudioStream(true);
                let data = {
                    nick_name: "",
                    uid: this.state.uid,
                    video: this.state.isCameraOn? "1": "0",
                    audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
                    role: "Teacher",
                    public_message: this.state.classNote,
                    class_mute: this.state.isMuteAll ? '1' : '0',
                    open_hand: this.state.isHandOn? "1" : "0",
                    board_state: this.state.isBoardJoined ? '1' : '0',
                    board_uuid: this.state.boardUuid,
                    class_state: this.state.isClassBegin ? "1" : "0"
                }
                // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
                this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
            }
        }
        // this.setState(this.state);
    }

    toggleCamera() {
        if (!this.state.isClassBegin) {
            let error = document.getElementById("turnDeviceError");
            error.style.display = "flex";
            setTimeout(() => {
                error.style.display = "none";
            }, 2000);

            return;
        }

        let engine = this.getThunderEngine();
        this.state.isCameraOn = !this.state.isCameraOn;
        let canvas = document.getElementById('videoMe');

        if (this.state.isCameraOn) {
            engine.setVideoEncoderConfig({playType: 1, publishMode: this.EncoderConfigMode});
            engine.setMediaMode(1);
            engine.setRoomMode(1);
            engine.setVideoCanvas("LocalPreviewRoot", canvas, 2);
            // engine.enableVideoEngine();
            engine.startVideoDeviceCapture(this.state.videoDeviceIndex);
            engine.startVideoPreview();
            engine.stopLocalVideoStream(false);
            // engine.setUserAttributes("role", this.UserRole_Publisher);

            let data = {
                nick_name: "",
                uid: this.state.uid,
                video: this.state.isCameraOn? "1": "0",
                audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
                role: "Teacher",
                public_message: this.state.classNote,
                class_mute: this.state.isMuteAll ? '1' : '0',
                open_hand: this.state.isHandOn? "1" : "0",
                board_state: this.state.isBoardJoined ? '1' : '0',
                board_uuid: this.state.boardUuid,
                class_state: this.state.isClassBegin ? "1" : "0"
            }
            // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
            this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));

            this.setState({
                roomAttrs: data
            });
            // engine.enableVideoEngine();
            engine.startVideoDeviceCapture(this.state.videoDeviceIndex);
            engine.startVideoPreview();
        } else {
            // this.getThunderEngine().setUserAttributes("role", this.UserRole_Watcher);
            this.getThunderEngine().cancelPreviewCanvas();
            let data = {
                nick_name: "",
                uid: this.state.uid,
                video: this.state.isCameraOn? "1": "0",
                audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
                role: "Teacher",
                public_message: this.state.classNote,
                class_mute: this.state.isMuteAll ? '1' : '0',
                open_hand: this.state.isHandOn? "1" : "0",
                board_state: this.state.isBoardJoined ? '1' : '0',
                board_uuid: this.state.boardUuid,
                class_state: this.state.isClassBegin ? "1" : "0"
            }

            // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
            this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));

            this.setState({
                roomAttrs: data
            });
        }

        this.setState(this.state);
    }

    handleShowSetting() {
        this.showUniqueDialog('dialog001');

        let engine = this.getThunderEngine();
        let canvas = document.getElementById('videoMePre');

        engine.setVideoEncoderConfig({playType: 1, publishMode: this.EncoderConfigMode});
        engine.setMediaMode(1);
        engine.setRoomMode(1);
        engine.setPreviewCanvas( canvas, 2);


        // engine.enableVideoEngine();

        engine.startVideoDeviceCapture(this.state.videoDeviceIndex);
        engine.startVideoPreview();


        // engine.enableVideoEngine();
        engine.startVideoDeviceCapture(this.state.videoDeviceIndex);
        engine.startVideoPreview();

        // 增加停止本地流的操作, 防止客户端看到，本地预览
        engine.stopLocalAudioStream(true);
        engine.stopLocalVideoStream(true);

        engine.startAudioInputDeviceTest(0);
    }

    handleClassBegin() {
        fromPromise(this.initBoardRoom(this.state.boardUuid))
            .pipe(flatMap(uuid => fromPromise(this._board.enterRoom(uuid))),
                flatMap(result => Observable.create(observer => {
                    this.handleJoinBoardRoom(result.uuid, result.roomToken);
                    observer.next();
                }))).subscribe((result) => {

        },(error) => {
            this.showMessageBox(this.state.lang.JoinWhiteBoardFailContent);
        }, () => {

        });

        this.state.isCameraOn = false;
        this.state.isMicOn = false;
        this.state.isStarted = true;
        this.state.startBtnDisabled = true;
        this.state.stopBtnDisabled = false;

        this.state.isClassBegin = true;
        this.state.classBeginSeconds = 0;
        this.state.classBeginText = '00:00';
        setTimeout(this.classTimer01.bind(this), 1000);
        this.setState(this.state);
        // this.sendRoomStateToAll();

        let data = {
            nick_name: "",
            uid: this.state.uid,
            video: this.state.isCameraOn? "1": "0",
            audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: this.state.isHandOn? "1" : "0",
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }
        // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
        this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
    }

    classTimer01() {
        this.state.classBeginSeconds++;

        let s = 0;
        let m = 0;

        if (this.state.classBeginSeconds < 60) {
            s = this.state.classBeginSeconds;
        } else {
            s = this.state.classBeginSeconds % 60;
            m = (this.state.classBeginSeconds - s) / 60;
        }

        this.state.classBeginText = (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s);
        this.setState(this.state);

        if (this.state.isClassBegin) {
            if (s % 5 == 0) {
                this._log.debug('this class state isClassBegin: $0,isClassBegin: $1, isClassBegin: $2', this.state.isClassBegin, this.state.isBoardJoined, this.state.joinedRoom);
            }

            if (!this.state.isBoardJoined) {
                this.setState({isBoardJoined: true})
            }

            if (!this.state.joinedRoom) {
                this.setState({joinedRoom: true})
            }

            setTimeout(this.classTimer01.bind(this), 1000);
        }
    }

    onCourseWareItemClick(room, url, index) {
        console.log("item Clicked " + url);
        if (room) {
            // 切换到PPT页面
            var strs = url.split('/');
            var sceneName = strs[strs.length - 1];
            room.setScenePath(`/PPT/${sceneName}`);
        }
    }

    handleClassOver() {

        this.getThunderEngine().stopLocalVideoStream(true);
        if (!this.state.isPlaying) {
            this.getThunderEngine().stopLocalAudioStream(true);
        }
        this.getThunderEngine().stopVideoDeviceCapture();

        // this.getThunderEngine().setUserAttributes("role", this.UserRole_Watcher);
        this.getThunderEngine().cancelVideoCanvas(this.state.uid);

        this.cancelCanvas(this.state.uid);

        if (this.state.talkingUserId && this.state.talkingUserId != 0) {
            this.playUserVideo(this.state.talkingUserId, true);
            this.getThunderEngine().deleteRoomAttributesByKeys([this.state.talkingUserId])
                .catch(error => {

                })
        }

        if (this.state.connectingUserId && this.state.connectingUserId != 0) {
            this.playUserVideo(this.state.connectingUserId, true);
            this.getThunderEngine().deleteRoomAttributesByKeys([this.state.connectingUserId])
                .catch(error => {

                });
        }

        this.getThunderEngine().getRoomAttributes(this.state.roomId).then( async(result) => {
            let keys = Object.keys(result.attributes);
            keys = keys.filter(key => key != "Teacher");
            try {
                await this.getThunderEngine().deleteRoomAttributesByKeys(keys);
            } catch (err) {

            }
        }).catch(error => {

        });

        this.setState({
            handingUserIds: [],
            users: [],
            userMessages: [],
            isStarted: false,
            isClassBegin: false,
            classBeginSeconds: 0,
            classBeginText: '00:00',
            isCameraOn: false,
            isMicOn: false,
            isHandOn: false,
            connectingUserId: 0,
            talkingUserId: 0
        });

        this.getThunderEngine().getUserList().then(result => {
            console.log('onJoinRoomSuccess getUserList: userList =' + JSON.stringify(result));
        });
        // this.sendRoomStateToAll();
        let data = {
            nick_name: "",
            uid: this.state.uid,
            video: this.state.isCameraOn? "1": "0",
            audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: this.state.isHandOn? "1" : "0",
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }
        // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
        this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
    }

    handleJoinBoardRoom(uuid, token) {
        let params = {
            uuid: uuid,
            roomToken: token,
            cursorAdapter: new UserCursor(),
        };

        const images = [{
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_01.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_01_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_02.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_02_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_03.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_03_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_04.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_04_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_05.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_05_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_06.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_06_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_07.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_07_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_08.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_08_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_09.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_09_thumb.png"
        }, {
            url: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_10.png",
            thumbUrl: "https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/Test/ppt_v1_10_thumb.png"
        }
        ]

        if (this.state.images.length == 0) {
            this.setState({
                images: this.state.images.concat(images)
            })
        }

        this.setState({isBoardJoined: false});
        // 初始化白板SDK
        // 进入白板房间
        let promise = this._sdk.joinRoom(params, {
            // 状态变化回调时，modifyRoomState 只会包含发生了改变的 roomState 字段。
            // 对应字段里的内容，都会完整传递
            onRoomStateChanged: modifyState => {
                if (modifyState.roomMembers) {
                    this.state.cursorAdapter.setColorAndAppliance(modifyState.roomMembers);

                } else if (modifyState.sceneState) {

                }

                if (modifyState.zoomScale) {
                    this.setState({
                        zoomNumber: modifyState.zoomScale
                    });
                }
                this.setState({
                    roomState: modifyState
                });
            }
        });

        let me = this;

        promise.then((room) => {
            this.setState({room: room});
            me.setState({isBoardJoined: true});
            me.state.joinedBoardRooms.splice(0);
            me.state.joinedBoardRooms.push(room);

            if (this.state.scenes && this.state.scenes.length == 0) {
                let scenes = [];
                images.forEach((image, index) => {
                    //创建一个白板页面
                    var strs = image.url.split('/');
                    var sceneName = strs[strs.length - 1];
                    const scene = {name: `${sceneName}`, ppt: {src: image.url, width: 1080, height: 720}};
                    scenes.push(scene);
                });

                this.setState({
                    scenes: this.state.scenes.concat(scenes)
                })

                room.putScenes(`/PPT`, this.state.scenes, 0);
            }

            room.setScenePath(`/PPT/${this.state.scenes[0].name}`);

            // 设置默认为画笔
            room.setMemberState({
                currentApplianceName: "pencil",
            });
            // 4、room 对象实例化后，第一时间传入 roomMembers
            this.state.cursorAdapter.setColorAndAppliance(room.state.roomMembers);
            // 设置默认颜色
            room.setMemberState({
                strokeColor: [255, 120, 0],
            });

            // 设置为主播模式
            room.setViewMode(ViewMode.Broadcaster);

            me.state.BoardToken = token;

            me.setState(me.state);

            // 防止退出后再次进入无法操作的问题，去掉会出问题
            room.refreshViewSize();
            this.setState({roomState: room.state})
        });
        promise.catch(function (error) {
            me.setState({isBoardJoined: false});
            me.showMessageBox("Failed to join board room: " + error.message);
        });
    }

    handleEnterRoom(arg) {
        this.state.appid = arg.appId;
        this.state.roomId = arg.roomId;
        this.state.userName = arg.userName;
        this.state.boardUuid = arg.boardUuid;

        this.state.lang = arg.language;

        this.setState(this.state);

        this.applyRoomParameters();
    }

    handleFeedback() {
        this.showUniqueDialog('dialog002');
    }

    handleShare() {
        this.handleClassOver();
        this.showUniqueDialog('dialog004');
    }

    toggleHand() {
        if (this.state.talkingUserId || this.state.connectingUserId) {
            return;
        }

        // this.state.isHandOn = !this.state.isHandOn;
        let isHandOn = this.state.isHandOn;

        if (isHandOn) {
            this.showWhiteBoardToolsMsg(this.state.lang.HandDisable);
        } else {
            this.showWhiteBoardToolsMsg(this.state.lang.HandEnable);
        }

        this.setState({
            isHandOn: !isHandOn,
            handingUserIds: [],
            talkingUserId: 0
        });

        // this.sendRoomCommand('open_hand', this.state.isHandOn ? '1' : '0');

        let data = {
            nick_name: `${this.state.uid}`,
            uid: this.state.uid,
            video: this.state.isCameraOn? "1": "0",
            audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: (!isHandOn) ? "1" : "0",
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }

        // this.getThunderEngine().addOrUpdateLocalUserAttributes("Teacher", JSON.stringify(data));
        this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
    }

    toggleMuteAll() {
        let mute = !this.state.isMuteAll;
        this.setState({
            isMuteAll: mute,
        });
        if (!mute) {
            this.showStudentMsg(this.state.lang.MuteDisable);
        } else {
            this.showStudentMsg(this.state.lang.MuteEnable);
        }
        this.state.muteUsers.splice(0);
        for (let i = 0; i < this.state.users.length; i++) {
            if (mute) {
                this.state.muteUsers.push(this.state.users[i].uid);
            }

            this.showUserMuteStatus(this.state.users[i].uid);
        }

        // this.sendRoomCommand('class_mute', this.state.isMuteAll ? '1' : '0');
        let data = {
            nick_name: `${this.state.uid}`,
            uid: this.state.uid,
            video: this.state.isCameraOn? "1": "0",
            audio: (this.state.isMicOn || this.state.isPlaying) ? "1" : "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: mute ? '1' : '0',
            open_hand: this.state.isHandOn? "1": "0",
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }
        this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));
        // this.setState(this.state);
    }

    toggleMute(userId) {
        if (!this.getUser(userId)) {
            console.error("Invalid user id to mute, userId: " + userId);
            return;
        }

        if (this.isMute(userId)) {
            this.remove(userId, this.state.muteUsers);
            this.sendUserCommand(userId, 'mute', 0);
        } else {
            this.state.muteUsers.push(userId);
            this.sendUserCommand(userId, 'mute', 1);
        }

        this.showUserMuteStatus(userId);
        this.setState(this.state);
    }

    showUserMuteStatus(userId) {
        let m0 = document.getElementById('mute0_' + userId);
        if (m0) {
            m0.style.display = this.state.isMuteAll ? 'none' : '';
        }
        m0 = document.getElementById('mute1_' + userId);
        if (m0) {
            m0.style.display = this.state.isMuteAll ? '' : 'none';
        }
    }

    handleSendClassNote() {
        let input = document.getElementById("txtMsgContent");
        if (!input) {
            return;
        }

        let note = input.value;
        if (!note) {
            this.showMessageBox(this.state.lang.MessageEmpty);
            return;
        }
        this.state.classNote = note;
        this.sendClassNote();
        this.setState(this.state);
    }

    handleSendRoomMessage() {
        let input = document.getElementById("txtMsgContent");
        if (!input) {
            return;
        }

        let msg = input.value;
        if (!msg) {
            this.showMessageBox(this.state.lang.MessageEmpty);
            return;
        }

        this.sendChatMessageToRoom(msg);
    }

    zoomChange = (scale) => {
        if (this.state.room) {
            this.state.room.zoomChange(scale);
            this.setState({zoomNumber: scale});
        }
    };

    setMemberState = (applianceName) => {
        this.setState({currentApplianceName: applianceName});
        if (this.state.room != null) {
            // console.log(applianceName);
            this.state.room.setMemberState({currentApplianceName: applianceName});
        }
    };

    showStudentMsg(studentMsg) {
        let d = document.getElementById("StudentMsg");
        let message = document.getElementById("StudentMsgContnt");
        if (d && message) {
            d.style.display = "flex";
            message.innerHTML = studentMsg;
        }
        setTimeout(() => {
            if (d) {
                d.style.display = "none";
            }
        }, 3000);
    }

    showWhiteBoardToolsMsg(WhiteBoardToolsMsg) {
        let d = document.getElementById("WhiteBoardToolsMsg");
        let message = document.getElementById("WhiteBoardToolsMsgContnt");
        if (d && message) {
            d.style.display = "flex";
            message.innerHTML = WhiteBoardToolsMsg;
        }
        setTimeout(() => {
            if (d) {
                d.style.display = "none";
            }
        }, 3000);
    }

    onShareConfirm() {
        let d = document.getElementById("copySucess");
        if (d) {
            d.style.display = "flex"
        }
        setTimeout(() => {
            if (d) {
                d.style.display = "none";
                this.closeUniqueDialog('dialog004');
                clipboard.writeText(this.state.classVideoAddress, "clipboard");
            }
        }, 3000);

    }

    onShareCancel() {
        this.closeUniqueDialog('dialog004');
    }

    onFeedBackConfirm() {
        let feedbckContent = document.getElementById("feedbckContent");
        let feedbckPhone = document.getElementById("feedbckPhone");

        // 去掉空格
        let feedbckContentStr = feedbckContent.value.replace(/\ +/g, "");
        // 去掉回车换行
        feedbckContentStr = feedbckContentStr.replace(/[\r\n]/g, "");
        if (feedbckContentStr.length == 0) {
            this.showMessageBox(this.state.lang.DiscussPlaceHolder);
            return;
        }
        let newZipFile = this._log.logFileNameFull + ".zip";
        compressing.zip.compressFile(this._log.logFileNameFull, newZipFile).then(
            compressDone => {
                this._api.postLog(newZipFile, this.state.uid, feedbckPhone.value, feedbckContent.value).then(response => {
                    fs.unlink(this._log.logFileNameFull, result => {
                        this.closeUniqueDialog('dialog002');
                        feedbckPhone.value = "";
                        feedbckContent.value = "";
                    });
                    fs.unlink(newZipFile, result => {

                    });
                }).catch((e) => {
                    this.closeUniqueDialog('dialog002');
                });
            }
        );

    }

    onFeedBackCancel() {
        this.closeUniqueDialog('dialog002');
    }

    onLogoutCancel() {
        this.closeUniqueDialog('dialog003');
    }

    onLogoutClick() {
        this.closeUniqueDialog('dialog003');
        this.onLogoutConfirm();
    }

    onLogoutConfirm() {
        if (this.state.isStarted) {
            this.getThunderEngine().stopLocalVideoStream(true);
            this.getThunderEngine().stopLocalAudioStream(true);
            this.getThunderEngine().stopVideoDeviceCapture();
            this.getThunderEngine().cancelVideoCanvas(this.state.uid);
            // this.getThunderEngine().setUserAttributes("role", this.UserRole_Watcher);

        }

        if (this.state.talkingUserId) {
            this.getThunderEngine().stopRemoteAudioStream(this.state.talkingUserId, true);
            this.getThunderEngine().stopRemoteVideoStream(this.state.talkingUserId, true);
            this.getThunderEngine().cancelVideoCanvas(this.state.talkingUserId);
            let canvas = this.getCanvas(this.state.talkingUserId);
            if (canvas) {
                canvas.style.display = "none";
            }
            this.cancelCanvas(this.state.talkingUserId);
        }
        let thunder = this.getThunderEngine();

        if (this.state.isPlaying) {
            // 停止音乐
            this.playMusic(false);
        }

        thunder.deleteRoomAttributesByKeys(["Teacher"]);
        // 退出房间
        thunder.leaveRoom();

        // this.state.waitingSeconds = 0;
        // this.state.handingUserIds = [];
        // this.state.connectingUserId = 0;
        // this.state.talkingUserId = 0;
        //
        // this.state.joinedRoom = false;
        // this.state.users = [];
        // this.state.userMessages = [];
        // this.state.inited = false;
        // this.state.isHummerInited = false;
        //
        // this.state.isMicOn = false;
        // this.state.isCameraOn = false;
        // this.state.isStarted = false;
        //
        // this.state.isClassBegin = false;
        // this.state.classBeginSeconds = 0;
        // this.state.classBeginText = '00:00';
        // this.state.videoDeviceIndex = 0;
        // this.state.audioDeviceId = "";
        //
        // this.state.joinStatusTip = '';
        //
        // this.state.joinBtnDisabled = false;
        // this.state.startBtnDisabled = true;
        // this.state.stopBtnDisabled = true;
        // this.state.isHandOn = false;
        // this.state.PPTMode = true;

        this.setState({
            waitingSeconds: 0,
            handingUserIds: [],
            connectingUserId: 0,
            talkingUserId: 0,

            joinedRoom: false,
            users: [],
            userMessages: [],
            inited: false,
            isHummerInited: false,

            isMicOn: false,
            isCameraOn: false,
            isStarted: false,

            isClassBegin: false,
            classBeginSeconds: 0,
            classBeginText: '00:00',
            videoDeviceIndex: 0,
            audioDeviceId: "",

            joinStatusTip: '',

            joinBtnDisabled: false,
            startBtnDisabled: true,
            stopBtnDisabled: true,
            isHandOn: false,
            PPTMode: true,
            scenes: [],
            imsage: []
        });

        let mask = document.getElementById('enterMask');
        let d = document.getElementById('dialogRoomParameters');
        if (d) {
            d.style.display = '';
        }
        if (mask) {
            mask.style.display = '';
        }

        // 退出白板房间
        if (this.state.boardUuid) {
            this._board.closeRoom(this.state.boardUuid)
                .then((arg) => {
                }).catch((result) => {
            });
        }
    }

    onLanguageChanged(e) {
        this.state.lang = new LocaleFactory().load(e.value);
        this.state.classVideoAddress = this.state.lang.ComingSoon;
        this.state.classNote = this.state.lang.Welcome;
        this.setState({
            lang: new LocaleFactory().load(e.value),
            classVideoAddress: this.state.lang.ComingSoon
        });
    }

    playMusic(isPlaying) {
        if (isPlaying) {
            if ((this.state.talkingUserId > 0 || this.state.connectingUserId > 0)) {
                this.showStudentMsg(this.state.lang.turnDeviceError2);
                return;
            }
        }

        if (isPlaying) {
            this.getThunderEngine().setAudioSourceType(2);
            this.getThunderEngine().openAudioFile("https://jszc-bj.oss-cn-beijing.aliyuncs.com/Resource/ClassRoom/1931.mp3");
            this.getThunderEngine().setAudioFileLooping(-1);
            this.getThunderEngine().startAudioFilePlay();
            this.getThunderEngine().stopLocalAudioStream(false);

        } else {
            this.getThunderEngine().stopAudioFilePlay();
            this.getThunderEngine().stopLocalAudioStream(true);
        }

        this.setState({
            isPlaying: isPlaying,
            isMicOn: false
        });

        let data = {
            nick_name: "",
            uid: this.state.uid,
            video: this.state.isCameraOn? "1": "0",
            audio: isPlaying ? "1": "0",
            role: "Teacher",
            public_message: this.state.classNote,
            class_mute: this.state.isMuteAll ? '1' : '0',
            open_hand: this.state.isHandOn? "1" : "0",
            board_state: this.state.isBoardJoined ? '1' : '0',
            board_uuid: this.state.boardUuid,
            class_state: this.state.isClassBegin ? "1" : "0"
        }

        this.getThunderEngine().addOrUpdateRoomAttributes("Teacher", JSON.stringify(data));

    }

    togglePPT() {
        let mode = !this.state.PPTMode;
        this.setState({
            PPTMode: mode
        });
        if (this.state.room) {
            if (mode) {
                this.showWhiteBoardToolsMsg(this.state.lang.TogglePPT);
                this.state.room.setScenePath(`/PPT/${this.state.scenes[0].name}`)
            } else {
                this.showWhiteBoardToolsMsg(this.state.lang.ToggleWhiteBoard);
                this.state.room.setScenePath("/init");
            }
        }
    }

    getUserNickNameByUid(uid) {
        let result = '';
        this.state.users.forEach(user => {
            if (uid === user.uid) {
                result = user.nickName;
            }
        })

        return result;
    }

    toggleShare() {
        this.reSetState();
    }

    render() {
        const voiceArray =  Array(24).fill(null);
        const voices = voiceArray.map((number, index) => {
            return index <= (this.state.testInputVolume / 100 * 24 - 1) ? <div style={{
                width: '4px',
                height: '20px',
                background: 'rgba(127,200,187,1)',
                borderRadius: '2px'
            }}></div> : <div style={{
                width: '4px',
                height: '20px',
                background: 'rgba(238,238,238,1)',
                borderRadius: '2px'
            }}></div>
        }, this);

        return (
            // <IntlProvider locale='en' messages='enUS'>
            // </IntlProvider>
            <div style={{height: '80%'}}>
                <div className="appTitle" style={{
                    paddingLeft: "15px"
                }}>

                    <LogoImage height='24px' src="images/logo/logo.png"/>

                    <p id='appTitleClassName'>{this.state.lang.mainRoomName}{this.state.roomId}</p>
                    <div className='tile'></div>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                    }}>
                        <div id='titleClassTime' style={{
                            display: this.state.isClassBegin ? '' : 'none'
                        }}>
                            <img alt='' src={renderUtils.getImage("/images/main/title/recording.png")}/>
                            <p>{this.state.lang.mainClassTime}{this.state.classBeginText}</p>
                        </div>

                        <div className="buttonSettingCommon"
                             onClick={this.handleShare.bind(this)} disabled={this.state.stopBtnDisabled}
                             style={{
                                 width: '55px',
                                 display: this.state.isClassBegin ? '' : 'none'
                             }}>
                            <p id='stopBtn'
                               style={{
                                   margin: '0 0 0 0',
                                   display: this.state.isClassBegin ? '' : 'none'
                               }}
                            >{this.state.lang.mainClassOver}</p>
                        </div>

                        <a onClick={this.handleClassBegin.bind(this)}
                           className="buttonCommon"
                           style={{
                               display: this.state.isClassBegin ? "none" : "",
                               margin: '0 0 0 0',
                               width: '146px',
                           }}
                        >{this.state.lang.mainClassBegin}</a>
                    </div>
                    <div className="buttonSettingCommon"
                         style={{
                             width: 'fit-content'
                         }}
                         onClick={this.handleFeedback.bind(this)}>
                        <p style={{
                            width: 'fit-content',
                            margin: '0 11px 0 11px'
                        }}>{this.state.lang.Feedback}</p>
                    </div>
                    <div className="buttonSettingCommon"
                         style={{
                             display: this.state.isClassBegin ? 'none' : '',
                             width: 'fit-content',

                         }}
                         onClick={this.handleShowSetting.bind(this)}>
                        <p style={{
                            width: 'fit-content',
                            margin: '0 11px 0 11px'
                        }}>{this.state.lang.mainSetting}</p>
                    </div>
                    <div className="buttonSettingCommon"
                         style={{
                             width: 'fit-content',
                             margin: '0 11px 0 11px'
                         }}
                         onClick={this.handleExit.bind(this)}>
                        <p style={{
                            width: 'fit-content',
                            margin: '0 11px 0 11px'
                        }}>{this.state.lang.mainExit}</p>
                    </div>
                    <div id='titleNetworkQuality'
                         style={{
                             width: '41px',
                             height: '27px',
                             margin: '0 23px 0 17px'
                         }}>
                        <NetworkStatusButton isUser={false} ImageIndex={this.state.networkQuality}/>
                    </div>
                </div>
                <div className="tile"
                     style={{
                         height: window.innerHeight - 60,
                     }}>
                    <div className="tile" style={{
                        display: 'flex',
                        overflow: 'hidden',
                        flexDirection: 'row'

                    }}>
                        <div className="tile" style={{
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <WhiteBoardTools
                                isHandOn={this.state.isHandOn}
                                talkingUserId={this.state.talkingUserId}
                                connectingUserId={this.state.connectingUserId}
                                isClassBegin={this.state.isClassBegin}
                                roomState={this.state.roomState}
                                toggleHand={this.toggleHand.bind(this)}
                                zoomNumber={this.state.zoomNumber}
                                zoomChange={this.zoomChange}
                                setMemberState={this.setMemberState}
                                currentApplianceName={this.state.currentApplianceName}
                                room={this.state.room}
                                _sdk={this._sdk}
                                PPTMode={this.state.PPTMode}
                                togglePPT={this.togglePPT.bind(this)}
                                roomMembers={this.state.roomMembers}
                                isBoardJoined={this.state.isBoardJoined}
                                joinedRoom={this.state.joinedRoom}
                                isClassBegin={this.state.isClassBegin}
                                toggleShare={this.toggleShare.bind(this)}
                                joinedBoardRooms={this.state.joinedBoardRooms}/>

                            <div id="videoStudent"
                                 style={{
                                     position: 'absolute',
                                     right: '0',
                                     top: '0',
                                     width: "307px",
                                     height: "161px",
                                     zIndex: '50',
                                     display: this.state.talkingUserId ? "" : "none"
                                 }}>
                                <div style={{
                                    display: 'flex',
                                    width: "100%",
                                    zIndex: 50,
                                    height: 'fit-content',
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 100%)',
                                    borderRadius: '1px'
                                }}>
                                    <div style={{
                                        flex: "1",
                                        height: '37px',
                                        display: 'flex',
                                        width: "100%",
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <p style={{
                                            marginLeft: '9px',
                                            fontSize: '16px',
                                            fontFamily: 'PingFangSC-Regular,PingFang SC',
                                            fontWeight: '400',
                                            color: 'rgba(255,255,255,1)',
                                            lineHeight: '22px'
                                        }}>{this.getUserNickNameByUid(this.state.talkingUserId)}</p>

                                        <img className="imageCommon"
                                             style={{
                                                 display: 'inline-block',
                                                 width: '29px',
                                                 height: "29px",
                                                 margin: '4px 6px 4px 6px'
                                             }}
                                             src={renderUtils.getImage("/images/voice/voice_user_0.png")}
                                             ref={this.studentVomumeRef}
                                        />
                                    </div>
                                </div>
                                <div id="videoStudentTime"
                                     style={{
                                         width: '100%',
                                         position: 'absolute',
                                         height: "161px",
                                         lineHeight: "161px",
                                         textAlign: "center",
                                         verticalAlign: "middle",
                                         fontSize: "40px",
                                         background: 'rgba(35,35,35,1)',
                                         display: "none",
                                         zIndex: '51'
                                     }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'rgba(0,0,0,1)',
                                        opacity: '0.7',
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        right: '0',
                                        bottom: '0',
                                        margin: 'auto'
                                    }}>
                                        <p style={{
                                            fontSize: '30px',
                                            fontFamily: 'PingFangSC-Medium,PingFang SC',
                                            fontWeight: '500',
                                            color: 'rgba(255,255,255,1)',
                                            lineHeight: '80px',
                                            left: '50%',
                                            top: '50%'
                                        }}>
                                            {this.state.waitingSeconds}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="tile is-vertical" style={{
                            maxWidth: "307px",
                            display: 'flex',
                            flexShrink: '0',
                            borderColor: '#E0E0E0',
                            borderStyle: 'none none none solid',
                            borderWidth: '1px',
                            height: '100%'
                        }}>
                            <div id="videoMe" style={{
                                height: "161px",
                                backgroundImage: "url('" + renderUtils.getImage("images/video/me.png") + "')",
                                backgroundRepeat: 'no-repeat',
                                background: "#000000",
                                backgroundSize: 'contain',
                                position: "relative",
                                backgroundPosition: 'center'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    display: this.state.isCameraOn ? "none" : 'flex',
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: '31',
                                    height: '100%',
                                    width: '100%',
                                    background: 'rgba(235,235,235,1)'
                                }}>
                                    <img src={renderUtils.getImage("/images/video/video_logo.png")}
                                         style={{
                                             width: '41px',
                                             height: '30px'
                                         }}/>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    width: "100%",
                                    zIndex: 50,
                                    height: 'fit-content',
                                    position: 'absolute',
                                    right: 0,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.4) 100%)',
                                    borderRadius: '1px'
                                }}>
                                    <div style={{
                                        flex: "1",
                                        width: "100%"
                                    }}>
                                        <p style={{
                                            marginLeft: '9px',
                                            fontSize: '16px',
                                            fontFamily: 'PingFangSC-Regular,PingFang SC',
                                            fontWeight: '400',
                                            color: 'rgba(255,255,255,1)',
                                            lineHeight: '22px'
                                        }}>{this.state.userName}</p>
                                    </div>
                                    <img className="imageCommon"
                                         style={{
                                             display: this.state.isMicOn ? 'inline-block' : 'none',
                                             width: '29px',
                                             height: "29px",
                                             margin: '4px 6px 4px 6px'
                                         }}
                                         src={renderUtils.getImage("/images/voice/voice_user_0.png")}
                                         ref={this.teacherVomumeRef}
                                        ></img>
                                    <img className="imageCommon"

                                         onClick={this.toggleMic.bind(this)}
                                         disabled={this.state.isClassBegin === false}
                                         id='startBtn'
                                         src={renderUtils.getImage(this.state.isMicOn ? "/images/video/audio_on.png" : "/images/video/audio_off.png")}
                                         style={{
                                             display: 'inline-block',
                                             width: '29px',
                                             height: "29px",
                                             margin: '4px 6px 4px 6px'
                                         }}></img>

                                    <img className="imageCommon"
                                         onClick={this.toggleCamera.bind(this)}
                                         disabled={this.state.isClassBegin === false}
                                         id='stopBtn'
                                         src={renderUtils.getImage(this.state.isCameraOn ? "/images/video/camera_on.png" : "/images/video/camera_off.png")}
                                         style={{
                                             display: 'inline-block',
                                             width: '29px',
                                             height: "29px",
                                             margin: '4px 6px 4px 0'
                                         }}></img>
                                </div>
                                <div
                                    id="turnDeviceError"
                                    style={{
                                        position: "absolute",
                                        display: "none",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        top: '0',
                                        left: '0',
                                        right: '0',
                                        bottom: '0',
                                        zIndex: '201',
                                        margin: "auto",
                                        width: 'fit-content',
                                        height: '48px',
                                        background: 'rgba(0,0,0,1)',
                                        borderRadius: '6px',
                                        opacity: '0.7'
                                    }}>
                                    <p
                                        id="turnDeviceErrorContent"
                                        style={{
                                        margin: '0 44px 0 44px',
                                        height: '22px',
                                        fontSize: '16px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        fontWeight: '400',
                                        color: 'rgba(255,255,255,1)',
                                        lineHeight: '22px'
                                    }}>{this.state.lang.turnDeviceError}</p>
                                </div>
                            </div>

                            <UserChatCourse
                                onCourseWareItemClick={this.onCourseWareItemClick}
                                language={this.state.lang}
                                isMuteAll={this.state.isMuteAll}
                                toggleMuteAll={this.toggleMuteAll.bind(this)}
                                ClassNote={this.state.classNote}
                                ChatMessages={this.state.userMessages}
                                MessageSendHandler={this.sendChatMessageToRoom.bind(this)}
                                roomState={this.state.roomState}
                                room={this.state.room}
                                Students={this.state.users}
                                images={this.state.images}
                                IsStudentMuteAll={this.state.isMuteAll}
                                playMusic={this.playMusic.bind(this)}
                                isPlaying={this.state.isPlaying}
                                MuteCheckHandler={this.isMute.bind(this)}
                                MuteToggleHandler={this.toggleMute.bind(this)}
                                HandingCheckHandler={this.isHanding.bind(this)}
                                TalkingCheckHandler={this.isTalking.bind(this)}
                                AgreeTalkHandler={this.agreeUserTalk.bind(this)}
                                RejectTalkHandler={this.rejectUserTalk.bind(this)}
                            />
                        </div>
                    </div>
                </div>

                <div id='dialogMask' className="dialog-mask" style={{display: 'none', zIndex: '99'}}>
                    <div id='dialog001' className='dialog-content'
                         style={{display: 'none', zIndex: '200', border: 'solid lightgray 1px'}}>
                        <div className="dialog-setting">
                            <div className="content">
                                <p style={{
                                    display: 'none',
                                    textAlign: 'center',
                                    height: '45px',
                                    lineHeight: '35px',
                                    margin: '0px'
                                }}>{this.state.lang.mainSetting}</p>

                                <div id="videoMePre" style={{
                                    width: '100%',
                                    height: '214px',
                                    backgroundImage: "url('" + renderUtils.getImage("images/video/me.png") + "')",
                                    backgroundRepeat: 'no-repeat',
                                    background: "#000000",
                                    backgroundSize: 'contain',
                                    position: "relative",
                                    backgroundPosition: 'center'
                                }}>
                                </div>
                                <div style={{marginTop: '20px'}}>
                                    <p style={{
                                        margin: '0 0px 10px 30px',
                                        height: '16px',
                                        fontSize: '14px',
                                        fontFamily: 'PingFangSC-Medium,PingFang SC',
                                        fontWeight: '500',
                                        color: 'rgba(51,51,51,1)',
                                        lineHeight: '16px'
                                    }}>{this.state.lang.settingDeviceMic}</p>
                                    <div>
                                        <select id="audioSelect" onChange={this.onAudioChanged.bind(this)}
                                                className="selectCommon selectRoomSetting" id="settingMicDevices"
                                                defaultValue={-1}
                                                style={{
                                                    marginLeft: '30px',
                                                    marginRight: '30px',
                                                    width: "300px",
                                                    height: '40px'
                                                }}/>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",

                                            margin: '10px 30px 0 30px',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: '300px',
                                            height: 'fit-content'
                                        }}>

                                        <img style={{
                                            width: '29px',
                                            height: '29px'
                                        }} src={renderUtils.getImage('/images/video/voice_test.png')}/>

                                        <div style={{
                                            width: "auto",
                                            display: "flex",
                                            flex: 1,
                                            height: "fit-content",
                                            justifyContent: 'space-between'
                                        }}>
                                            {voices}
                                        </div>

                                    </div>
                                    <p style={{
                                        margin: '25px 0 10px 30px',
                                        height: '16px',
                                        fontSize: '14px',
                                        fontFamily: 'PingFangSC-Medium,PingFang SC',
                                        fontWeight: '500',
                                        color: 'rgba(51,51,51,1)',
                                        lineHeight: '16px'
                                    }}>{this.state.lang.settingDeviceCamera}</p>
                                    <div>
                                        <select id="videoSelect" onChange={this.onVideoChanged.bind(this)}
                                                className="selectCommon selectRoomSetting" id="settingVideoDevices"
                                                defaultValue={-1}
                                                style={{marginLeft: '30px', width: "300px", height: '40px'}}/>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    margin: '20px 50px 0px 50px',
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <a className="dialog-cancel" style={{}}
                                       onClick={this.refreshDevices.bind(this)}
                                    >{this.state.lang.settingDeviceRefresh}</a>
                                    <div style={{width: '100px'}}></div>
                                    <a className="dialog-confirm" style={{}}
                                       onClick={this.applyDeviceSettings.bind(this)}
                                    >{this.state.lang.settingDeviceOK}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id='dialog002' className='dialog-content'
                         style={{display: 'none', zIndex: '200', border: 'solid lightgray 1px'}}>
                        <div className="dialog-setting" style={{
                            height: 'fit-content'
                        }}>
                            <div className="content">
                                <p style={{
                                    marginTop: '30px',
                                    textAlign: 'center',
                                    height: '24px',
                                    fontSize: '20px',
                                    fontFamily: 'PingFangSC-Semibold,PingFang SC',
                                    fontWeight: '600',
                                    color: 'rgba(51,51,51,1)',
                                    lineHeight: '24px'
                                }}>{this.state.lang.Feedback}</p>

                                <p style={{
                                    margin: '0 0 0 30px',
                                    height: '16px',
                                    fontSize: '14px',
                                    fontFamily: 'PingFangSC-Medium,PingFang SC',
                                    fontWeight: '500',
                                    color: 'rgba(51,51,51,1)',
                                    lineHeight: '16px'
                                }}
                                >{this.state.lang.CurrentVersion + AppConstant.AppVersion}</p>

                                <div style={{marginTop: '26px'}}>
                                    <p style={{
                                        margin: '0 0px 10px 30px',
                                        height: '16px',
                                        fontSize: '14px',
                                        fontFamily: 'PingFangSC-Medium,PingFang SC',
                                        fontWeight: '500',
                                        color: 'rgba(51,51,51,1)',
                                        lineHeight: '16px'
                                    }}>{this.state.lang.FeedbackEmail}</p>
                                    <input
                                        id="feedbckPhone"
                                        placeholder={this.state.lang.FeedbackEmailPlaceholder}
                                        className="input inputRoomSetting inputDebug" type="text"
                                        style={{
                                            width: '300px',
                                            height: '40px',
                                            borderRadius: '4px',
                                            border: '1px solid rgba(230,230,230,1)',
                                            marginLeft: '30px',
                                            color: 'rgba(51,51,51,1)',
                                        }}/>

                                    <p style={{
                                        margin: '25px 0 10px 30px',
                                        height: '16px',
                                        fontSize: '14px',
                                        fontFamily: 'PingFangSC-Medium,PingFang SC',
                                        fontWeight: '500',
                                        color: 'rgba(51,51,51,1)',
                                        lineHeight: '16px'
                                    }}>{this.state.lang.FeedbackDescription}</p>

                                    <textarea id="feedbckContent" className="input inputRoomSetting inputDebug"
                                              placeholder={this.state.lang.FeecbackContent} style={{
                                        width: '300px',
                                        height: '95px',
                                        resize: 'none',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(230,230,230,1)',
                                        marginLeft: '30px',
                                        fontSize: '15px',
                                        fontFamily: 'PingFangSC-Regular,PingFang SC',
                                        fontWeight: '400',
                                        color: 'rgba(51,51,51,1)',
                                    }}/>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    margin: '25px 50px 46px 50px',
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <a className="dialog-cancel" style={{}}
                                       onClick={this.onFeedBackCancel.bind(this)}
                                    >{this.state.lang.Cancel}</a>
                                    <div style={{width: '100px'}}></div>
                                    <a className="dialog-confirm" style={{}}
                                       onClick={this.onFeedBackConfirm.bind(this)}
                                    >{this.state.lang.Submit}</a>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div id='dialog003' className='dialog-content'
                         style={{display: 'none', zIndex: '200', border: 'solid lightgray 1px'}}>
                        <div className="dialog-setting" style={{
                            height: '214px'
                        }}>
                            <div className="content">
                                <p style={{
                                    marginTop: '30px',
                                    textAlign: 'center',
                                    height: '24px',
                                    fontSize: '20px',
                                    fontFamily: 'PingFangSC-Semibold,PingFang SC',
                                    fontWeight: '600',
                                    color: 'rgba(51,51,51,1)',
                                    lineHeight: '24px'
                                }}>{this.state.lang.LogoutTitle}</p>

                                <div style={{marginTop: '29px'}}>
                                    <p style={{
                                        margin: '0 30px 10px 30px',
                                        height: '16px',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        fontFamily: 'PingFangSC-Medium,PingFang SC',
                                        fontWeight: '500',
                                        color: 'rgba(51,51,51,1)',
                                        lineHeight: '16px'
                                    }}>{this.state.lang.LogoutContent}</p>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    margin: '35px 50px 0px 50px',
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <a className="dialog-cancel" style={{}}
                                       onClick={this.onLogoutCancel.bind(this)}
                                    >{this.state.lang.settingDeviceOK}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id='dialog004' className='dialog-content'
                         style={{display: 'none', position: "relative", zIndex: '200', border: 'solid lightgray 1px'}}>
                        <div
                            id="copySucess"
                            style={{
                                position: "absolute",
                                display: "none",
                                justifyContent: "center",
                                alignItems: "center",
                                top: '0',
                                left: '0',
                                right: '0',
                                bottom: '0',
                                zIndex: '201',
                                margin: "auto",
                                width: '152px',
                                height: '48px',
                                background: 'rgba(0,0,0,1)',
                                borderRadius: '6px',
                                opacity: '0.7'
                            }}>
                            <p style={{
                                height: '22px',
                                fontSize: '16px',
                                fontFamily: 'PingFangSC-Regular,PingFang SC',
                                fontWeight: '400',
                                color: 'rgba(255,255,255,1)',
                                lineHeight: '22px'
                            }}>{this.state.lang.CopySucess}</p>
                        </div>
                        <div className="dialog-setting" style={{
                            height: '233px'
                        }}>
                            <div className="content">
                                <p style={{
                                    marginTop: '30px',
                                    textAlign: 'center',
                                    height: '24px',
                                    fontSize: '20px',
                                    fontFamily: 'PingFangSC-Semibold,PingFang SC',
                                    fontWeight: '600',
                                    color: 'rgba(51,51,51,1)',
                                    lineHeight: '24px'
                                }}>{this.state.lang.VideoAddress}</p>

                                <div style={{marginTop: '29px'}}>
                                    <div style={{
                                        margin: '0 30px 10px 30px',
                                        height: 'fit-content',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        wordBreak: 'break-all',
                                        whiteSpace: 'normal',
                                        fontFamily: 'PingFangSC-Medium,PingFang SC',
                                        fontWeight: '500',
                                        color: 'rgba(51,51,51,1)',
                                        lineHeight: '16px'
                                    }}>{this.state.classVideoAddress}</div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    margin: '35px 50px 0px 50px',
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <a className="dialog-cancel" style={{}}
                                       onClick={this.onShareCancel.bind(this)}
                                    >{this.state.lang.Cancel}</a>
                                    <div style={{width: '100px'}}></div>
                                    <a className="dialog-confirm" style={{}}
                                       onClick={this.onShareConfirm.bind(this)}
                                    >{this.state.lang.Copy}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='enterMask' className="dialog-maskWhite"
                     style={{display: this.state.joinedRoom ? 'none' : '', zIndex: '99'}}/>

                <RoomSetting id='comRoomSetting' zIndex={200}
                             visible={this.state.joinedRoom === false}
                             language={this.state.lang}
                             appId={this.state.appid}
                             roomId={this.state.roomId}
                             userName={this.state.userName}
                             boardUuid={this.state.boardUuid}
                             joinStatusTip={this.state.joinStatusTip}
                             messageHandler={this.showMessageBox.bind(this)}
                             onLanguageChanged={this.onLanguageChanged.bind(this)}
                             enterRoomHandler={this.handleEnterRoom.bind(this)}/>
            </div>

        );
    }
}

export default App;
