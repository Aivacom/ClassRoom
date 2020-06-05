package sy.sdk.service;
import com.thunder.livesdk.ThunderVideoCanvas;
import com.thunder.livesdk.ThunderVideoEncoderConfiguration;

public interface RtcService {
    /**
     * 设置用户国家区域
     */
    int setArea(int area);

    /**
     * 设置媒体模式
     */
    int setMediaMode(int mode);

    /**
     * 设置房间模式
     */
    int setRoomMode(int mode);

    /**
     * 设置摄像头开播角度(横屏/竖屏)
     */
    int setVideoCaptureOrientation(int orientation);

    /**
     * 设置音频开播模式
     */
    void setAudioSourceType(int sourceType);

    /**
     * 关闭/打开本地音频采集编码和上行,需在进房间joinRoom成功后调用该方法
     */
    int stopLocalAudioStream(boolean stop);

    /**
     * 停止/接收所有远端音频数据
     */
    int stopAllRemoteAudioStreams(boolean stop);

    /**
     * 停止/接收指定用户音频数据
     */
    int stopRemoteAudioStream(String uid, boolean stop);

    /**
     * 设置视频编码配置
     */
    int setVideoEncoderConfig(ThunderVideoEncoderConfiguration yyVideoConfig);

    /**
     * 设置本地视图
     */
    int setLocalVideoCanvas(ThunderVideoCanvas local);

    /**
     * 开/关本地视频采集
     */
    int enableLocalVideoCapture(boolean enable);

    /**
     * 开启本机摄像头视频预览
     */
    int startVideoPreview();

    /**
     * 停止本机摄像头视频预览
     */
    int stopVideoPreview();

    /**
     * 设置本地视图的拉伸模式
     */
    int setLocalCanvasScaleMode(int mode);

    /**
     * 停止/开启本地视频发送
     */
    int stopLocalVideoStream(boolean stop);

    /**
     * 停止／接收所有远端视频
     */
    int stopAllRemoteVideoStreams(boolean stop);

    /**
     * 停止/接收指定的远端用户视频
     */
    int stopRemoteVideoStream(String uid, boolean stop);

    /**
     * 设置远端指定视图的拉伸模式
     */
    int setRemoteCanvasScaleMode(String uid, int mode);

    /**
     * 设置远端视频的渲染视图
     */
    int setRemoteVideoCanvas(ThunderVideoCanvas remote);

    /**
     * 设置日志文件路径（打开日志，存储日志信息）
     */
    int setLogFilePath(String filePath);

    /**
     * 设置日志级别
     */
    int setLogLevel(int filter);

}
