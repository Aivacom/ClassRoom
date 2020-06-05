# Electron Tutorial for Education

中文版本：[简体中文](README.zh.md)

This open source sample project demonstrates the related functions of the demo of the interactive live broadcast large class scene.

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

1. Create a developer account in [Developer Platform](https://docs.aivacom.com/cloud/cn/platform/console/registration_and_login/registration_and_login.html)
2. Go to the project management page and click the *Project management* menu in the left navigation bar to create your project. Refer to [Create and Manage Projects](https://docs.aivacom.com/cloud/cn/platform/console/create_and_manage_projects/create_and_manage_projects.html)
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

## Contact us

- If you want to know more official examples, you can refer to [official sample code](https://github.com/Aivacom?tab=repositories)
- For the complete API documentation, see [RTC official documentation](https://docs.aivacom.com/cloud/cn/product_category/rtc_service/rt_video_interaction/api/Android/v2.8.0/category.html) and [RTS official documentation](https://docs.aivacom.com/cloud/cn/product_category/rtm_service/instant_messaging/api/Android/v3.1.4/category.html)
