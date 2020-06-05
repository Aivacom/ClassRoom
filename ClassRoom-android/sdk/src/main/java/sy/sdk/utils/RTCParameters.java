package sy.sdk.utils;

import com.thunder.livesdk.ThunderRtcConstant;
import com.thunder.livesdk.ThunderVideoEncoderConfiguration;

public class RTCParameters {

    public int setArea;
    public int portrait;
    public int landscape;
    public int roomMode;
    public int mediaMode;
    public int scaleMode;
    public int sourceType;
    public int localmode;
    public ThunderVideoEncoderConfiguration yyVideoConfig;
    private int playType;
    private int publishMode;

    /**
     * 初始化参数列表
     */
    public void initParameters() {
        /**
         * 设置用户国家区域
         * THUNDER_AREA_DEFAULT:0 国内(默认值)
         * THUNDER_AREA_FOREIGN: 1 国外
         */
        setArea = ThunderRtcConstant.AreaType.THUNDER_AREA_DEFAULT;
        /**
         * 设置摄像头开播角度(横屏)
         */
        portrait = ThunderRtcConstant.ThunderVideoCaptureOrientation.THUNDER_VIDEO_CAPTURE_ORIENTATION_PORTRAIT;
        landscape = ThunderRtcConstant.ThunderVideoCaptureOrientation.THUNDER_VIDEO_CAPTURE_ORIENTATION_LANDSCAPE;

        /**
         * 视频编码配置参数类
         * playType（玩法）
         * publishMode（开播档位）
         */
        yyVideoConfig = new ThunderVideoEncoderConfiguration(playType, publishMode);
        publishMode = 101;
        playType = ThunderRtcConstant.ThunderPublishPlayType.THUNDERPUBLISH_PLAY_INTERACT;

        /**
         * 设置房间模式
         */
        roomMode = ThunderRtcConstant.RoomConfig.THUNDER_ROOMCONFIG_COMMUNICATION;

        /**
         * 设置媒体模式
         */
        mediaMode = ThunderRtcConstant.ThunderRtcProfile.THUNDER_PROFILE_NORMAL;

        /**
         * 视频显示拉伸模式
         */
        scaleMode = ThunderRtcConstant.ThunderVideoViewScaleMode.THUNDERVIDEOVIEW_SCALE_MODE_CLIP_TO_BOUNDS;

        /**
         * 本地视图的拉伸模式
         */
        localmode = ThunderRtcConstant.ThunderVideoRenderMode.THUNDER_RENDER_MODE_CLIP_TO_BOUNDS;

        /**
         * 设置音频开播模式
         */
        sourceType = ThunderRtcConstant.SourceType.THUNDER_PUBLISH_MODE_MIC;
    }


}
