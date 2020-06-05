# Electron Tutorial for Education

English Version： [English](README.md)

这个开源示例项目演示了互动直播大班课场景Dmeo的相关功能。

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
    "build": true,    				//是否在npm install时进行自动编译
    "electron_version": "6.0.9",   //你的项目使用的electron版本号 默认6.0.9
    "msvs_version":"2015"			//编译使用的vs版本号，默认2015
  }
  ```
  windows配置命令[target是你的项目使用的electron版本号，msvs_version是你安装的vs版本号，也可以指定安装2015的编译环境：`example npm install --g --production windows-build-tools --vs2015]`：

  执行 `cd node_modules/thunder-node-sdk`

  执行 `node-gyp configure --target=6.0.9 --msvs_version=2015 --arch=ia32 --dist-url=https://electronjs.org/headers`

  配置完成就可以进行编译了：

  `node-gyp build`

  编译之后回到项目根目录运行`npm run dev`即可看到效果

## 联系我们

- 如果你想了解更多官方示例，可以参考[官方示例代码](https://github.com/Aivacom?tab=repositories)
- 完整的 API 文档见 [RTC官方文档](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Web/v2.4.0/category.html) 和 [RTS官方文档](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/JS/v3.1.3/category.html)
