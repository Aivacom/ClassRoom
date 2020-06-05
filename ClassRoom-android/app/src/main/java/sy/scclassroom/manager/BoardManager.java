package sy.scclassroom.manager;

import android.os.Handler;
import android.os.Looper;
import sy.scclassroom.listener.BoardEventListener;
import sy.scclassroom.utils.Appliance;
import com.herewhite.sdk.Room;
import com.herewhite.sdk.RoomCallbacks;
import com.herewhite.sdk.RoomParams;
import com.herewhite.sdk.WhiteSdk;
import com.herewhite.sdk.domain.MemberState;
import com.herewhite.sdk.domain.Promise;
import com.herewhite.sdk.domain.RoomPhase;
import com.herewhite.sdk.domain.RoomState;
import com.herewhite.sdk.domain.SDKError;
import com.herewhite.sdk.domain.SceneState;
import com.herewhite.sdk.domain.ViewMode;

public class BoardManager extends NetlessManager<Room> implements RoomCallbacks {

    private String appliance;
    private int[] strokeColor;
    private double strokeWidth;
    private Boolean disableDeviceInputs;
    private Boolean disableCameraTransform;
    private ViewMode viewMode = ViewMode.Follower;

    private Handler handler = new Handler(Looper.getMainLooper());
    private BoardEventListener listener;

    public void setListener(BoardEventListener listener) {
        this.listener = listener;
    }

    public void init(WhiteSdk sdk, RoomParams params) {
        sdk.joinRoom(params, this, promise);
    }

    /**
     * 设置工具：铅笔、橡皮擦、矩形、椭圆、选择工具等
     * @param appliance
     */
    public void setAppliance(@Appliance String appliance) {
        if (t != null) {
            MemberState state = new MemberState();
            state.setCurrentApplianceName(appliance);
            t.setMemberState(state);
            t.zoomChange(10);
            t.disableOperations(false);
        } else {
            this.appliance = appliance;
        }
    }

    public String getAppliance() {
        if (t != null) {
            return t.getMemberState().getCurrentApplianceName();
        }
        return null;
    }

    /**
     * 设置颜色
     * @param color
     */
    public void setStrokeColor(int[] color) {
        if (t != null) {
            MemberState state = new MemberState();
            state.setStrokeColor(color);
            t.setMemberState(state);
        } else {
            this.strokeColor = color;
        }
    }

    public int[] getStrokeColor() {
        if (t != null) {
            return t.getMemberState().getStrokeColor();
        }
        return null;
    }

    /**
     * 设置宽度
     * @param strokeWidth
     */
    public void setStrokeWidth(double strokeWidth) {
        if (t != null) {
            MemberState state = new MemberState();
            state.setStrokeWidth(strokeWidth);
            t.setMemberState(state);
        } else {
            this.strokeWidth = strokeWidth;
        }
    }

    public double getStrokeWidth() {
        if (t != null) {
            return t.getMemberState().getStrokeWidth();
        }
        return 0;
    }

    /**
     * 翻页
     * @param index
     */
    public void setSceneIndex(int index) {
        if (t != null && !isDisableDeviceInputs()) {
            t.setSceneIndex(index, new Promise<Boolean>() {
                @Override
                public void then(Boolean aBoolean) {

                }

                @Override
                public void catchEx(SDKError t) {

                }
            });
        }
    }

    public int getSceneCount() {
        if (t != null) {
            return t.getScenes().length;
        }
        return 0;
    }


    /**
     * ppt上一页
     */
    public void pptPreviousStep() {
        if (t != null && !isDisableDeviceInputs()) {
            t.pptPreviousStep();
        }
    }

    /**
     * ppt下一页
     */
    public void pptNextStep() {
        if (t != null && !isDisableDeviceInputs()) {
            t.pptNextStep();
        }
    }

    public void getRoomPhase(Promise<RoomPhase> promise) {
        if (t != null) {
            t.getRoomPhase(promise);
        } else {
            if (promise != null) {
                promise.then(RoomPhase.disconnected);
            }
        }
    }

    public void refreshViewSize() {
        if (t != null) {
            t.refreshViewSize();
        }
    }

    public void disableDeviceInputs(boolean disabled) {
        if (t != null) {
            t.disableDeviceInputs(disabled);
        } else {
            disableDeviceInputs = disabled;
        }
    }

    public void disableCameraTransform(boolean disabled) {
        if (t != null) {
            t.disableCameraTransform(disabled);
        } else {
            disableCameraTransform = disabled;
        }
    }

    public boolean isDisableDeviceInputs() {
        return disableDeviceInputs == null ? false : disableDeviceInputs;
    }

    public void disconnect() {
        if (t != null) {
            t.disconnect();
        }
    }

    @Override
    public void onPhaseChanged(final RoomPhase phase) {
        if (listener != null) {
            handler.post(new Runnable() {
                @Override
                public void run() {
                    listener.onRoomPhaseChanged(phase);
                }
            });
        }
    }

    /**
     * 设置用户视角模式。主播、跟随、自由模式
     */
    public void setUserViewMode(ViewMode viewMode) {
        if (t != null) {
            t.setViewMode(viewMode);
        } else {
            this.viewMode = viewMode;
        }
    }

    public RoomState getUserViewMode() {
        if (t != null) {
            RoomState state = t.getRoomState();
            return state;
        } else {
            return null;
        }
    }

    @Override
    public void onBeingAbleToCommitChange(boolean isAbleToCommit) {

    }

    @Override
    public void onDisconnectWithError(Exception e) {

    }

    @Override
    public void onKickedWithReason(String reason) {

    }

    @Override
    public void onRoomStateChanged(RoomState modifyState) {
        if (listener != null) {
            final MemberState memberState = modifyState.getMemberState();
            if (memberState != null) {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        listener.onMemberStateChanged(memberState);
                    }
                });
            }
            final SceneState sceneState = modifyState.getSceneState();
            if (sceneState != null) {
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        listener.onSceneStateChanged(sceneState);
                    }
                });
            }
        }
    }

    @Override
    public void onCatchErrorWhenAppendFrame(long userId, Exception error) {

    }

    @Override
    void onSuccess(Room room) {
        if (appliance != null) {
            setAppliance(appliance);
        }
        if (strokeColor != null) {
            setStrokeColor(strokeColor);
        }
        if (disableDeviceInputs != null) {
            disableDeviceInputs(disableDeviceInputs);
        }
        if (disableCameraTransform != null) {
            disableCameraTransform(disableCameraTransform);
        }
        if (listener != null) {
            listener.onSceneStateChanged(room.getSceneState());
        }

        setUserViewMode(viewMode);
    }

    @Override
    void onFail(SDKError error) {
        if (listener != null) {
            listener.onJoinRoomFaild(error);
        }
    }

}
