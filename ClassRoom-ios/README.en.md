# iOS Tutorial for Objective-C - Education

中文版本：[简体中文](README.md)

This open source sample project demonstrates the related functions of the demo of the interactive live broadcast large class scene.

## 1 Project Description

The interactive live big class is a Demo example based on the educational scene. You can compile and run the sample code to experience it. The following functions are included in this sample project：

- Classroom management；
- Real-time audio and video interaction；
- Send and receive real-time messages；
- Whiteboard；

## 2 Environmental preparation

- XCode 10.0 +
- iOS 8.0 +
- iPhone Device

## 3 Run the sample program

This section mainly explains how to compile and run the sample code.

### Create a developer account and get AppId

Before compiling and starting the example program, you need to first obtain an available AppId:

1. Create a developer account in [Developer Platform](https://docs.aivacom.com/cloud/en/platform/console/registration_and_login/registration_and_login.html)
2. Go to the project management page and click the *Project management* menu in the left navigation bar to create your project. Refer to [Create and Manage Projects](https://docs.aivacom.com/cloud/en/platform/console/create_and_manage_projects/create_and_manage_projects.html)
3. Copy the AppId of your project

   
### Configure AppId and related tokens in the project

1. Find the SYAppConfig.plist file according to the directory SCClassRoom->Demo->AppConfig
2. Fill in the AppID of your project in the `app_id` configuration in the SYAppConfig.plist file
3. Fill in `sdk_token` in SYAppConfig.plist. For the method of obtaining Token, please refer to [User Authentication](https://docs.aivacom.com/cloud/en/platform/other/user_auth.html) and [Generate Authentication Token ](https://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/common_functions/generate_token/generate_token_java.html)
4. Fill in `white_url` and` white_token` in SYAppConfig.plist, please log in to [Herewhite](https://console.herewhite.com/) official website

Note：
> If you have not deployed a Token server, it is recommended that you set the project to [AppID authentication mode](https://docs.aivacom.com/cloud/en/platform/console/create_and_manage_projects/create_and_manage_projects.html)

> If you do not need the whiteboard function, you can not fill in the `white_url` and` white_token` parameters in the SYAppConfig.plist file

### Integrate dependent SDK

1. Install CocoaPods, enter the following command line in Terminal：  
    > brew install cocoapods  
* If you have installed CocoaPods and Homebrew in your system, you can skip this step.
* If Terminal displays -bash: brew: command not found, you need to install Homebrew before entering the command line. See the Homebrew installation method for details. 

2. Use the terminal to enter the sample code project directory and execute the 'pod update' command;
3. Use Xcode to open SCClassRoom.xcworkspace, connect the iPhone / iPad device, set a valid developer signature and BundleId to run;

## 4 SDK Instructions

### SDK version used

| SDK | Version |
|:----|:----|
| RTC | 2.8.1 |
| RTS | 3.1.5 |

### SDK API used

- RTC SDK

| API | Function |
|:-------------|:---------|
|[createEngine](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginecreateenginesceneiddelegate)|Create ThunderEngine and initialize ThunderEngine instance|
|[setRoomMode](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginesetroommode)|Set room scenario mode|
|[setMediaMode](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginesetmediamode)|Set media mode of SDK|
|[setAudioConfig](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginesetaudioconfigcommutmodescenariomode)|Set audio profiles|
|[setVideoEncoderConfig](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginesetvideoencoderconfig)|Set video encoder’s property|
|[joinRoom](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginejoinroomroomnameuid)|Join a room|
|[leaveRoom](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderengineleaveroom)|Leaving room indicates hang off or exiting conversation|
|[stopAllRemoteVideoStreams](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginestopallremotevideostreams)|Stop or receive all video streams|
|[stopRemoteVideoStream](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginestopremotevideostreamstopped)|Receive/Stop receiving specified video stream|
|[stopAllRemoteAudioStreams](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginestopallremoteaudiostreams)|Stop or receive all audio streams|
|[stopRemoteAudioStream](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginestopremoteaudiostreamstopped)|Receive/Stop receiving specified audio stream|
|[setRemoteVideoCanvas](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginesetremotevideocanvas)|Set remote user’s view|
|[setLocalVideoCanvas](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginesetlocalvideocanvas)|Set local view|
|[startVideoPreview](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginestartvideopreview)|Enable video preview|
|[stopVideoPreview](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginestopvideopreview)|Stop video preview|
|[enableLocalVideoCapture](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderengineenablelocalvideocapture)|Enable/Disable local video capture|
|[stopLocalAudioStream](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginestoplocalaudiostream)|Enabling/Disabling sending of local audio|
|[stopLocalVideoStream](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/function.html#thunderenginestoplocalvideostream)|Enable/Disable sending of local video stream|


- RTS SDK

| API | Function |
|:-------------|:---------|
|[startWithAppId](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hummerstartwithappidappversioneventobserver)|Initialize Hummer and start listening to Hummer status change|
|[loginWithUid](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hummerloginwithuidregiontokencompletion)|Log in to SDK|
|[joinRoom](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomservicejoinroomwithappextrasoptionscompletion)|join a room|
|[leaveRoom](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomserviceleaveroomcompletion)|leave a room|
|[HMRPeerService.sendMessage](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrpeerservicesendmessagewithoptionstousercompletion)|Send P2P signaling messages|
|[HMRRoomService.sendMessage](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomservicesendmessagewithoptionsinroomcompletion)|Send room messages|
|[queryRoomAttributes](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomservicequeryroomattributesbykeyscompletion)|Query specific attributes of specific rooms|
|[addOrUpdateMemberAttributes](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/function.html#hmrroomserviceaddorupdatememberattributesinroomwithattributesoptionscompletion)|Add or update user attributes in the current room|

## Contact us

- If you want to know more official examples, you can refer to [official sample code](https://github.com/Aivacom?tab=repositories)
- For the complete API documentation, see [RTC official documentation](https://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/iOS/v2.8.0/category.html) and [RTS official documentation](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/iOS/v3.1.3/category.html)