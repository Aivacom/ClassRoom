# Android Tutorial for Education

中文版本：[简体中文](README.md)

This open source sample project demonstrates the related functions of the demo of the interactive live broadcast large class scene.

## 1 Project Description

The interactive live big class is a Demo example based on the educational scene. You can compile and run the sample code to experience it. The following functions are included in this sample project：

- Classroom management；
- Real-time audio and video interaction；
- Send and receive real-time messages；
- Whiteboard；

## 2 Environmental preparation

- Android Studio 3.0 or above
- Android SDK API level 16 or above
- Supports mobile devices with Android 4.1 or above

## 3 Run the sample program

This section mainly explains how to compile and run the sample code.

### Create a developer account and get AppId

Before compiling and starting the example program, you need to first obtain an available AppId:

1. Create a developer account in [Developer Platform](https://docs.aivacom.com/cloud/en/platform/console/registration_and_login/registration_and_login.html)
2. Go to the project management page and click the *Project management* menu in the left navigation bar to create your project. Refer to [Create and Manage Projects](https://docs.aivacom.com/cloud/en/platform/console/create_and_manage_projects/create_and_manage_projects.html)
3. Copy the AppId of your project

### Configure AppId and related tokens in the project

1. Find the directory sdk/src/main/res/values and find the string_configs.xml file
2. Fill in the AppID of your project in the `app_id` configuration in the string_configs.xml file
3. Fill in `sdk_token` in string_configs.xml, the method of obtaining Token can refer to [User Authentication](https://docs.aivacom.com/cloud/en/platform/other/user_auth.html) and [Generate Authentication Token ](https://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/common_functions/generate_token/generate_token_java.html)
4. Write `white_token` and` white_url` in string_configs.xml, please log in to [Herewhite] (https://console.herewhite.com/) official website

Note：
> If you have not deployed the Token server, it is recommended that you set the project to [AppID authentication mode](https://docs.aivacom.com/cloud/en/platform/console/create_and_manage_projects/create_and_manage_projects.html)

> If you do not need the whiteboard function, you can not enter the `white_token` and` white_url` parameters in the string_configs.xml file

### Launch the application

Open the project with Android Studio, connect to the device, compile and run.

You can also use Gradle to compile and run directly

## 4 SDK Instructions

### SDK version used

| SDK | Version |
|:----|:----|
| RTC | 2.8.2 |
| RTS | 3.1.5 |

### SDK API used

- RTC SDK

| API | Function |
|:-------------|:---------|
|[createEngine](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginecreateengine)|Create ThunderEngine and initialize ThunderEngine instance|
|[setRoomMode](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginesetroommode)|Set room mode|
|[setMediaMode](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginesetmediamode)|Set media mode|
|[setAudioConfig](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginesetaudioconfig)|It is used to set audio parameter and application scene|
|[setVideoEncoderConfig](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginesetvideoencoderconfig)|Set video encoding configuration|
|[joinRoom](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginejoinroom)|Join a room|
|[leaveRoom](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderengineleaveroom)|Leaving room indicates hang off or exiting conversation|
|[stopAllRemoteVideoStreams](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginestopallremotevideostreams)|Stop/Receive all remote videos|
|[stopRemoteVideoStream](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginestopremotevideostream)|Stop/Resume receiving video stream of a specified user|
|[stopAllRemoteAudioStreams](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginestopallremoteaudiostreams)|Stop/Resume receiving all remote audio streams|
|[stopRemoteAudioStream](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginestopremoteaudiostream)|Stop/Resume receiving audio stream of a specified user|
|[setRemoteVideoCanvas](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginesetremotevideocanvas)|Set the user position for co-hosting|
|[setLocalVideoCanvas](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginesetlocalvideocanvas)|Set local view. If this view is not set, the preview and publishing can also be enabled|
|[startVideoPreview](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginestartvideopreview)|Start video preview of local camera|
|[stopVideoPreview](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginestopvideopreview)|Stop video preview of local camera|
|[enableLocalVideoCapture](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderengineenablelocalvideocapture)|Enable/Disable local video capture|
|[stopLocalAudioStream](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginestoplocalaudiostream)|Enable/Disable the capture, encode and upstream of local audio|
|[stopLocalVideoStream](http://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/function.html#thunderenginestoplocalvideostream)|Disable/Enable local video sending|

- RTS SDK

| API | Function |
|:-------------|:---------|
|[init](http://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/function.html#hmrinit)|Initialization of Hummer SDK|
|[login](http://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/function.html#hmrlogin)|Switch to the context of a specific user|
|[join](http://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/function.html#roomservicejoin)|join a room|
|[leave](http://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/function.html#roomserviceleave)| leave a room|
|[PeerService.sendMessage](http://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/function.html#peerservicesendmessage)|Send P2P signaling messages|
|[RoomService.sendMessage](http://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/function.html#roomservicesendmessage)|Send room messages|
|[queryRoomAttributes](http://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/function.html#roomservicequeryroomattributes)|Query all attributes of specific rooms|
|[addOrUpdateMemberAttributes](http://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/function.html#roomserviceaddorupdatememberattributes)|Add or update user attributes in the current room|

## Contact us

- If you want to know more official examples, you can refer to [official sample code](https://github.com/Aivacom?tab=repositories)
- For the complete API documentation, see [RTC official documentation](https://docs.aivacom.com/cloud/en/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/category.html) and [RTS official documentation](https://docs.aivacom.com/cloud/en/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/category.html)