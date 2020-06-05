package sy.sdk.listener;


import com.hummer.rts.PeerService;
import com.hummer.rts.RoomService;

public abstract class RtsEventListener implements RoomService.RoomEventListener,
        RoomService.MemberEventListener, PeerService.EventListener {
}
