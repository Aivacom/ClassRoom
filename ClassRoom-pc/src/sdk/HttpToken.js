import LogFactory from "../log/LogFactory";
//required utils for sub class.
const utils = require("./Utils");
import HttpApi from "../common/HttpApi";

//请求token

/*
* the basic initialize prop is as below:
* {
* appId: "",
* userId: ""
* }
* */

class HttpToken {
    HttpUrl = "";
    ContentType = "application/json";

    _appId = '';
    _userId = '';

    constructor(props) {
        this._appId = props.appId ? props.appId : '';
        this._userId = props.userId ? props.userId : '';
    }

    /*
    * Parse request data to string for HTTP sending.
    * */
    parseRequest() {
        return "";
    }

    /*
    * Parse converted json object from HTTP to function result,
    * this is the key step to read token from json.
    *
    * */
    parseResponse(json) {
        return {success: false, error: "Root method, no token."};
    }

    request() {
        let me = this;
        let requestBody = me.parseRequest();

        return new Promise(function (resolve, reject) {
            let api = new HttpApi();

            api.post(me.HttpUrl, requestBody, {'Content-Type': me.ContentType})
                .then((json) => {
                    let result = me.parseResponse(json);

                    if (result.success) {
                        resolve(result.token);
                    } else {
                        reject(result.error);
                    }
                })
                .catch((error) => {
                    console.error("HttpToken Failed: " +error.message);
                    reject(error.message);
                });
        });
    }
}

export default HttpToken;
