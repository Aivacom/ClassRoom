import Events from "events";

class IRender {
    constructor() {
        throw new Error('You have to declare your own custom render');
    }

    bind(view) {
        throw new Error('You have to declare your own custom render');
    }

    unbind() {
        throw new Error('You have to declare your own custom render');
    }

    drawFrame(width, height, data) {
        throw new Error('You have to declare your own custom render');
    }

    setContentMode(mode) {
        throw new Error('You have to declare your own custom render');
    }

    reSize() {
        throw new Error('You have to declare your own custom render');
    }
}

class RenderModes {
    static Unknown = 0;
    static WebGL = 1;
    static Software = 2;
    static CustomizedRender = 3;
}

class Errors {
    static ErrorCodes = {
        NotImplemented: -999
    };

    static NotImplementedError = new Error('You have to declare your own custom render');
}

class AudioMixingParameter {
    //音频地址。如果local为true，则是文件路径；为false，则是文件url地址
    url = "http://..../xxx.mp3";

    //是否是本地文件
    local = true;

    //背景音乐的播放次数
    cycle = 1;

    //是否循环播放背景音乐，与cycle冲突
    loop = true;

    //播放音乐的开始时间，单位ms
    playTime = 0;

    //是否用音乐替换麦克风，当该选项为true时，发布的流只有背景音乐，没有麦克风
    replace = false
}

class ITHAL {
    /**
     初始化
     @param appId 为应用程序开发者签发的 AppID
     @param sceneId 场景Id，自定义值，sdk不使用，可以用来进一步区分业务场景，体现在质量统计中；如果不需要，可以填0；
     @return 成功(0), 失败(<0)
     */
    initialize(appId, sceneId) {
        throw Errors.NotImplementedError;
    }

    /**
     销毁内部的IThunderEngine对象
     如果还要使用sdk需要重新调用initialize进行初始化
     */
    destroyEngine() {
        throw Errors.NotImplementedError;
    }

    /**
     设置区域;joinRoom前调用;国外用户必须调用，国内用户可以不调用（默认为国内）
     @param area 区域类型 0:国内，1:国外，2：reserved
     @return 成功(0), 失败(<0)
     */
    setArea(area) {
        throw Errors.NotImplementedError;
    }

    /**
     * 设置是否支持字符串UID
     * @param isNoneUint32  默认值:true，
     true:支持[A,Z],[a,z],[0,9],-,_等字符的排列组合，且长度不能超过64个字节
     false:只支持[0-9],且数值不大于32位无符号整型
     * @return 成功(0), 失败(<0)
     */
    setUse64bitUid(isNoneUint32) {
        throw Errors.NotImplementedError;
    }

    /**
     进入频道
     @param token
     @param roomName  房间名称（唯一）
     @param uid 用户id, 只支持[A,Z],[a,z],[0,9],-,_等字符的排列组合，且长度不能超过64个字节
     //使用了2.2及之前的用户，如果需要使用无符号32位uid，因兼容考虑，需要调用接口setUse64bitUid
     @return 成功(0), 失败(<0)
     */
    joinRoom(token, roomName, uid) {
        throw Errors.NotImplementedError;
    }

    /**
     离开房间
     @return 成功(0), 失败(<0)
     */
    leaveRoom() {
        throw Errors.NotImplementedError;
    }

    /**
     更新token
     @param token
     @return 成功(0), 失败(<0)
     */
    updateToken(token) {
        throw Errors.NotImplementedError;
    }

    sendMessageToChannel(channelId, msgText, msgType, reliable) {
        throw Errors.NotImplementedError;
    }

    sendMessageToUser(userId, msgText, msgType, reliable) {
        throw Errors.NotImplementedError;
    }

    /**
     设置频道模式
     @param profile
     @param roomConfig
     @return 成功(0), 失败(<0)
     */
    setRoomConfig(profile, roomConfig) {
        throw Errors.NotImplementedError;
    }

    /**
     打开音频并开播
     @return 成功(0), 失败(<0)
     */
    enableAudioEngine() {
        throw Errors.NotImplementedError;
    }

    /**
     关闭音频停播
     @return 成功(0), 失败(<0)
     */
    disableAudioEngine() {
        throw Errors.NotImplementedError;
    }

    /**
     设置音频模式
     @param profile
     @param commutMode
     @param scenarioMode
     @return 成功(0), 失败(<0)
     */
    setAudioConfig(profile, commutMode, scenarioMode) {
        throw Errors.NotImplementedError;
    }

    /**
     关闭自己的音频上行，使房间内的其他用户听不到自己；不影响麦克风采集；
     @param stop true：关闭上行； false：打开上行；
     */
    stopLocalAudioStream(stop) {
        throw Errors.NotImplementedError;
    }

    /**
     禁止所有远端音频
     @param stop true：关闭； false：打开；
     @return 成功(0), 失败(<0)
     */
    stopAllRemoteAudioStreams(stop) {
        throw Errors.NotImplementedError;
    }

    /**
     禁止指定用户音频
     @param uid 用户id
     @param stop true：关闭； false：打开；
     @return 成功(0), 失败(<0)
     */
    stopRemoteAudioStream(uid, stop) {
        throw Errors.NotImplementedError;
    }

    /**
     设置远程某个用户在本地的播放音量
     @param uid 用户id
     @param volume 音量[0--100]
     @return 成功(0), 失败(<0)
     */
    setPlayVolume(uid, volume) {
        throw Errors.NotImplementedError;
    }

    /**
     启用说话者音量提示
     @param interval <=0:禁用音量提示功能; >0 返回音量提示的间隔,单位毫秒,建议大于200毫秒;
     @param smooth 暂未实现;
     @return 成功(0), 失败(<0)
     */
    setAudioVolumeIndication(interval, smooth) {
        throw Errors.NotImplementedError;
    }

    /**
     开启或停止声卡采集
     @param enabled:boolean
     @return 成功(0), 失败(<0)
     **/
    enableLoopbackRecording(enabled) {
        throw Errors.NotImplementedError;
    }

    /**
     开始录制
     @param fileName 录制文件名，不包含扩展名，扩展名根据fileType生成；
     @param fileType 文件格式 0:wav 1:aac 2:mp3
     @param quality 录制质量 0:low 1:medium 2:high
     @return 成功(0), 失败(<0)
     */
    startAudioRecording(fileName, fileType, quality) {
        throw Errors.NotImplementedError;
    }

    /**
     停止录制
     @return 成功(0), 失败(<0)
     */
    stopAudioRecording() {
        throw Errors.NotImplementedError;
    }

    /**
     设置麦克风音量(可以增益到4倍）
     @param volume 音量 取值范围[0--400]
     @return 成功(0), 失败(<0)
     */
    adjustRecordingSignalVolume(volume) {
        throw Errors.NotImplementedError;
    }

    /**
     设置播放音量（可以增益到4倍）
     @param volume 音量 取值范围[0--400]
     @return 成功(0), 失败(<0)
     */
    adjustPlaybackSignalVolume(volume) {
        throw Errors.NotImplementedError;
    }

    /**
     设置SDK的输出log文件目录。应用程序必须保证指定的目录可写。
     @param filePath 完整的日志文件目录
     @return 成功(0), 失败(<0)
     */
    setLogFilePath(filePath) {
        throw Errors.NotImplementedError;
    }

    /**
     设置日志过滤器 (此接口暂未实现)
     @param filter 日志等级
     @return 成功(0), 失败(<0)
     */
    setLogLevel(filter) {
        throw Errors.NotImplementedError;
    }

    /**
     启用视频模块
     @return 成功(0), 失败(<0)
     */
    enableVideoEngine() {
        throw Errors.NotImplementedError;
    }

    /**
     关闭视频模块
     @return 成功(0), 失败(<0)
     */
    disableVideoEngine() {
        throw Errors.NotImplementedError;
    }

    /**
     设置视频编码配置
     @param config
     @return 成功(0), 失败(<0)
     */
    setVideoEncoderConfig(config) {
        throw Errors.NotImplementedError;
    }

    /**
     设置视图
     @param uid 用户id
     @param view
     @param mode 显示模式 0:拉伸铺满 1:适应窗口 2:裁剪铺满
     */
    setVideoCanvas(uid, view, mode) {
        throw Errors.NotImplementedError;
    }

    /**
     取消设置视图
     @param uid 用户id
     */
    cancelVideoCanvas(uid) {
        throw Errors.NotImplementedError;
    }

    /**
     设置视图显示模式
     @param uid 用户id
     @param mode VideoRenderMode 显示模式
     @return 成功(0), 失败(<0)
     */
    setCanvasScaleMode(uid, mode) {
        throw Errors.NotImplementedError;
    }

    /**
     开启视频预览
     @return 成功(0), 失败(<0)
     */
    startVideoPreview() {
        throw Errors.NotImplementedError;
    }

    /**
     停止视频预览
     @return 成功(0), 失败(<0)
     */
    stopVideoPreview() {
        throw Errors.NotImplementedError;
    }

    /**
     设置视频的FPS
     @param fps 范围[10-100]
     @return 成功(0), 失败(<0)
     */
    setVideoRenderFPS(fps) {
        throw Errors.NotImplementedError;
    }

    /**
     开关本地视频采集
     @param enabled 打开或关闭
     @return 成功(0), 失败(<0)
     */
    enableLocalVideoCapture(enabled) {
        throw Errors.NotImplementedError;
    }

    /**
     开关本地视频发送
     @param stop 打开或关闭
     @return 成功(0), 失败(<0)
     */
    stopLocalVideoStream(stop) {
        throw Errors.NotImplementedError;
    }

    /**
     停止／接收指定远端用户的视频流
     @param uid 用户id
     @param stop 打开或关闭
     @return 成功(0), 失败(<0)
     */
    stopRemoteVideoStream(uid, stop) {
        throw Errors.NotImplementedError;
    }

    /**
     接收／停止接收所有远端视频流
     @param stop 打开或关闭
     @return 成功(0), 失败(<0)
     */
    stopAllRemoteVideoStreams(stop) {
        throw Errors.NotImplementedError;
    }

    /**
     * 设置OrangeFilter授权信息
     * @param serialNumber 授权序列号
     * @param licensePath 授权文件缓存路径
     * @return 成功(0), 失败(<0)
     */
    setOrangeFilterLicence(serialNumber, licensePath) {
        throw Errors.NotImplementedError;
    }

    /**
     * 设置美颜参数
     * @param bEnable 打开或关闭
     * @param option BeautyOptions
     * @return 成功(0), 失败(<0)
     */
    setBeautyEffectOptions(bEnable, option) {
        throw Errors.NotImplementedError;
    }

    /**
     * 添加本地视频水印
     @param watermark ThunderBoltImage
     水印图片信息，该接口的URL仅支持本地绝对路径;
     当前只支持一个水印，后添加的水印会替换掉之前添加的水印
     只支持24位和32位的图片文件；SDK会对图片按设置的宽度进行转换
     @return 成功(0), 失败(<0)
     */
    setVideoWatermark(watermark) {
        throw Errors.NotImplementedError;
    }

    /**
     * 清除已添加的本地视频水印
     该方法清除setVideoWatermark设置的所有水印
     @return 成功(0), 失败(<0)
     */
    removeVideoWatermarks() {
        throw Errors.NotImplementedError;
    }

    /**
     * 设置外部音频采集参数
     @param bEnable 是否启动音频采集
     @param option 外部音频采集参数 bEnable为false时可填null
     @return 成功(0), 失败(<0)
     */
    setCustomAudioSource(bEnable, option) {
        throw Errors.NotImplementedError;
    }

    /**
     * 推送外部音频帧
     @param pData PCM音频帧数据  Uint8Array
     @param timeStamp 采集时间戳
     @return 成功(0), 失败(<0)
     */
    pushCustomAudioFrame(pData, timeStamp) {
        throw Errors.NotImplementedError;
    }

    /**
     * 设置外部视频采集参数
     @param bEnable 是否启动外部视频
     @param option 外部视频采集参数 bEnable为false时可填null

     @return 成功(0), 失败(<0)
     */
    setCustomVideoSource(bEnable, option) {
        throw Errors.NotImplementedError;
    }

    /**
     * 推送外部视频帧
     @param data 视频数据 array[]
     如yuv数据：[y data:Uint8Array,u data:Uint8Array,v data:Uint8Array]
     如rgb数据：[rgb data:Uint8Array]
     @param linesize 数据中的缓冲区的行宽度 array[]
     如yuv数据：[linesize y:integer,linesize u:integer,linesize v:integer]
     如rgb数据：[linesize:integer]
     @param timestamp 采集时间戳
     @return 成功(0), 失败(<0)
     */
    pushCustomVideoFrame(data, linesize, timestamp) {
        throw Errors.NotImplementedError;
    }

    /**
     * 添加源流推流地址 【最多支持5个推流地址】
     开播之后会服务器会将源流推到对应的URL上
     需要进频道后才能调用，退出频道会清空该配置
     @param url 推流地址，格式为RTMP，不支持中文等特殊字符
     @return 成功(0), 失败(<0)
     */
    addPublishOriginStreamUrl(url) {
        throw Errors.NotImplementedError;
    }

    /**
     * 删除源流推流地址
     @param url 要删除的推流地址
     @return 成功(0), 失败(<0)
     */
    removePublishOriginStreamUrl(url) {
        throw Errors.NotImplementedError;
    }

    /**
     * 添加/更新转码任务 【同一频道最大支持5个转码任务】
     开播之后会服务器按设置的画布进行转码并推流(如有设置)
     需要进频道后才能调用，退出频道会清空该配置
     @param taskId 转码任务标识，由用户管理，频道内唯一，只支持[A,Z],[a,z],[0,9],-,_，等字符的排列组合，且长度不能超过64个字节
     @param transcodingCfg 具体的转码布局

     @return 成功(0), 失败(<0)
     */
    setLiveTranscodingTask(taskId, transcodingCfg) {
        throw Errors.NotImplementedError;
    }

    /**
     * 删除转码任务
     @param taskId:string 转码任务标识
     @return 成功(0), 失败(<0)
     */
    removeLiveTranscodingTask(taskId) {
        throw Errors.NotImplementedError;
    }

    /**
     * 添加转码流的推流地址 【同一转码任务最多支持5个推流地址】
     需要进频道后才能调用，退出频道会清空该配置
     @param taskId 转码任务标识
     @param url 推流地址，格式为RTMP，不支持中文等特殊字符
     @return 成功(0), 失败(<0)
     */
    addPublishTranscodingStreamUrl(taskId, url) {
        throw Errors.NotImplementedError;
    }

    /**
     * 删除转码流的推流地址
     @param taskId 转码任务标识
     @param url 要删除的推流地址
     @return 成功(0), 失败(<0)
     */
    removePublishTranscodingStreamUrl(taskId, url) {
        throw Errors.NotImplementedError;
    }

    /**
     * 订阅对应房间的用户的流【跨频道订阅】
     需要进频道后才能调用，退出频道会清空该配置
     @param roomId 房间号【只支持[A,Z],[a,z],[0,9],-,_，等字符的排列组合，且长度不能超过64个字节】
     @param uid 用户id
     @return 成功(0), 失败(<0)
     */
    addSubscribe(roomId, uid) {
        throw Errors.NotImplementedError;
    }

    /**
     * 删除订阅对应房间的用户的流
     @param roomId 房间号【只支持[A,Z],[a,z],[0,9],-,_，等字符的排列组合，且长度不能超过64个字节】
     @param uid 用户id
     @return 成功(0), 失败(<0)
     */
    removeSubscribe(roomId, uid) {
        throw Errors.NotImplementedError;
    }

    /** 设置用户属性
     @param name 需要设置的属性名
     @param value 需要设置的属性值。
     @return 成功(0), 失败(<0)
     * */
    setUserAttributes(name, value) {
        throw Errors.NotImplementedError;
    }

    /** 删除用户属性
     @param names 需要删除的属性名，字符串数组
     @return 成功(0), 失败(<0)
     * */
    deleteUserAttributes(names) {
        throw Errors.NotImplementedError;
    }

    /** 根据属性获取用户列表
     @param name 属性名
     @param value 属性值。
     @return 成功(0), 失败(<0)
     * */
    getUserListByAttribute(name, value) {
        throw Errors.NotImplementedError;
    }

    getUserList() {
        throw Errors.NotImplementedError;
    }

    /**
     * 是否打开跟websdk兼容
     @param enabled[IN] 是否开启兼容，默认关闭
     @return 成功(0), 失败(<0)
     */
    enableWebSdkCompatibility(enabled) {
        throw Errors.NotImplementedError;
    }

    /**
     * 设置本地摄像头镜像
     @param mode 镜像模式 ThunderVideoMirrorMode
     @return 成功(0), 失败(<0)
     */
    setLocalVideoMirrorMode(mode) {
        throw Errors.NotImplementedError;
    }

    /**
     * 开始窗口捕捉
     @param hWnd 窗口句柄
     @param rect THUNDER_RECT can be null
     */
    startScreenCaptureForHwnd(hWnd, rect) {
        throw Errors.NotImplementedError;
    }

    /**
     * 开始屏幕捕捉
     @param iscreenId 屏幕id,多显示屏进使用 default 0
     @param rect THUNDER_RECT 指定捕捉的子区域, 坐标为指定显示器的相对坐标. 为NULL时捕捉整个显示器区域
     */
    startScreenCaptureForScreen(iscreenId, rect) {
        throw Errors.NotImplementedError;
    }

    /**
     * 更新屏幕捕捉区域
     @param rect THUNDER_RECT 指定捕捉的子区域, 坐标为指定显示器或窗口的相对坐标. 为null时捕捉整个显示器或窗口区域
     */
    updateScreenCaptureRect(rect) {
        throw Errors.NotImplementedError;
    }

    /**
     * 停止屏幕分享
     */
    stopScreenCapture() {
        throw Errors.NotImplementedError;
    }

    /**
     * @brief    暂停 捕捉桌面或窗口
     */
    pauseScreenCapture() {
        throw Errors.NotImplementedError;
    }

    /**
     * @brief    恢复 捕捉桌面或窗口
     */
    resumeScreenCapture() {
        throw Errors.NotImplementedError;
    }

    /**
     枚举音频输入设备
     @return devices: array
     */
    enumAudioInputDevices() {
        throw Errors.NotImplementedError;
    }

    /**
     设置音频输入设备
     @param id 设备id:string
     @return 成功(0), 失败(<0)
     */
    setAudioInputtingDevice(id) {
        throw Errors.NotImplementedError;
    }

    /**
     获取当前选择的输入设备
     @return id:string
     */
    getAudioInputtingDevice() {
        throw Errors.NotImplementedError;
    }

    /**
     设置当前音频输入设备音量
     @param volume 音量[0-100]
     @return 成功(0), 失败(<0)
     */
    setAudioInputtingVolume(volume) {
        throw Errors.NotImplementedError;
    }

    /**
     获取当前音频输入设备音量
     @return volume [0-100]  < 0 表示错误
     */
    getAudioInputtingVolume() {
        throw Errors.NotImplementedError;
    }

    /**
     静音当前音频输入设备
     @param mute
     @return 成功(0), 失败(<0)
     */
    setAudioInputtingMute(mute) {
        throw Errors.NotImplementedError;
    }

    /**
     获取当前音频输入设备的静音状态
     @return mute
     */
    getAudioInputtingMute() {
        throw Errors.NotImplementedError;
    }

    /**
     启动当前音频输入设备测试
     @param indicationInterval 检测周期，可不填  默认0
     @return 成功(0), 失败(<0)
     */
    startAudioInputDeviceTest(indicationInterval) {
        throw Errors.NotImplementedError;
    }

    /**
     停止当前音频输入设备测试
     @return 成功(0), 失败(<0)
     */
    stopAudioInputDeviceTest() {
        throw Errors.NotImplementedError;
    }

    /**
     枚举音频播放设备
     @return devices array
     */
    enumAudioOutputDevices() {
        throw Errors.NotImplementedError;
    }

    /**
     设置音频输出设备
     @param id 设备id:string
     @return 成功(0), 失败(<0)
     */
    setAudioOutputtingDevice(id) {
        throw Errors.NotImplementedError;
    }

    /**
     获取当前选择的音频输出设备
     @return id:string
     */
    getAudioOutputtingDevice() {
        throw Errors.NotImplementedError;
    }

    /**
     设置当前音频输出设备音量
     @param volume 音量[0-100]
     @return 成功(0), 失败(<0)
     */
    setAudioOuttingVolume(volume) {
        throw Errors.NotImplementedError;
    }

    /**
     获取当前音频输出设备音量
     @return volume [0-100]  < 0 表示错误
     */
    getAudioOuttingVolume() {
        throw Errors.NotImplementedError;
    }

    /**
     静音当前音频输出设备
     @param mute
     @return 成功(0), 失败(<0)
     */
    setAudioOutputtingMute(mute) {
        throw Errors.NotImplementedError;
    }

    /**
     获取当前音频输出设备的静音状态
     @return mute
     */
    getAudioOutputtingMute() {
        throw Errors.NotImplementedError;
    }

    /**
     启动当前音频输出设备测试
     @param audioFileName 音频文件名称
     @param indicationInterval 检测周期，可不填  默认0
     @return 成功(0), 失败(<0)
     */
    startAudioOutputDeviceTest(audioFileName, indicationInterval) {
        throw Errors.NotImplementedError;
    }

    /**
     停止当前音频输出设备测试
     @return 成功(0), 失败(<0)
     */
    stopAudioOutputDeviceTest() {
        throw Errors.NotImplementedError;
    }

    /**
     启动麦克风增强
     @enabled [IN] true:启动麦克风增强；false:关闭麦克风增强；默认为false
     @return 成功(0), 失败(<0)
     @remark 需要initialize后调用，仅在destroyEngine时重置
     */
    enableAudioMicEnhancement(enabled) {
        throw Errors.NotImplementedError;
    }

    /**
     启动麦克风降噪
     @enabled [IN] true:启动麦克风降噪；false:关闭麦克风降噪；默认为false
     @return 成功(0), 失败(<0)
     @remark 需要initialize后调用，仅在destroyEngine时重置
     */
    enableAudioMicDenoise(enabled) {
        throw Errors.NotImplementedError;
    }

    /**
     启动回声消除
     @enabled [IN] true:启动回声消除；false:关闭回声消除；默认为false
     @return 成功(0), 失败(<0)
     @remark 需要initialize后调用，仅在destroyEngine时重置
     */
    enableAudioAEC(enabled) {
        throw Errors.NotImplementedError;
    }

    /**
     开启混音
     @enabled parameter 混音参数
     @return void
     @remark 需要initialize后调用，仅在destroyEngine时重置
     */
    startAudioMixing(parameter) {
        throw Errors.NotImplementedError;
    }

    /**
     停止混音
     @return void
     @remark 停止背景音乐与麦克风的混音，在startAudioMixing之后调用。
     */
    stopAudioMixing() {
        throw Errors.NotImplementedError;
    }

    /**
     枚举视频设备
     @return devices array
     */
    enumVideoDevices() {
        throw Errors.NotImplementedError;
    }

    /**
     打开视频输入设备
     @param index 设备索引
     @return 成功(0), 失败(<0)
     */
    startVideoDeviceCapture(index) {
        throw Errors.NotImplementedError;
    }

    /**
     关闭当前打开的视频输入设备
     @return 成功(0), 失败(<0)
     */
    stopVideoDeviceCapture() {
        throw Errors.NotImplementedError;
    }
}

export default ITHAL;
