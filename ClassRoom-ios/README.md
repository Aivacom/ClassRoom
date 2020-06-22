# iOS Tutorial for Objective-C - Education

English Version： [English](README.en.md)

这个开源示例项目演示了互动直播大班课场景Demo的相关功能。

## 1 项目简介

互动直播大班课是基于教育场景的一个Demo示例，大家可以编译运行示例代码进行体验。在这个示例项目中包含了以下功能：

- 课堂管理；
- 实时音视频互动；
- 收发实时消息；
- 白板；

## 2 环境准备

- XCode 10.0 +
- iOS 8.0 +
-  真机设备

## 3 运行示例程序

本节主要讲解了如何编译和运行示例代码。

### 创建开发者账号并获取AppId

在编译和启动实例程序前，您需要首先获取一个可用的App Id:

1. 在[开发者平台](https://docs.aivacom.com/cloud/cn/platform/console/registration_and_login/registration_and_login.html)创建一个开发者账号
2. 进入项目管理页面，点击左部导航栏的 *项目管理* 菜单，创建您的项目。可参考[创建和管理项目](https://docs.aivacom.com/cloud/cn/platform/console/create_and_manage_projects/create_and_manage_projects.html)
3. 复制您项目的AppId

   
### 在项目中配置AppId及相关Token

1. 根据目录 SCClassRoom->Demo->AppConfig 找到 SYAppConfig.plist 文件
2. 将您项目的 AppID 填写在 SYAppConfig.plist 文件中的  `app_id` 配置中
3. 在 SYAppConfig.plist 中填写 `sdk_token` ，获取 Token 的方法可参考[用户鉴权](https://docs.aivacom.com/cloud/cn/platform/other/user_auth.html)和[生成鉴权Token](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/common_functions/generate_token/generate_token_java.html)
4. 在 SYAppConfig.plist 中填写 `white_url` 和 `white_token` , 请登录[Herewhite](https://console.herewhite.com/)官网获取

注意：
> 如果您未部署Token服务器，建议您将项目设置为[AppID鉴权模式](https://docs.aivacom.com/cloud/cn/platform/console/create_and_manage_projects/create_and_manage_projects.html)

> 如果您不需要白板功能，可以不在 SYAppConfig.plist 文件中填写 `white_url` 和 `white_token` 参数  

### 集成依赖的SDK

1. 安装 CocoaPods，在 Terminal 里输入以下命令行：  
    > brew install cocoapods  
* 如果你已在系统中安装了 CocoaPods 和 Homebrew，可以跳过这一步。
* 如果 Terminal 显示 -bash: brew: command not found，则需要先安装 Homebrew，再输入该命令行。详见 Homebrew 安装方法。 

2. 使用终端进入示例代码项目目录，执行 'pod update' 命令；
3. 使用 Xcode 打开 SCClassRoom.xcworkspace，连接 iPhone/iPad 设备，设置有效的开发者签名和 BundleId 后即可运行；


## 4 SDK 说明

### 使用的 SDK 版本说明

| SDK | 版本 |
|:----|:----|
| RTC | 2.8.1 |
| RTS | 3.1.5 |

### 使用的 SDK API 说明

- RTC SDK

| API | 实现功能 |
|:-------------|:---------|
|[createEngine](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginecreateenginesceneiddelegate)|创建 ThunderEngine 实例并初始化|
|[setRoomMode](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginesetroommode)|设置房间场景模式|
|[setMediaMode](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginesetmediamode)|设置SDK的媒体模式|
|[setAudioConfig](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginesetaudioconfigcommutmodescenariomode)|设置音频属性|
|[setVideoEncoderConfig](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginesetvideoencoderconfig)|设置视频编码属性|
|[joinRoom](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginejoinroomroomnameuid)|加入房间|
|[leaveRoom](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderengineleaveroom)|离开房间|
|[stopAllRemoteVideoStreams](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginestopallremotevideostreams)|停止或者接收所有视频流|
|[stopRemoteVideoStream](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginestopremotevideostreamstopped)|接收/停止接收指定视频流|
|[stopAllRemoteAudioStreams](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginestopallremoteaudiostreams)|停止或者接收所有音频流|
|[stopRemoteAudioStream](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginestopremoteaudiostreamstopped)|接收/停止接收指定音频流|
|[setRemoteVideoCanvas](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginesetremotevideocanvas)|设置远端用户视图|
|[setLocalVideoCanvas](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginesetlocalvideocanvas)|设置本地视图|
|[startVideoPreview](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginestartvideopreview)|开启视频预览|
|[stopVideoPreview](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginestopvideopreview)|关闭视频预览|
|[enableLocalVideoCapture](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderengineenablelocalvideocapture)|开/关本地视频采集|
|[stopLocalAudioStream](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginestoplocalaudiostream)|开/关本地音频发送|
|[stopLocalVideoStream](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.7.0/function.html#thunderenginestoplocalvideostream)|开/关本地视频流发送|


- RTS SDK

| API | 实现功能 |
|:-------------|:---------|
|[startWithAppId](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hummerstartwithappidappversioneventobserver)|初始化Hummer|
|[loginWithUid](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hummerloginwithuidregiontokencompletion)|登录SDK|
|[joinRoom](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomservicejoinroomwithappextrasoptionscompletion)|进入房间|
|[leaveRoom](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomserviceleaveroomcompletion)|退出房间|
|[HMRPeerService.sendMessage](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrpeerservicesendmessagewithoptionstousercompletion)|发送点对点信令消息|
|[HMRRoomService.sendMessage](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomservicesendmessagewithoptionsinroomcompletion)|发送房间消息|
|[queryRoomAttributes](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomservicequeryroomattributescompletion)|查询指定房间的全部属性|
|[addOrUpdateMemberAttributes](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomserviceaddorupdatememberattributesinroomwithattributesoptionscompletion)|新增或更新用户在当前房间的用户属性|


## 联系我们

- 如果你想了解更多官方示例，可以参考[官方示例代码](https://github.com/Aivacom?tab=repositories)
- 完整的 API 文档见 [RTC官方文档](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/category.html) 和 [RTS官方文档](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/category.html)