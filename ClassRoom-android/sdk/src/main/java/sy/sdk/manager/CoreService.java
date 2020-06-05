package sy.sdk.manager;

import android.content.Context;
import sy.sdk.service.RtcService;
import sy.sdk.service.RtsService;

public interface CoreService extends RtcService, RtsService {
    /**
     * 初始化SDK
     */
    void init(Context context, String appId, String token);

    /**
     * 销毁SDK
     */
    void destroyEngine();

    /**
     * 用户加入房间
     */
    void joinRoom(String roomId, long uid);

    /**
     * 离开房间
     */
    void leaveRoom();

}
