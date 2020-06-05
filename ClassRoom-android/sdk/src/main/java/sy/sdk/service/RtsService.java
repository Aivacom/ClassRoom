package sy.sdk.service;


import com.hummer.model.Message;
import java.util.Map;
import java.util.Set;

public interface RtsService {

    /**
     * 查询指定房间的指定属性
     */
    void queryRoomAttributesByKeys(Set<String> keys);

    /**
     * 查询指定房间的全部属性
     */
    void queryRoomAttributes();

    /**
     * 获取房间成员列表
     */
    void queryMembers();

    /**
     * 查询用户在房间的指定属性
     */
    void queryMemberAttributesByKeys(long uid, Set<String> keys);

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
     * 发送组消息
     */
    void sendBroadcastMessage(String type, String data);

    /**
     * 发送P2P信令消息
     */
    void sendUnicastMessage(long uid, Message message);
    /**
     * 添加事件监听器
     */
    void addRtsEventListener();

    /**
     * 移除事件监听器
     */
    void removeRtsEventListener();

}
