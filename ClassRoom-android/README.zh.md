# Android Tutorial for Education

English Version： [English](README.md)

这个开源示例项目演示了互动直播大班课场景Demo的相关功能。

## 1 项目简介

互动直播大班课是基于教育场景的一个Demo示例，大家可以编译运行示例代码进行体验。在这个示例项目中包含了以下功能：

- 课堂管理；
- 实时音视频互动；
- 收发实时消息；
- 白板；

## 2 环境准备

- Android Studio 3.0 或以上版本
- Android SDK API 等级 16 或以上
- 支持 Android 4.1 或以上版本的移动设备

## 3 运行示例程序

本节主要讲解了如何编译和运行示例代码。

### 创建开发者账号并获取AppId

在编译和启动实例程序前，您需要首先获取一个可用的AppId:

1. 在[开发者平台](https://docs.aivacom.com/cloud/cn/platform/console/registration_and_login/registration_and_login.html)创建一个开发者账号
2. 进入项目管理页面，点击左部导航栏的 *项目管理* 菜单，创建您的项目。可参考[创建和管理项目](https://docs.aivacom.com/cloud/cn/platform/console/create_and_manage_projects/create_and_manage_projects.html)
3. 复制您项目的AppId

### 在项目中配置AppId及相关Token

1. 找到目录 sdk/src/main/res/values 找到 string_configs.xml 文件
2. 将您项目的 AppID 填写在 string_configs.xml 文件中的 `app_id` 配置中
3. 在 string_configs.xml 中填写 `sdk_token` ，获取 Token 的方法可参考[用户鉴权](https://docs.aivacom.com/cloud/cn/platform/other/user_auth.html)和[生成鉴权Token](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/common_functions/generate_token/generate_token_java.html)
4. 在 string_configs.xml 中写入 `white_token` 和 `white_url` , 请登录[Herewhite](https://console.herewhite.com/)官网获取

注意：
> 如果您未部署Token服务器，建议您将项目设置为[AppID鉴权模式](https://docs.aivacom.com/cloud/cn/platform/console/create_and_manage_projects/create_and_manage_projects.html)

> 如果您不需要白板功能，可以不在 string_configs.xml 文件中输入 `white_token` 和 `white_url` 参数  

### 启动应用程序

用 Android Studio 打开该项目，连上设备，编译并运行。

也可以使用 Gradle 直接编译运行

## 联系我们

- 如果你想了解更多官方示例，可以参考[官方示例代码](https://github.com/Aivacom?tab=repositories)
- 完整的 API 文档见 [RTC官方文档](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/category.html) 和 [RTS官方文档](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/category.html)