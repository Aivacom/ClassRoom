# Electron Tutorial for Education

中文版本：[简体中文](README.md)

This open source sample project demonstrates the related functions of the demo of the interactive live broadcast large class scene.

Windows Demo: [Click to download](http://resource.sunclouds.com/ClassRoom_Setup_1.1.0.exe)

Android Demo: [Click to download](http://resource.sunclouds.com/ClassRoom-1.1.0-59-official.apk)  

## 1 Project Description

The interactive live big class is a Demo example based on the educational scene. You can compile and run the sample code to experience it. The following functions are included in this sample project：

- Classroom management；
- Real-time audio and video interaction；
- Send and receive real-time messages；
- Whiteboard；

## 2 Environmental preparation

- electron 6.0.9 & electron-builder
- Node LTS

## 3 Run the sample program

This section mainly explains how to compile and run the sample code.

### Create a developer account and get AppId

Before compiling and starting the example program, you need to first obtain an available AppId:

1. Create a developer account in [Developer Platform](https://docs.aivacom.com/cloud/en/platform/console/registration_and_login/registration_and_login.html)
2. Go to the project management page and click the *Project management* menu in the left navigation bar to create your project. Refer to [Create and Manage Projects](https://docs.aivacom.com/cloud/en/platform/console/create_and_manage_projects/create_and_manage_projects.html)
3. Copy the AppId of your project

### Configure AppId and related tokens in the project

1. Find the ProductConfig.js file according to the directory ClasRoom-PC->src
2. Fill in the AppID of your project in the `AppId` configuration in the ProductConfig.js file
    ```js
    // Set appID
    exports.AppId = "";
    ```
3. Write `NetlessSDKToken` and` NetlessSDKUrl` in ProductConfig.js, please log in to [Herewhite](https://console.herewhite.com/) official website

Note：
> If you don't need the whiteboard function, you can not enter the `NetlessSDKToken` and` NetlessSDKUrl` parameters in the ProductConfig.js file

### Integrate dependent SDK
1. Enter the sample code project directory.

  Run the `npm install --save` command.

2. In your project file path, run the following command line to install the latest version of ThunderBolt SDK for Electron:

  `npm install thunder-node-sdk --save`

  Install the SDK directly. By default, it will not be compiled and cannot be used directly. You can add the configuration to the package.json file of your project, so that the SDK will be automatically compiled when npm install:
  ```json
  "thunder_electron": {
    "build": true,    				//Whether to automatically compile when npm install
    "electron_version": "6.0.9",   //The electron version number used by your project defaults to 6.0.9
    "msvs_version":"2015"			//VS version number used for compilation, default 2015
  }
  ```
  Windows configuration command [target is the electron version number used by your project, msvs_version is the vs version number you installed, you can also specify the compilation environment for installing 2015:`example npm install --g --production windows-build-tools --vs2015]`：

  Run `cd node_modules/thunder-node-sdk`

  Run `node-gyp configure --target=6.0.9 --msvs_version=2015 --arch=ia32 --dist-url=https://electronjs.org/headers`

  After the configuration is complete, you can compile:

  `node-gyp build`

  After compiling, go back to the project root directory and run `npm run dev` to see the effect

  ## 4 SDK Instructions

### SDK version used

| SDK | Version |
|:----|:----|
| RTC-Electron | 2.8.1 |
| RTS-JS | 3.2.1 |

### SDK API used

- RTC SDK

| API | Function |
|:-------------|:---------|
|[createEngine](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#createengine)|Create the Thunder::IThunderEngine instance|
|[initialize](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#initialize)|Initialize the engine|
|[setRoomMode](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#setroommode)|Set room mode|
|[setMediaMode](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#setmediamode)|Set media format|
|[setAudioConfig](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#setaudioconfig)|Set audio parameters and application scenarios|
|[setVideoEncoderConfig](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#setvideoencoderconfig)|Set video encoding configuration. Detailed description|
|[joinRoom](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#joinroom)|Join a room|
|[leaveRoom](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#leaveroom)|Leaving room indicates hang off or exiting conversation|
|[stopAllRemoteVideoStreams](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopallremotevideostreams)|Stop/Receive all remote videos|
|[stopRemoteVideoStream](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopremotevideostream)|Stop/Receive designated remote video|
|[stopAllRemoteAudioStreams](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopallremoteaudiostreams)|Stop/Receive all audio data|
|[stopRemoteAudioStream](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopremoteaudiostream)|Stop/Receive audio data of specified users|
|[startVideoPreview](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#startvideopreview)|Start camera video preview|
|[stopVideoPreview](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopvideopreview)|Stop camera video preview|
|[stopLocalAudioStream](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stoplocalaudiostream)|Stop broadcasting/Publish audio (including starting capture, encoding, and stream publishing)|
|[stopLocalVideoStream](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stoplocalvideostream)|Enable/Disable local video sending|
|[enableCaptureVolumeIndication](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#enablecapturevolumeindication)|Enable callback of volume capture|

- RTS SDK

| API | Function |
|:-------------|:---------|
|[createHummer](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#createhummer)|Hummer initialization: Create the Hummer instance|
|[hummer.login()](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#login)|login|
|[hummer.logout()](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#logout)|logout|
|[hummer.createRTSInstance()](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#creatertsinstance)|Initializing Rts Service|
|[client.sendMessageToUser({})](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#sendmessagetouser)|Processing P2P messages|
|[client.queryUsersOnlineStatus({ uids: uids })](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#queryusersonlinestatus)|Batch querying list of online users|
|[client.createRoom({ region, roomId })](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#createroom)|Creating a single room instance|
|[room.join()](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#join)|Join a room|
|[room.leave(params)](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#leave)|Leave a room|
|[room.sendMessage({})](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#sendmessage)|Sending multicast messages in room|
|[room.getMembers()](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#getmembers)|Get room member list|
|[room.addOrUpdateRoomAttributes({})](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#addorupdateroomattributes)|Updating room attributes|
|[room.deleteRoomAttributesByKeys({})](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#deleteroomattributesbykeys)|Deleting specific attributes of a specific room|
|[room.getRoomAttributes()](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#getroomattributes)|Getting all attributes of a specific room|

## Contact us

- If you want to know more official examples, you can refer to [official sample code](https://github.com/Aivacom?tab=repositories)
- For the complete API documentation, see [RTC official documentation](https://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Windows/v2.8.0/category.html) and [RTS official documentation](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/category.html)
