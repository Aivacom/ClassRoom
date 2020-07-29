# Electron Tutorial for Education

English Version： [English](README.en.md)

这个开源示例项目演示了互动直播大班课场景Demo的相关功能。

Windows Demo: [点击下载](http://resource.sunclouds.com/ClassRoom_Setup_1.1.0.exe)

Android Demo: [点击下载](http://resource.sunclouds.com/ClassRoom-1.1.0-59-official.apk)  
## 1 项目简介

互动直播大班课是基于教育场景的一个Demo示例，大家可以编译运行示例代码进行体验。在这个示例项目中包含了以下功能：

- 课堂管理；
- 实时音视频互动；
- 收发实时消息；
- 白板；

## 2 环境准备

- electron 6.0.9 & electron-builder
- Node LTS

## 3 运行示例程序

本节主要讲解了如何编译和运行示例代码。

### 创建开发者账号并获取AppId

在编译和启动实例程序前，您需要首先获取一个可用的App Id:

1. 在[开发者平台](https://docs.aivacom.com/cloud/cn/platform/console/create_and_manage_projects/create_and_manage_projects.html)创建一个开发者账号
2. 进入项目管理页面，点击左部导航栏的 *项目管理* 菜单，创建您的项目。可参考[创建和管理项目](https://docs.aivacom.com/cloud/cn/platform/console/create_and_manage_projects/create_and_manage_projects.html)
3. 复制您项目的AppId

### 在项目中配置AppId及相关Token

1. 根据目录 ClasRoom-PC -> src 找到 ProductConfig.js 文件
2. 将您项目的 AppID 填写在 ProductConfig.js 文件中的 `AppId` 配置中
    ```js
    //设置appID
    exports.AppId = "";
    ```
3. 在 ProductConfig.js 中写入 `NetlessSDKToken` 和 `NetlessSDKUrl`, 请登录[Herewhite](https://console.herewhite.com/)官网获取

注意：
> 如果您不需要白板功能，可以不在 ProductConfig.js 文件中输入 `NetlessSDKToken` 和  `NetlessSDKUrl` 参数

### 集成依赖的SDK
1. 进入示例代码项目目录。

  执行 `npm install --save` 命令。

2. 在你的项目文件路径，运行如下命令行安装最新版的 ThunderBolt SDK for Electron：

  `npm install thunder-node-sdk --save`

  直接安装sdk，默认是不会进行编译，是不能直接使用的，可以在你的项目的package.json文件里加上配置，这样在npm install时将自动编译sdk：
  ```json
  "thunder_electron": {
    "build": true,    				    //是否在npm install时进行自动编译
    "electron_version": "6.0.9",  //你的项目使用的electron版本号 默认6.0.9
    "msvs_version":"2015"			    //编译使用的vs版本号，默认2015
  }
  ```
  
  windows配置命令[target是你的项目使用的electron版本号，msvs_version是你安装的vs版本号，也可以指定安装2015的编译环境：`example npm install --g --production windows-build-tools --vs2015]`：

  执行 `cd node_modules/thunder-node-sdk`

  执行 `node-gyp configure --target=6.0.9 --msvs_version=2015 --arch=ia32 --dist-url=https://electronjs.org/headers`

  配置完成就可以进行编译了：

  `node-gyp build`

  编译之后回到项目根目录运行`npm run dev`即可看到效果

## 4 SDK 说明

### 使用的 SDK 版本说明

| SDK | 版本 |
|:----|:----|
| RTC-Electron | 2.8.1 |
| RTS-JS | 3.2.1 |

### 使用的 SDK API 说明

- RTC SDK

| API | 实现功能 |
|:-------------|:---------|
|[createEngine](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#createengine)|创建ThunderEngine实例|
|[initialize](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#initialize)|初始化ThunderEngine|
|[setRoomMode](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#setroommode)|设置房间场景模式|
|[setMediaMode](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#setmediamode)|设置媒体模式|
|[setAudioConfig](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#setaudioconfig)|设置音频参数和使用场景|
|[setVideoEncoderConfig](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#setvideoencoderconfig)|设置视频编码配置|
|[joinRoom](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#joinroom)|加入房间|
|[leaveRoom](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#leaveroom)|离开房间|
|[stopAllRemoteVideoStreams](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopallremotevideostreams)|停止／接收所有远端视频|
|[stopRemoteVideoStream](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopremotevideostream)|停止/接收指定的远端视频|
|[stopAllRemoteAudioStreams](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopallremoteaudiostreams)|停止/接收所有音频数据|
|[stopRemoteAudioStream](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopremoteaudiostream)|停止/接收指定用户音频数据|
|[startVideoPreview](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#startvideopreview)|开启摄像头视频预览|
|[stopVideoPreview](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stopvideopreview)|停止摄像头视频预览|
|[stopLocalAudioStream](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stoplocalaudiostream)|关闭/打开本地音频(停播/开播)(包括启动采集、编码和推流)|
|[stopLocalVideoStream](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#stoplocalvideostream)|打开/关闭本地视频发送。|
|[enableCaptureVolumeIndication](https://docs.jocloud.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Electron/v2.9.0/function.html#enablecapturevolumeindication)|打开采集音量回调|

- RTS SDK

| API | 实现功能 |
|:-------------|:---------|
|[createHummer](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E5%88%9D%E5%A7%8B%E5%8C%96hummer)|Hummer初始化：创建hummer实例|
|[hummer.login()](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E7%99%BB%E5%BD%95login)|登录(login)|
|[hummer.logout()](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E7%99%BB%E5%87%BAlogout)|登出(logout)|
|[hummer.createRTSInstance()](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E5%88%9D%E5%A7%8B%E5%8C%96rts-service)|初始化： 创建RtsService实例|
|[client.sendMessageToUser({})](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E5%8F%91%E9%80%81%E7%82%B9%E5%AF%B9%E7%82%B9%E7%9A%84%E6%B6%88%E6%81%AFsendmessagetouser)|发送点对点的消息|
|[client.queryUsersOnlineStatus({ uids: uids })](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E7%94%A8%E6%88%B7%E5%9C%A8%E7%BA%BF%E5%88%97%E8%A1%A8queryusersonlinestatus)|批量查询用户在线列表|
|[client.createRoom({ region, roomId })](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E5%88%9B%E5%BB%BA%E5%8D%95%E4%B8%AA%E6%88%BF%E9%97%B4%E5%AE%9E%E4%BE%8Bcreateroom)|创建单个房间实例|
|[room.join()](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E5%8A%A0%E5%85%A5%E6%88%BF%E9%97%B4join)|加入房间|
|[room.leave(params)](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#%E9%80%80%E5%87%BA%E6%88%BF%E9%97%B4leave)|退出房间|
|[room.sendMessage({})](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#room%E5%8F%91%E9%80%81%E7%BB%84%E6%92%AD%E6%B6%88%E6%81%AFsendmessage)|room发送组播消息|
|[room.getMembers()](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#room%E8%8E%B7%E5%8F%96%E6%88%BF%E9%97%B4%E7%94%A8%E6%88%B7%E5%88%97%E8%A1%A8getmembers)|room获取房间用户列表|
|[room.addOrUpdateRoomAttributes({})](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#room%E6%9B%B4%E6%96%B0%E6%88%BF%E9%97%B4%E5%B1%9E%E6%80%A7addorupdateroomattributes)|room更新房间属性|
|[room.deleteRoomAttributesByKeys({})](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#room%E5%88%A0%E9%99%A4%E6%9F%90%E6%8C%87%E5%AE%9A%E6%88%BF%E9%97%B4%E7%9A%84%E6%8C%87%E5%AE%9A%E5%B1%9E%E6%80%A7deleteroomattributesbykeys)|room删除某指定房间的指定属性|
|[room.getRoomAttributes()](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/function.html#room%E6%9F%A5%E8%AF%A2%E6%9F%90%E6%8C%87%E5%AE%9A%E6%88%BF%E9%97%B4%E7%9A%84%E5%85%A8%E9%83%A8%E5%B1%9E%E6%80%A7getroomattributes)|room查询某指定房间的全部属性|

## 联系我们

- 如果你想了解更多官方示例，可以参考[官方示例代码](https://github.com/Aivacom?tab=repositories)
- 完整的 API 文档见 [RTC官方文档](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Windows/v2.8.0/category.html) 和 [RTS官方文档](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/Windows/v3.1.3/category.html)
