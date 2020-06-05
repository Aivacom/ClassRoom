package sy.scclassroom.listener;

import com.herewhite.sdk.domain.MemberState;
import com.herewhite.sdk.domain.RoomPhase;
import com.herewhite.sdk.domain.SDKError;
import com.herewhite.sdk.domain.SceneState;

public interface BoardEventListener {

    void onRoomPhaseChanged(RoomPhase phase);

    void onSceneStateChanged(SceneState state);

    void onMemberStateChanged(MemberState state);

    void onJoinRoomFaild(SDKError error);

}
