import {NetlessSDKUrl, NetlessSDKToken} from '../ProductConfig'
import {isNumber} from 'util';
import HttpApi from '../common/HttpApi';
import LogFactory from "../log/LogFactory";

class NetlessBoardRoom {
    /**
     * 白板token请求地址
     * @type {string}
     */
    BaseUrl = NetlessSDKUrl;

    _log = new LogFactory().New("console");

    /**
     *
     * @param {string} roomId
     * @returns {boolean}
     */
    validateRoomId(roomId) {
        return true;
    }

    /**
     * Request server to create a room.
     *
     * success:
     *  {
     *  'uuid' : ''
     *  };
     *
     *  failed:
     *  {
     *  'success' : false,
     *  'message' : ''
     *  }
     *
     * @param {string} roomId
     * @param {Number} maxUserCount
     */
    createRoom(roomId, maxUserCount) {
        let result = {
            success: false,
            message: ''
        };

        this._log.info('NetlessBoardRoom.createRoom, roomId:$0, maxUserCount:$1', roomId, maxUserCount);

        return new Promise((resolve, reject) => {
            if (!this.validateRoomId(roomId)) {
                result.message = 'Room id is not valid:' + roomId;
                reject(result);
                return;
            }

            let url = this.BaseUrl + '/room?token=' + NetlessSDKToken;
            let data = {
                name: roomId,
                limit: maxUserCount > 0 ? maxUserCount : 0,
                mode: 'historied'
            };

            let http = new HttpApi();
            http.post(url, data)
                .then((json) => {
                    let roomResult = {
                        uuid: json.msg.room.uuid
                    };

                    resolve(roomResult);
                })
                .catch((error) => {
                    result.success = false;
                    result.message = error.message;
                    reject(result);
                });
        });
    }

    /**
     * Request server to enter a room.
     *
     * success:
     *  {
     *  'uuid' : '',
     *  'roomToken' : ''
     *  };
     *
     *  failed:
     *  {
     *  'success' : false,
     *  'message' : ''
     *  }
     *
     * @param {string} uuid
     */
    enterRoom(uuid) {
        let result = {
            success: false,
            message: ''
        };

        return new Promise((resolve, reject) => {
            let url = this.BaseUrl + '/room/join?token=' + NetlessSDKToken + '&uuid=' + uuid;

            let http = new HttpApi();
            http.post(url)
                .then((json) => {
                    let roomResult = {
                        uuid: uuid,
                        roomToken: json.msg.roomToken
                    };

                    resolve(roomResult);
                })
                .catch((error) => {
                    result.success = false;
                    result.message = error.message;
                    reject(result);
                });
        });
    }

    /**
     * Request server to close a room.
     *
     * success:
     *  {
     *  'success' : true,
     *  'message' : ''
     *  }
     *
     *  failed:
     *  {
     *  'success' : false,
     *  'message' : ''
     *  }
     *
     * @param {string} uuid
     */
    closeRoom(uuid) {
        let result = {
            success: false,
            message: ''
        };

        return new Promise((resolve, reject) => {
            let url = this.BaseUrl + '/room/close?token=' + NetlessSDKToken;
            let data = {
                uuid: uuid
            };

            let http = new HttpApi();
            http.post(url, data)
                .then((json) => {
                    result.success = true;
                    result.message = '';

                    resolve(result);
                })
                .catch((error) => {
                    result.success = false;
                    result.message = error.message;
                    reject(result);
                });
        });
    }
}

export default NetlessBoardRoom;