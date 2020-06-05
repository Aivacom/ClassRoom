import HttpToken from "../sdk/HttpToken"
import utils from "../sdk/Utils"
import {ThunderTokenUrl} from "../ProductConfig";

//请求token

/*
* the basic initialize prop is as below:
* {
* appId: "",
* userId: ""
* }
* */

class TokenThunder extends HttpToken {

    constructor(props) {
        super(props);

        this.HttpUrl = ThunderTokenUrl;
    }

    parseRequest() {
        return JSON.stringify({
            app_id: this._appId,
            user_id: this._userId
        });
    }

    parseResponse(json) {
        let result = utils.checkField(json, "token");
        if (!result.success) {
            return result;
        }

        result.success = true;
        result.token = json.token;
        return result;
    }
}

export default TokenThunder;
