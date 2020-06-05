package sy.sdk.manager;

import android.content.Context;

import com.hummer.model.Message;
import java.util.Set;
import sy.sdk.listener.SdkEventListener;
import java.util.Map;

public interface EducationService {
    /**
     * 创建Engine实例
     */
    void init(Context context, String appid, String token, SdkEventListener listener);

    /**
     * 加入房间
     */
    void joinRoom(String roomId, long uid);

    /**
     * 离开房间
     */
    void leaveRoom();

    /**
     * 设置远端视图
     */
    void setRemoteVideoCanvas(Object mView, String mUid, int mSeatIndex);

    /**
     * 设置本地视图
     */
    void setLocalVideoCanvas(Object mView,  String mUid, int mSeatIndex);

    /**
     * 开启/停止指定视频流
     */
    void stopRemoteVideoStream(String uid, boolean stop);

    /**
     * 开启/停止指定音频流
     */
    void stopRemoteAudioStream(String uid, boolean stop);

    /**
     * 停止/接收所有远端音频数据
     */
    void stopAllRemoteAudioStreams(boolean stop);

    /**
     * 停止/接收所有远端音频数据
     */
    void stopAllRemoteVideoStreams(boolean stop);

    /**
     * 开启音视频功能
     */
    boolean startUpMicrophone();

    /**
     * 关闭音视频功能
     */
    boolean stopDownMicrophone();

    /**
     * 发送点对点消息
     */
    void sendUnicastMessage(Message message, long userid);

    /**
     * 发送广播消息
     */
    void sendBroadcastMessage(String type, String data);

    /**
     * 获取房间成员列表
     */
    void queryMembers();

    /**
     * 更新指定房间的属性：属性存在则更新；属性不存在则添加；
     */
    void addOrUpdateRoomAttributes(String key, String value);

    /**
     * 设置用户在当前房间的信息
     */
    void addOrUpdateMemberAttributes(long userId, Map<String, String> attributes);

    /**
     * 删除用户在当前房间的所有信息
     */
    void clearMemberAttributes(long userId);

    /**
     * 删除指定房间的指定属性
     */
    void deleteRoomAttributes(Set<String> keys);

    /**
     * 查询指定房间的指定属性
     */
    void queryRoomAttributesByKeys(final Set<String> keys);

    /**
     * 查询指定房间内的全部属性
     */
    void queryRoomAttributes();

    /**
     * 查询用户在房间的指定属性
     */
    void queryMemberAttributesByKeys(long uid, Set<String> keys);

    /**
     * 销毁 ThunderEngine 对象
     */
    void destroyEngine();

}
