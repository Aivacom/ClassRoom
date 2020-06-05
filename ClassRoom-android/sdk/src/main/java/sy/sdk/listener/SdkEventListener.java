package sy.sdk.listener;


import com.hummer.Error;
import com.hummer.HMR;
import com.hummer.model.Message;
import com.hummer.model.RequestId;
import com.hummer.model.RoomId;
import com.thunder.livesdk.ThunderEventHandler;
import java.util.Map;
import java.util.Set;


public interface SdkEventListener {
    /**
     * 用户加入房间成功回调
     */
    void onjoinRoomSuccess();

    /**
     * 用户加入房间失败回调
     */
    void onjoinRoomFailed();

    /**
     * 用户离开房间成功回调
     */
    void onLeaveRoomSuccess();

    /**
     * 用户离开房间失败回调
     */
    void onLeaveRoomFailed();

    /**
     * 断网超时离线通知
     */
    void onRoomMemberOffline(Set<RoomId> roomIds);

    /**
     * 网络质量回调
     */
    void onNetworkQuality(String uid, int txQuality, int rxQuality);

    /**
     * 显示视图首帧回调
     */
    void onRemoteVideoPlay(String uid);

    /**
     * 通话中远端视频流信息回调
     */
    void onRemoteVideoStatsOfUid(String uid, ThunderEventHandler.RemoteVideoStats stats);

    /**
     * 成员离开房间通知
     */
    void onRoomMemberLeft(RoomId roomId, Set<Long> leftMembers);

    /**
     * 房间属性删除通知
     */
    void onRoomAttributesDeleted(RoomId roomId, long userId, Map<String, String> attributes);

    /**
     * 房间信息更新通知
     */
    void onRoomAttributesAddedOrUpdated(RoomId roomId, long userId, Map<String, String> attributes);

    /**
     * 当有一个用户往房间内发一条信令消息时，房间内所有的成员都会受到该事件的通知回调
     */
    void onRoomMessageReceived(RoomId roomId, long fromUserId, Message message);

    /**
     * 当收到P2P信令消息时，会收到该事件的通知回调
     */
    void onPeerMessageReceived(long fromUserId, Message message);

    /**
     * 查询指定房间内的全部属性
     */
    void queryRoomAttributes(RequestId requestId, Map<String, String> arg);

    /**
     * 单播信令发送成功通知
     */
    void sendUnicastMessageSuccess();

    /**
     * 单播信令发送失败通知
     */
    void sendUnicastMessageFailed(Error error);

    /**
     * Hummer状态变更通知
     */
    void onHummerStateChanged(HMR.State fromState, HMR.State toState, String reason);

    /**
     * 日志回调
     */
    void logCatStateCallBack(String log);

}
