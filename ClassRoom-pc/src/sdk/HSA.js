/* The basic of HSA, all methods, events, properties are listed in this file firstly.
* */

import Events from "events";
import LogFactory from "../log/LogFactory";

class HSA {
    EventNames = {
        onError: "HSA.Events.onError",
        onConnectionError: "HSA.Events.onConnectionError",
        onConnectionStateChanged: "HSA.Events.onConnectionStateChanged",
        onChannelError: "HSA.Events.onChannelError",

        onInitializeResult: "HSA.Events.onInitializeResult",

        onLoginResult: "HSA.Events.onLoginResult",
        onLoginStatus: "HSA.Events.onLoginStatus",

        onJoinRoomResult: "HSA.Events.onJoinRoomResult",
        onLeaveRoomResult: "HSA.Events.onLeaveRoomResult",

        onUserJoined: "HSA.Events.onUserJoined",
        onUserLeaved: "HSA.Events.onUserLeaved",
        onMemberCountUpdated: "HSA.Events.onMemberCountUpdated",
        onRoomMemberOffline: "HSA.Events.onRoomMemberOffline",
        onGetChannelUserListResult: "HSA.Events.onGetChannelUserListResult",
        onQueryOnlineStatusForUserResult: "HSA.Events.onQueryOnLineStatusForUserResult",
        onUserOnlineStatusChanged: "HSA.Events.onUserOnlineStatusChanged",

        onSetUserAttributesResult: "HSA.Events.onSetUserAttributesResult",

        onUserAttributeSet: "HSA.Events.onUserAttributeSet",
        onUserAttributeDeleted: "HSA.Events.onUserAttributeDeleted",
        onUserAttributeClear: "HSA.Events.onUserAttributeClear",
        onUserAttributeAddedOrUpdate: "HSA.Events.onUserAttributeAddedOrUpdate",

        onRoomAttributeAddOrUpadte: "HSA.Events.onRoomAttributeAddOrUpadte",
        onRoomAttributeSet: "HSA.Events.onRoomAttributeSet",
        onRoomAttributeDelete: "HSA.Events.onRoomAttributeDelete",
        onRoomAttributeClear: "HSA.Events.onRoomAttributeClear",

        onGetUsersByAttributeResult: "HSA.Events.onGetUsersByAttributeResult",

        onDeleteUserAttributesResult: "HSA.Events.onDeleteUserAttributeResult",

        onSendMessageToChannelResult: "HSA.Events.onSendMessageToChannelResult",
        onMessageFromChannel: "HSA.Events.onMessageFromChannel",

        onSendMessageToUserResult: "HSA.Events.onSendMessageToUserResult",
        onMessageFromUser: "HSA.Events.onMessageFromUser",

        onQueryRoomAttributeResult: "HSA.Events.onQueryRoomAttributeResult",
    };

    ErrorCodes = {
        Version_ThisIsHSA: 10001,

    };

    _version = "1.0.3";
    _event = new Events.EventEmitter();

    _appId = "";
    _userId = "";
    _token = "";

    _log = new LogFactory().New("console", {prefix: "### HSA: "});


    /*
    * prop should be formatted as below:
    * {
    *   appId: "",
    *   userId: ""
    * }
    * */
    constructor(props) {
        if (props && props.appId) {
            this._appId = props.appId;
        }

        let fn = (props && props.logFileName) ? props.logFileName : 'default.log';
        this._log = new LogFactory().New("LocalFile", {logFileName: fn, logPrefix: "### HSA: "});

        this._log.info("HSA created by $0", props);
    }

    destroy() {
        console.log("HSA.destroy");
        this._log.debug("HSA.destroy");
    }

    //Current version of the HSA object.
    version() {
        console.log("HSA.version");
        this._log.debug("HSA.version");
        return this._version;
    }

    //Version of HSA interface which you based on.
    //This method is a MUST of HSA object,
    baseVersion() {
        console.log("HSA.baseVersion");
        this._log.debug("HSA.baseVersion");
        throw {code: this.ErrorCodes.Version_ThisIsHSA, message: "This is HSA interface."};
    }

    /*The SDK part*/
    initialize(appId, userId, token) {
        if (!appId) {
            //throw invalid appId.
        }

        if (!userId) {
            //throw invalid userId.
        }

        if (!token) {
            //throw invalid token.
        }

        this._appId = appId;
        this._userId = userId;
        this._token = token;
    }

    invokeInitializeResult(arg) {
        console.log("HSA.invokeInitializeResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeInitializeResult: arg=$0", arg);
        this._event.emit(this.EventNames.onInitializeResult, arg);
    }

    setInternalAttribute(attr) {
        console.log("WARNING!!! ROOT METHOD. HSA.setInternalAttribute", JSON.stringify(attr));
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.setInternalAttribute: attr=$0", attr);
    }

    on(event, listener, target) {
        if (!event) {
            //throw invalid event.
        }

        if (!listener) {
            //throw invalid listener.
        }

        if (target) {
            this._event.on(event, listener.bind(target));
        } else {
            this._event.on(event, listener);
        }
    }

    invokeOnError(error) {
        console.log("HSA.invokeOnError", JSON.stringify(error));
        this._log.error("HSA.invokeOnError: error=$0", error);
        this._event.emit(this.EventNames.onError, error);
    }

    invokeOnConnectionError(error) {
        console.log("HSA.invokeOnConnectionError", JSON.stringify(error));
        this._log.error("HSA.invokeOnConnectionError: error=$0", error);
        this._event.emit(this.EventNames.onConnectionError, error);
    }

    invokeOnChannelError(error) {
        console.log("HSA.invokeOnChannelError", (error));
        this._log.error("HSA.invokeOnChannelError: error=$0", error);
        this._event.emit(this.EventNames.onChannelError, error);
    }

    /*The log part*/
    setLogLevel(level) {

    }

    getLogLevel() {

    }

    /*Will be applied from 1.0.4
    setLogLocalSaveAttribute(attr){

    }

    invokeLogSaveLocalError(arg){

    }
    */

    /*Will be applied from 1.0.5
    setLogUploadAttribute(attr){

    }

    startLogUpload(){

    }

    stopLogUpload(){

    }

    invokeLogUploadError(arg){

    }
     */

    /*The connection part*/
    login(userId, token) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.login", (userId));
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.login: userId=$0", userId);

    }

    invokeLoginResult(arg) {
        console.log("HSA.invokeLoginResult", arg);
        this._log.debug("HSA.invokeLoginResult: arg=$0", arg);
        this._event.emit(this.EventNames.onLoginResult, arg);
    }

    //will be invoked when login status changed.
    invokeLoginStatus(status) {
        console.log("HSA.invokeLoginStatus", status);
        this._log.debug("HSA.invokeLoginStatus: status=$0", status);
        this._event.emit(this.EventNames.onLoginResult, status);
    }

    //will be invoked when connection status changed.
    ConnectionStateChanged(status) {
        console.log("HSA.ConnectionStateChanged", status);
        this._log.debug("HSA.ConnectionStateChanged: status=$0", status);
        this._event.emit(this.EventNames.onConnectionStateChanged, status);
    }

    /*The token part*/
    refreshToken(token, userId, roomId) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.refreshToken");
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.refreshToken");
    }

    /*The room part(enter, leave, properties)*/
    joinChannel(channelId) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.joinChannel", channelId);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.joinChannel: channelId=$0", channelId);
    }

    join() {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.join");
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.join");
    }

    invokeJoinRoomResult(arg) {
        console.log("HSA.invokeJoinRoomResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeJoinRoomResult: arg=$0", arg);
        this._event.emit(this.EventNames.onJoinRoomResult, arg);
    }

    invokeOnNotifyJoinChannel(msg) {
        console.log("HSA.invokeOnNotifyJoinChannel", JSON.stringify(msg));
        this._log.debug("HSA.invokeOnNotifyJoinChannel: msg=$0", msg);
        this._event.emit(this.EventNames.onUserJoined, msg);
    }

    leaveChannel(channelId) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.leaveChannel");
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.leaveChannel");
    }

    invokeLeaveRoomResult(arg) {
        console.log("HSA.invokeLeaveRoomResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeLeaveRoomResult: arg=$0", arg);
        this._event.emit(this.EventNames.onLeaveRoomResult, arg);
    }

    invokeOnNotifyLeaveChannel(msg) {
        console.log("HSA.invokeOnNotifyLeaveChannel", JSON.stringify(msg));
        this._log.debug("HSA.invokeOnNotifyLeaveChannel: msg=$0", msg);
        this._event.emit(this.EventNames.onUserLeaved, msg);
    }

    invokeOnMemberCountUpdated(msg) {
        console.log("HSA.invokeOnMemberCountUpdated", JSON.stringify(msg));
        this._log.debug("HSA.invokeOnMemberCountUpdated: msg=$0", msg);
        this._event.emit(this.EventNames.onMemberCountUpdated, msg);
    }

    invokeOnRoomMemberOffline(msg) {
        console.log("HSA.invokeOnRoomMemberOffline", JSON.stringify(msg));
        this._log.debug("HSA.invokeOnRoomMemberOffline: msg=$0", msg);
        this._event.emit(this.EventNames.onRoomMemberOffline, msg);
    }

    setRoomAttributes(channelId, key, prop) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.setUserAttributes, key=" + key + ", value=" + prop);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.setRoomAttributes: channelId=$0, key=$1, prop=$2", channelId, key, prop);
    }

    addOrUpdateLocalUserAttributes(channelId, key, prop) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.addOrUpdateLocalUserAttributes, key=" + key + ", value=" + prop);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.addOrUpdateLocalUserAttributes: channelId=$0, key=$1, prop=$2", channelId, key, prop);
    }

    addOrUpdateRoomAttributes(channelId, key, prop) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.addOrUpdateLocalUserAttributes, key=" + key + ", value=" + prop);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.addOrUpdateLocalUserAttributes: channelId=$0, key=$1, prop=$2", channelId, key, prop);
    }

    deleteRoomAttributesByKeys(roomId, keys) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.deleteRoomAttributesByKeys, key = " + roomId + ", keys =" + JSON.stringify(keys));
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.deleteRoomAttributesByKeys: roomId = $0, keys = $1", roomId, JSON.stringify(keys));
    }

    getRoomAttributes(channelId) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.setUserAttributes, key=" + key + ", value=" + prop);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.setRoomAttributes: channelId=$0, key=$1, prop=$2", channelId, key, prop);
    }

    invokeQueryRoomAttributeResult(arg){
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.setUserAttributes, key=" + key + ", value=" + prop);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.setRoomAttributes: channelId=$0, key=$1, prop=$2", channelId, key, prop);
        this._event.emit(this.EventNames.onQueryRoomAttributeResult, arg);
    }

    /*Will be applied from v.1.0

    invokeSetRoomAttributesResult(arg){

    }

    onNotifyRoomAttributesSet(arg){

    }

    queryRoomAttribute(key){

    }



    queryRoomAllAttributes(){

    }

    invokeQueryRoomAllAttributesResult(arg){

    }

    deleteRoomAttributes(attributeKeys){

    }

    invokeDeleteRoomAttributeResult(arg){

    }

    onNotifyRoomAttributesDelete(arg){

    }
     */

    /*The user(list, online status, properties) part*/
    getChannelUserList(channelId) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.getChannelUserList", channelId);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.getChannelUserList: channelId=$0", channelId);
    }

    getUserAttributes(uid) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.getUserAttributes", uid);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.getUserAttributes: uid=$0", uid);
    }

    queryUsersOnlineStatus(uids) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.queryUsersOnlineStatus", JSON.stringify(uids));
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.queryUsersOnlineStatus: uids=$0", JSON.stringify(uids));
    }

    invokeGetChannelUserListResult(arg) {
        console.log("HSA.invokeGetChannelUserListResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeGetChannelUserListResult: arg=$0", arg);
        this._event.emit(this.EventNames.onGetChannelUserListResult, arg);
    }

    queryOnlineStatusForUser() {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.queryOnlineStatusForUser");
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.queryOnlineStatusForUser");
    }

    invokeQueryOnLineStatusForUserResult(arg) {
        console.log("HSA.invokeQueryOnLineStatusForUserResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeQueryOnLineStatusForUserResult: arg=$0", arg);
        this._event.emit(this.EventNames.onQueryOnlineStatusForUserResult, arg);
    }

    setUserAttributes(channelId, key, prop) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.setUserAttributes, key=" + key + ", value=" + prop);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.setUserAttributes: channelId=$0, key=$1, prop=$2", channelId, key, prop);
    }

    invokeSetUserAttributesResult(arg) {
        console.log("HSA.invokeSetUserAttributesResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeSetUserAttributesResult: arg=$0", arg);
        this._event.emit(this.EventNames.onSetUserAttributesResult, arg);
    }

    invokeOnNotifyUserAttributesSet(attr) {
        console.log("HSA.invokeOnNotifyUserAttributesSet", JSON.stringify(attr));
        this._log.debug("HSA.invokeOnNotifyUserAttributesSet: attr=$0", attr);
        this._event.emit(this.EventNames.onUserAttributeSet, attr);
    }

    invokeOnNotifyUserAttributesDelete(attr) {
        console.log("HSA.invokeOnNotifyUserAttributesDelete", JSON.stringify(attr));
        this._log.debug("HSA.invokeOnNotifyUserAttributesDelete: attr=$0", attr);
        this._event.emit(this.EventNames.onUserAttributeDeleted, attr);
    }

    invokeOnNotifyUserAttributesClear(attr) {
        console.log("HSA.invokeOnNotifyUserAttributesClear", JSON.stringify(attr));
        this._log.debug("HSA.invokeOnNotifyUserAttributesClear: attr=$0", attr);
        this._event.emit(this.EventNames.onUserAttributeClear, attr);
    }

    invokeOnNotifyUserAttributesAddedOrUpdate(attr) {
        console.log("HSA.invokeOnNotifyUserAttributesAddedOrUpdate", JSON.stringify(attr));
        this._log.debug("HSA.invokeOnNotifyUserAttributesAddedOrUpdate: attr=$0", attr);
        this._event.emit(this.EventNames.onUserAttributeAddedOrUpdate, attr);
    }

    invokeOnNotifyRoomAttributesAddOrUpdate(attr) {
        console.log("HSA.invokeOnNotifyRoomAttributesAddOrUpdate", JSON.stringify(attr));
        this._log.debug("HSA.invokeOnNotifyRoomAttributesAddOrUpdate: attr=$0", attr);
        this._event.emit(this.EventNames.onRoomAttributeAddOrUpadte, attr);
    }

    invokeOnNotifyRoomAttributesSet(attr) {
        console.log("HSA.invokeOnNotifyRoomAttributesSet", JSON.stringify(attr));
        this._log.debug("HSA.invokeOnNotifyRoomAttributesSet: attr=$0", attr);
        this._event.emit(this.EventNames.onRoomAttributeSet, attr);
    }

    invokeOnNotifyRoomAttributesDelete(attr) {
        console.log("HSA.invokeOnNotifyRoomAttributesDelete", JSON.stringify(attr));
        this._log.debug("HSA.invokeOnNotifyRoomAttributesDelete: attr=$0", attr);
        this._event.emit(this.EventNames.onRoomAttributeDelete, attr);
    }

    invokeOnNotifyRoomAttributesClear(attr) {
        console.log("HSA.invokeOnNotifyRoomAttributesClear", JSON.stringify(attr));
        this._log.debug("HSA.invokeOnNotifyRoomAttributesClear: attr=$0", attr);
        this._event.emit(this.EventNames.onRoomAttributeClear, attr);
    }

    deleteUserAttributesByKeys(channelId, keys, separator) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.deleteUserAttributesByKeys");
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.deleteUserAttributesByKeys: channelId=$0, keys=$1, separator=$2", channelId, keys, separator);
    }

    invokeDeleteUserAttributeResult(arg) {
        console.log("HSA.invokeDeleteUserAttributeResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeDeleteUserAttributeResult: arg=$0", arg);
        this._event.emit(this.EventNames.onDeleteUserAttributesResult, arg);
    }

    getChannelUserListByAttribute(channelId, key, value) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.getChannelUserListByAttribute");
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.getChannelUserListByAttribute: channelId=$0, key=$1, value=$2", channelId, key, value);
    }

    invokeGetUsersByAttributeResult(arg) {
        console.log("HSA.invokeGetUsersByAttributeResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeGetUsersByAttributeResult: arg=$0", arg);
        this._event.emit(this.EventNames.onGetUsersByAttributeResult, arg);
    }

    /*The message part*/
    sendMessageToChannel(channelId, msgText, reliable, msgType) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.sendMessageToChannel: msgText=" + msgText + ", msgType=" + msgType);
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.setUserAttributes, channelId=$0, msgText=$1, reliable=$2, msgType=$3", channelId, msgText, reliable, msgType);
    }

    invokeSendMessageToChannelResult(arg) {
        console.log("HSA.invokeSendMessageToChannelResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeSendMessageToChannelResult: arg=$0", arg);
        this._event.emit(this.EventNames.onSendMessageToChannelResult, arg);
    }

    invokeOnReceiveChannelMessage(msg) {
        console.log("HSA.invokeOnReceiveChannelMessage", JSON.stringify(msg));
        this._log.debug("HSA.invokeOnReceiveChannelMessage: msg=$0", msg);
        this._event.emit(this.EventNames.onMessageFromChannel, msg);
    }

    sendMessageToUser(userId, msgText, reliable, msgType) {
        console.log("WARNING!!! ROOT METHOD CALLED. HSA.sendMessageToUser");
        this._log.warn("WARNING!!! ROOT METHOD CALLED. HSA.sendMessageToUser: userId=$0, msgText=$1, reliable=$2, msgType=$3", userId, msgText, reliable, msgType);
    }

    invokeSendMessageToUserResult(arg) {
        console.log("HSA.invokeSendMessageToUserResult", JSON.stringify(arg));
        this._log.debug("HSA.invokeSendMessageToUserResult: arg=$0", arg);
        this._event.emit(this.EventNames.onSendMessageToUserResult, arg);
    }

    invokeOnReceiveUserMessage(msg) {
        console.log("HSA.invokeOnReceiveMessage", JSON.stringify(msg));
        this._log.debug("HSA.invokeOnReceiveMessage: msg=$0", msg);
        this._event.emit(this.EventNames.onMessageFromUser, msg);
    }

    /*The common request part
    * based on room attributes,
    * Will be applied from 1.1.5

    //Send a request to an array of user.
    sendRequestToUsers(users, request) {

    }

    //Invoke the result event of send request.
    invokeSendRequestToUsersResult(arg) {

    }

    //Query all sent requests.
    querySentRequests(sender){

    }

    //invoke the result event of querying sent requests.
    invokeQuerySendRequestsResult(arg){

    }

    //Invoked in receiver side when received a request from sender.
    //Receiver should receive this request before it expired,
    //when user goes online after request is sent.
    onRequestReceived(sender, request) {

    }

    //Query all received requests.
    queryReceivedRequests(receiver){

    }

    //Invoke the result event of query received requests.
    invokeQueryReceivedRequestsResult(arg){

    }

    //Cancel the sending request, before all receiver accept it.
    cancelSendingRequest() {

    }

    //Invoke the result event of cancel sending request.
    invokeCancelSendingRequestResult(arg) {

    }

    //Invoked in receiver side, when request is canceled by receiver.
    onRequestCanceled(sender, request) {

    }

    //Accept the request.
    acceptRequest(request) {

    }

    //Invoke the result event of accept request action.
    invokeAcceptRequestResult(arg) {

    }

    //Invoked in sender side, when user accept the request.
    onRequestAccepted(user, request) {

    }

    //Reject the given request.
    rejectRequest(request) {

    }

    //Invoke the result event of reject request action.
    invokeRejectRequestResult(arg) {

    }

    //Invoked in sender side, when user reject the request.
    onRequestRejected(user, request) {

    }

    //Invoked in receiver side, when user does not accept this request after a const time.
    onRequestMissed(sender, request) {

    }

    //Invoked in sender side, when any user missed this request.
    onRequestExpired(users, request) {

    }

    //Invoked both in sender side and receiver side,
    //when all receiver accepted the request.
    onRequestStarted(sender,request){

    }

    //End this request, called by sender ONLY.
    endRequest(request){

    }

    //Invoke the result event of ending the request.
    invokeEndRequestResult(arg){

    }

    //Invoked in receiver side, when sender end this request.
    onRequestEnd(sender, request){

    }
    */
}

export default HSA;
