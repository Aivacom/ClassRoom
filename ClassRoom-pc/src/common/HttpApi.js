import Axios from "axios"
import AppConstant from "./AppConstant"

const fs = require('fs');

class HttpApi {
    /*
    axios.get('/user/12345')
        .then(function(response) {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
        });

    axios.get('/user/12345')
        .catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
        });
    */

    postLog(logFileName, uid, contact, text) {
        let result = {success: false, error: ""};

        let responseObj = {
            appId: "ClassRoom-PC",
            sign: "",
            data: {
                reportType: "UFB",
                guid: "123456",
                productVer: AppConstant.AppVersion,
                uid: uid,
                contactInfo: contact,
                osVer: "Windows",
                phoneType: "Electron",
                feedback: text
            }
        };

        let formData = new FormData();
        let buffer = fs.readFileSync(logFileName);
        formData.append('nyy', JSON.stringify(responseObj));
        formData.append("file", new Blob([buffer]), logFileName);

        let config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            method: 'post',
            url: 'https://imobfeedback.yy.com/userFeedback',
            data: formData
        };

        return new Promise(function (resolve, reject) {
            let p = Axios(config);
            p.then(function (response) {
                if (response.status !== 204) {
                    result.error = "Failed to upload log, response code is: " + response.status;
                    console.log(result.error);
                    reject(result);
                    return;
                }

                console.log("File uploaded.");
                result.success = true;
                resolve(result);
            });
            p.catch(function (error) {
                result.error = error.message;
                reject(result);
            });
        });
    }

    post(url, body, headers) {
        let config =
            {
                url: url,
                method: 'post',
                headers: headers,
                data: body,

                timeout: 10000,

                onUploadProgress: function (progressEvent) {
                },

                onDownloadProgress: function (progressEvent) {
                }
            };

        return new Promise(function (resolve, reject) {
            let p = Axios(config);

            p.then(function (response) {
                if (response.status !== 200) {
                    result.error = "Bad response, HTTP response code is : " + response.status
                        + ", response text is: " + response.data;

                    console.log(result.error);

                    reject(result);
                    return;
                }

                let json = null;
                try {
                    json = typeof response.data === 'object' ? response.data : JSON.parse(response.data);
                } catch (e) {
                    result.error = "Invalid response: data is not json, data is:" + response.data
                        + "error is :" + e.error;

                    console.log(result.error);

                    reject(result);
                }

                resolve(json);
            });
            p.catch(function (error) {
                if (error.response) {
                    reject({'code': error.code, 'message': error.message, 'data': error.response.data});
                } else {
                    reject({'code': error.code, 'message': error.message, 'data': ''});
                }
            });
        });
    }
}

export default HttpApi;

