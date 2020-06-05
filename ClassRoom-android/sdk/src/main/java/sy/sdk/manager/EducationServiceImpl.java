package sy.sdk.manager;


import android.content.Context;
import com.hummer.model.Message;
import com.thunder.livesdk.ThunderVideoCanvas;
import java.util.Map;
import java.util.Set;
import sy.sdk.listener.SdkEventListener;
import sy.sdk.utils.RTCParameters;

public class EducationServiceImpl implements EducationService {

    private CoreServiceImpl serviceManager;
    private RTCParameters rtcParameters;

    private EducationServiceImpl() {

    }

    private static volatile EducationServiceImpl instances = null;
    public static EducationServiceImpl getInstances() {
        if (instances == null) {
            synchronized (EducationServiceImpl.class) {
                if (instances == null) {
                    instances = new EducationServiceImpl();
                }
            }
        }
        return instances;
    }

    /**
     * 初始化
     */
    @Override
    public void init(Context context, String appid, String token, SdkEventListener listener) {
        serviceManager = CoreServiceImpl.getInstance();
        serviceManager.setSdkEventListener(listener);
        serviceManager.init(context, appid, token);
        rtcParameters = new RTCParameters();
        rtcParameters.initParameters();
    }

    /**
     * 加入房间
     */
    @Override
    public void joinRoom(String roomId, long uid) {
        serviceManager.setArea(rtcParameters.setArea);
        serviceManager.setRoomMode(rtcParameters.roomMode);
        serviceManager.setMediaMode(rtcParameters.mediaMode);
        serviceManager.joinRoom(roomId, uid);
    }

    /**
     * 离开房间
     */
    @Override
    public void leaveRoom() {
        CoreServiceImpl.getInstance().leaveRoom();
    }

    /**
     * 设置远端视频的渲染视图
     */
    @Override
    public void setRemoteVideoCanvas(Object mView, String mUid, int mSeatIndex) {
        ThunderVideoCanvas remote = new ThunderVideoCanvas(mView, rtcParameters.scaleMode, mUid, mSeatIndex);
        serviceManager.setRemoteVideoCanvas(remote);
        serviceManager.setRemoteCanvasScaleMode(mUid, rtcParameters.scaleMode);
    }

    /**
     * 设置本地视频的渲染视图
     */
    @Override
    public void setLocalVideoCanvas(Object mView, String mUid, int mSeatIndex) {
        ThunderVideoCanvas local = new ThunderVideoCanvas(mView, rtcParameters.localmode, mUid, mSeatIndex);
        serviceManager.setLocalVideoCanvas(local);
        serviceManager.setLocalCanvasScaleMode(rtcParameters.localmode);
    }

    /**
     * 停止/接收指定视频数据
     */
    @Override
    public void stopRemoteVideoStream(String uid, boolean stop) {
        serviceManager.stopRemoteVideoStream(uid, stop);
    }

    /**
     * 停止/接收指定用户音频数据
     */
    @Override
    public void stopRemoteAudioStream(String uid, boolean stop) {
        serviceManager.stopRemoteAudioStream(uid, stop);
    }

    /**
     * 停止/接收所有远端音频数据
     */
    @Override
    public void stopAllRemoteAudioStreams(boolean stop) {
        serviceManager.stopAllRemoteAudioStreams(stop);
    }

    /**
     * 停止/接收所有远端视频数据
     */
    @Override
    public void stopAllRemoteVideoStreams(boolean stop) {
        serviceManager.stopAllRemoteVideoStreams(stop);
    }

    /**
     * 开播
     */
    @Override
    public boolean startUpMicrophone() {
        serviceManager.setAudioSourceType(rtcParameters.sourceType);
        int orientation = serviceManager.setVideoCaptureOrientation(rtcParameters.landscape);
        int localAudio = serviceManager.stopLocalAudioStream(false);
        int config = serviceManager.setVideoEncoderConfig(rtcParameters.yyVideoConfig);
        int localVideo = serviceManager.enableLocalVideoCapture(true);
        int startVideo = serviceManager.startVideoPreview();
        int stopLocalVideo = serviceManager.stopLocalVideoStream(false);
        // 镜像需要讨论serviceManager.setLocalVideoMirrorMode();
        return orientation == 0 && localAudio == 0 && config == 0 && localVideo == 0 && startVideo == 0
                && stopLocalVideo == 0;
    }

    /**
     * 停播
     */
    @Override
    public boolean stopDownMicrophone() {
        int stoplocalAudio = serviceManager.stopLocalAudioStream(true);
        int enableLocalVideo = serviceManager.enableLocalVideoCapture(false);
        int stopVideoPreview = serviceManager.stopVideoPreview();
        int stopLocalVideo = serviceManager.stopLocalVideoStream(true);
        return stoplocalAudio == 0 && enableLocalVideo == 0 && stopVideoPreview == 0 && stopLocalVideo == 0;
    }

    /**
     * 发送P2P信令消息
     */
    @Override
    public void sendUnicastMessage(Message message, long userid) {
        serviceManager.sendUnicastMessage(userid, message);
    }

    /**
     * 发送广播信令消息
     */
    @Override
    public void sendBroadcastMessage(String type, String data) {
        serviceManager.sendBroadcastMessage(type, data);
    }

    /**
     * 获取房间成员列表
     */
    @Override
    public void queryMembers() {
        serviceManager.queryMembers();
    }

    /**
     * 更新指定房间的属性：属性存在则更新；属性不存在则添加；
     */
    @Override
    public void addOrUpdateRoomAttributes(String key, String value) {
        serviceManager.addOrUpdateRoomAttributes(key, value);
    }


    /**
     * 设置用户在当前房间的信息
     */
    @Override
    public void addOrUpdateMemberAttributes(long userId, Map<String, String> attributes) {
        serviceManager.addOrUpdateMemberAttributes(userId, attributes);
    }

    /**
     * 删除用户在当前房间的所有信息
     */
    @Override
    public void clearMemberAttributes(long userId) {
        serviceManager.clearMemberAttributes(userId);
    }

    /**
     * 删除指定房间的指定属性
     */
    @Override
    public void deleteRoomAttributes(Set<String> keys) {
        serviceManager.deleteRoomAttributes(keys);
    }

    /**
     * 查询指定房间的指定属性
     */
    @Override
    public void queryRoomAttributesByKeys(Set<String> keys) {
        serviceManager.queryRoomAttributesByKeys(keys);
    }

    /**
     * 查询指定房间内的全部属性
     */
    @Override
    public void queryRoomAttributes() {
        serviceManager.queryRoomAttributes();
    }

    /**
     * 查询用户在房间的指定属性
     */
    @Override
    public void queryMemberAttributesByKeys(long uid, Set<String> keys) {
        serviceManager.queryMemberAttributesByKeys(uid, keys);
    }

    /**
     * 销毁实例对象
     */
    @Override
    public void destroyEngine() {
        serviceManager.destroyEngine();
    }
}
