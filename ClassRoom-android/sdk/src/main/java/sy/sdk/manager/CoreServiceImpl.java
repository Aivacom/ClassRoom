package sy.sdk.manager;


import android.content.Context;
import androidx.annotation.NonNull;
import com.hummer.Error;
import com.hummer.HMR;
import com.hummer.model.Message;
import com.hummer.model.MessagingOptions;
import com.hummer.model.RequestId;
import com.hummer.model.RoomId;
import com.hummer.rts.PeerService;
import com.hummer.rts.RoomService;
import com.thunder.livesdk.ThunderEngine;
import com.thunder.livesdk.ThunderEventHandler;
import com.thunder.livesdk.ThunderNotification;
import com.thunder.livesdk.ThunderRtcConstant;
import com.thunder.livesdk.ThunderVideoCanvas;
import com.thunder.livesdk.ThunderVideoEncoderConfiguration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import sy.sdk.listener.RtcEventListener;
import sy.sdk.listener.RtsEventListener;
import sy.sdk.listener.SdkEventListener;

public class CoreServiceImpl extends RtsEventListener implements CoreService {

    private ThunderEngine mThunderEngine;
    private String roomId, sdkToken;
    private long uid;
    private RoomId mRoomId;
    private static final String YY_REGION = "cn";
    private static volatile CoreServiceImpl serviceManager = null;
    private SdkEventListener sdkEventListener;
    private static final int initialState = 0;
    private static final int initializedState = 1;
    private int interfaceStepStatusHummerInit;
    private int interfaceStepStatusHummerLogin;
    public int interfaceStepStatusRtsRoom;
    public int interfaceStepStatusThunderRoom;

    void setSdkEventListener(SdkEventListener rtsEventListener) {
        this.sdkEventListener = rtsEventListener;
    }

    private CoreServiceImpl() {
        listeners = new ArrayList<>();
    }

    public static CoreServiceImpl getInstance() {
        if (serviceManager == null) {
            synchronized (CoreServiceImpl.class) {
                if (serviceManager == null) {
                    serviceManager = new CoreServiceImpl();
                }
            }
        }
        return serviceManager;
    }

    @Override
    public void init(Context context, String appId, String token) {
        this.sdkToken = token;
        if (mThunderEngine == null && interfaceStepStatusHummerInit == initialState) {
            interfaceStepStatusHummerInit = initializedState;
            mThunderEngine = ThunderEngine.createEngine(context, appId, 0, mHandler);
            serviceManager.setLogFilePath(context.getExternalCacheDir() + "/sclog");
            serviceManager.setLogLevel(ThunderRtcConstant.ThunderLogLevel.THUNDERLOG_LEVEL_TRACE);
            HMR.init(context, Long.parseLong(appId), "", new HMR.HummerEventListener() {
                @Override
                public void onHummerStateChanged(HMR.State fromState, HMR.State toState, String reason) {
                    sdkEventListener.logCatStateCallBack("[HMR] onHummerStateChanged  fromState:" +
                            fromState + "  toState:" + toState + "  reason" + reason);
                    //状态变更通知
                    sdkEventListener.onHummerStateChanged(fromState, toState, reason);
                }

                @Override
                public void onHummerKicked(int code, String description) {
                    //账号互踢通知
                }

                @Override
                public void onHummerPreviousTokenExpired() {
                    //token过期通知
                }
            });
        }
    }

    @Override
    public void destroyEngine() {
        ThunderEngine.destroyEngine();
        mThunderEngine = null;
    }

    @Override
    public void joinRoom(String roomId, long uid) {
        this.roomId = roomId;
        this.uid = uid;
        login();
    }

    @Override
    public void leaveRoom() {
        sdkEventListener.logCatStateCallBack("[TB] leaveRoom");
        if (mThunderEngine != null) {
            int result = mThunderEngine.leaveRoom();
            if (result == 0) {
                interfaceStepStatusThunderRoom = initialState;
                leaveRts();
            } else {
                sdkEventListener.onLeaveRoomFailed();
            }
        }
    }

    @Override
    public int setArea(int area) {
        sdkEventListener.logCatStateCallBack("[TB] setArea   " + "area  " + area);
        if (mThunderEngine != null) {
            return mThunderEngine.setArea(area);
        }
        return -1;
    }


    @Override
    public int setMediaMode(int mode) {
        sdkEventListener.logCatStateCallBack("[TB] setMediaMode   " + "mode  " + mode);
        if (mThunderEngine != null) {
             return mThunderEngine.setMediaMode(mode);
        }
        return -1;
    }

    @Override
    public int setRoomMode(int mode) {
        sdkEventListener.logCatStateCallBack("[TB] setRoomMode   " + "mode  " + mode);
        if (mThunderEngine != null) {
            return mThunderEngine.setRoomMode(mode);
        }
        return -1;
    }

    @Override
    public int setVideoCaptureOrientation(int orientation) {
        sdkEventListener.logCatStateCallBack("[TB] setVideoCaptureOrientation   " + "orientation  " + orientation);
        if (mThunderEngine != null) {
            return mThunderEngine.setVideoCaptureOrientation(orientation);
        }
        return -1;
    }

    @Override
    public void setAudioSourceType(int sourceType) {
        sdkEventListener.logCatStateCallBack("[TB] stopLocalAudioStream   " + "sourceType  " + sourceType);
        if (mThunderEngine != null) {
            mThunderEngine.setAudioSourceType(sourceType);
        }
    }

    @Override
    public int stopLocalAudioStream(boolean stop) {
        sdkEventListener.logCatStateCallBack("[TB] stopLocalAudioStream   " + "stop  " + stop);
        if (mThunderEngine != null) {
            return mThunderEngine.stopLocalAudioStream(stop);
        }
        return -1;
    }

    @Override
    public int stopAllRemoteAudioStreams(boolean stop) {
        sdkEventListener.logCatStateCallBack("[TB] stopAllRemoteAudioStreams   " + "stop  " + stop);
        if (mThunderEngine != null) {
            return mThunderEngine.stopAllRemoteAudioStreams(stop);
        }
        return -1;
    }

    @Override
    public int stopRemoteAudioStream(String uid, boolean stop) {
        sdkEventListener.logCatStateCallBack("[TB] stopRemoteAudioStream   " + "uid  " + uid + "  stop  " + stop);
        if (mThunderEngine != null) {
            return mThunderEngine.stopRemoteAudioStream(uid, stop);
        }
        return -1;
    }

    @Override
    public int setVideoEncoderConfig(ThunderVideoEncoderConfiguration yyVideoConfig) {
        sdkEventListener.logCatStateCallBack("[TB] setVideoEncoderConfig   " + "yyVideoConfig  " + yyVideoConfig);
        if (mThunderEngine != null) {
            return mThunderEngine.setVideoEncoderConfig(yyVideoConfig);
        }
        return -1;
    }

    @Override
    public int setLocalVideoCanvas(ThunderVideoCanvas local) {
        sdkEventListener.logCatStateCallBack("[TB] setLocalVideoCanvas   " + "local  " + local);
        if (mThunderEngine != null) {
            return mThunderEngine.setLocalVideoCanvas(local);
        }
        return -1;
    }

    @Override
    public int enableLocalVideoCapture(boolean enable) {
        sdkEventListener.logCatStateCallBack("[TB] setLocalCanvasScaleMode   " + "enable  " + enable);
        if (mThunderEngine != null) {
            return mThunderEngine.enableLocalVideoCapture(enable);
        }
        return -1;
    }

    @Override
    public int startVideoPreview() {
        sdkEventListener.logCatStateCallBack("[TB] startVideoPreview");
        if (mThunderEngine != null) {
            return mThunderEngine.startVideoPreview();
        }
        return -1;
    }

    @Override
    public int stopVideoPreview() {
        sdkEventListener.logCatStateCallBack("[TB] stopVideoPreview");
        if (mThunderEngine != null) {
            return mThunderEngine.stopVideoPreview();
        }
        return -1;
    }

    @Override
    public int setLocalCanvasScaleMode(int mode) {
        sdkEventListener.logCatStateCallBack("[TB] setLocalCanvasScaleMode   " + "mode  " + mode);
        if (mThunderEngine != null) {
            return mThunderEngine.setLocalCanvasScaleMode(mode);
        }
        return -1;
    }

    @Override
    public int stopLocalVideoStream(boolean stop) {
        sdkEventListener.logCatStateCallBack("[TB] stopLocalVideoStream   " + "stop  " + stop);
        if (mThunderEngine != null) {
            return mThunderEngine.stopLocalVideoStream(stop);
        }
        return -1;
    }

    @Override
    public int stopAllRemoteVideoStreams(boolean stop) {
        sdkEventListener.logCatStateCallBack("[TB] stopAllRemoteVideoStreams   " + "stop  " + stop);
        if (mThunderEngine != null) {
            return mThunderEngine.stopAllRemoteVideoStreams(stop);
        }
        return -1;
    }

    @Override
    public int stopRemoteVideoStream(String uid, boolean stop) {
        sdkEventListener.logCatStateCallBack("[TB] stopRemoteVideoStream   " + "uid: " + uid + "  stop  " + stop);
        if (mThunderEngine != null) {
            return mThunderEngine.stopRemoteVideoStream(uid, stop);
        }
        return -1;
    }

    @Override
    public int setRemoteCanvasScaleMode(String uid, int mode) {
        sdkEventListener.logCatStateCallBack("[TB] setRemoteCanvasScaleMode   " + "uid: " + uid + "  mode  " + mode);
        if (mThunderEngine != null) {
            return mThunderEngine.setRemoteCanvasScaleMode(uid, mode);
        }
        return -1;
    }

    @Override
    public int setRemoteVideoCanvas(ThunderVideoCanvas remote) {
        sdkEventListener.logCatStateCallBack("[TB] setRemoteVideoCanvas   " + "remote: " + remote);
        if (mThunderEngine != null) {
            return mThunderEngine.setRemoteVideoCanvas(remote);
        }
        return -1;
    }

    @Override
    public int setLogFilePath(String filePath) {
        sdkEventListener.logCatStateCallBack("[TB] setLogFilePath   " + "filePath: " + filePath);
        if (mThunderEngine != null) {
            return ThunderEngine.setLogFilePath(filePath);
        }
        return -1;
    }

    @Override
    public int setLogLevel(int filter) {
        sdkEventListener.logCatStateCallBack("[TB] setLogLevel   " + "filter: " + filter);
        if (mThunderEngine != null) {
            return ThunderEngine.setLogLevel(filter);
        }
        return -1;
    }

    private void login() {
        if (interfaceStepStatusHummerLogin == initialState) {
            HMR.login(uid, YY_REGION, sdkToken, new HMR.Completion() {
                @Override
                public void onSuccess(RequestId requestId) {
                    sdkEventListener.logCatStateCallBack("[HMR] Rts.login Success ");
                    interfaceStepStatusHummerLogin = initializedState;
                    joinRts();
                }

                @Override
                public void onFailed(RequestId requestId, Error err) {
                    sdkEventListener.logCatStateCallBack("[HMR] Rts.login Failed " + err);
                    sdkEventListener.onjoinRoomFailed();
                }
            });
        } else {
            joinRts();
        }
    }

    private void logout() {
        HMR.logout();
    }

    private void joinRts() {
        if (interfaceStepStatusRtsRoom == initialState) {
            mRoomId = new RoomId(this.roomId, YY_REGION);
            HMR.getService(RoomService.class).join(mRoomId, new HashMap<String, String>(0),
                    null, new HMR.Completion() {
                        @Override
                        public void onSuccess(RequestId requestId) {
                            sdkEventListener.logCatStateCallBack("[HMR] join Success " + requestId);
                            interfaceStepStatusRtsRoom = initializedState;
                            addRtsEventListener();
                            joinRoom();
                        }

                        @Override
                        public void onFailed(RequestId requestId, Error err) {
                            sdkEventListener.logCatStateCallBack("[HMR] join Failed" + err);
                            sdkEventListener.onjoinRoomFailed();
                        }
                    });
        } else {
            joinRoom();
        }

    }

    private void leaveRts() {
        HMR.getService(RoomService.class).leave(mRoomId, new HMR.Completion() {
            @Override
            public void onSuccess(RequestId requestId) {
                interfaceStepStatusRtsRoom = initialState;
                removeRtsEventListener();
                sdkEventListener.logCatStateCallBack("[HMR] leave Success " + requestId);
                sdkEventListener.onLeaveRoomSuccess();
            }

            @Override
            public void onFailed(RequestId requestId, Error err) {
                interfaceStepStatusRtsRoom = initialState;
                sdkEventListener.onLeaveRoomFailed();
                sdkEventListener.logCatStateCallBack("[HMR] leave Failed" + err);
            }
        });
    }

    @Override
    public void queryRoomAttributesByKeys(Set<String> keys) {
        HMR.getService(RoomService.class).queryRoomAttributesByKeys(mRoomId, keys,
                new HMR.CompletionArg<Map<String, String>>() {
            @Override
            public void onSuccess(RequestId requestId, Map<String, String> arg) {

            }

            @Override
            public void onFailed(RequestId requestId, Error err) {

            }
        });
    }

    @Override
    public void queryRoomAttributes() {
        HMR.getService(RoomService.class).queryRoomAttributes(mRoomId, new HMR.CompletionArg<Map<String, String>>() {
            @Override
            public void onSuccess(RequestId requestId, Map<String, String> arg) {
                sdkEventListener.logCatStateCallBack("[HMR] queryRoomAttributes Success  " + arg);
                sdkEventListener.queryRoomAttributes(requestId, arg);
            }

            @Override
            public void onFailed(RequestId requestId, Error err) {
                sdkEventListener.logCatStateCallBack("[HMR] queryRoomAttributes Failed  " + err);
            }
        });
    }


    @Override
    public void queryMembers() {
        HMR.getService(RoomService.class).queryMembers(mRoomId, new HMR.CompletionArg<List<Long>>() {
            @Override
            public void onSuccess(RequestId requestId, List<Long> arg) {

            }

            @Override
            public void onFailed(RequestId requestId, Error err) {

            }
        });
    }

    @Override
    public void queryMemberAttributesByKeys(long uid, Set<String> keys) {
        HMR.getService(RoomService.class).queryMemberAttributesByKeys(mRoomId, uid, keys,
                new HMR.CompletionArg<Map<String, String>>() {
            @Override
            public void onSuccess(RequestId requestId, Map<String, String> arg) {
                sdkEventListener.logCatStateCallBack("[HMR] queryMemberAttributesByKeys Success  arg: " + arg);
            }

            @Override
            public void onFailed(RequestId requestId, Error err) {
                sdkEventListener.logCatStateCallBack("[HMR] queryMemberAttributesByKeys Failed  " + err);
            }
        });
    }

    @Override
    public void addOrUpdateRoomAttributes(String key, String value) {
        Map<String, String> attributes = new HashMap<>(32);
        attributes.put(key, value);
        HMR.getService(RoomService.class).addOrUpdateRoomAttributes(mRoomId,
                attributes,
                null,
                new HMR.Completion() {
                    @Override
                    public void onSuccess(RequestId requestId) {
                        sdkEventListener.logCatStateCallBack("[HMR] addOrUpdateRoomAttributes Success  ");
                    }

                    @Override
                    public void onFailed(RequestId requestId, Error err) {
                        sdkEventListener.logCatStateCallBack("[HMR] addOrUpdateRoomAttributes Failed  " + err);
                    }
                });
    }

    @Override
    public void addOrUpdateMemberAttributes(long userId, Map<String, String> attributes) {
        HMR.getService(RoomService.class).addOrUpdateMemberAttributes(mRoomId, userId, attributes,
                null, new HMR.Completion() {
            @Override
            public void onSuccess(RequestId requestId) {
                sdkEventListener.logCatStateCallBack("[HMR] addOrUpdateMemberAttributes Success  ");
            }

            @Override
            public void onFailed(RequestId requestId, Error err) {
                sdkEventListener.logCatStateCallBack("[HMR] addOrUpdateMemberAttributes Failed  " + err);
            }
        });
    }

    @Override
    public void clearMemberAttributes(long userId) {
        HMR.getService(RoomService.class).clearMemberAttributes(mRoomId, userId, null, new HMR.Completion() {
            @Override
            public void onSuccess(RequestId requestId) {
                sdkEventListener.logCatStateCallBack("[HMR] clearMemberAttributes Success  ");
            }

            @Override
            public void onFailed(RequestId requestId, Error err) {
                sdkEventListener.logCatStateCallBack("[HMR] clearMemberAttributes Failed  " + err);
            }
        });
    }

    @Override
    public void deleteRoomAttributes(Set<String> keys) {
        HMR.getService(RoomService.class).deleteRoomAttributes(mRoomId, keys, null, new HMR.Completion() {
            @Override
            public void onSuccess(RequestId requestId) {
                sdkEventListener.logCatStateCallBack("[HMR] deleteRoomAttributes Success  ");
            }

            @Override
            public void onFailed(RequestId requestId, Error err) {
                sdkEventListener.logCatStateCallBack("[HMR] deleteRoomAttributes Failed  " + err);
            }
        });
    }

    /**
     * 发送广播消息
     */
    @Override
    public void sendBroadcastMessage(String type, String data) {
        Message message = new Message(type, data.getBytes());
        HMR.getService(RoomService.class).sendMessage(mRoomId,
                message,
                new MessagingOptions(),
                new HMR.Completion() {
            @Override
            public void onSuccess(RequestId requestId) {
                sdkEventListener.logCatStateCallBack("[HMR] sendBroadcastMessage Success");
            }

            @Override
            public void onFailed(RequestId requestId, Error err) {
                sdkEventListener.logCatStateCallBack("[HMR] sendBroadcastMessage Failed" + err);
            }
        });
    }

    /**
     * 发送单播消息
     */
    @Override
    public void sendUnicastMessage(long uid, Message message) {
        HMR.getService(PeerService.class).sendMessage(uid, message, new MessagingOptions(), new HMR.Completion() {
            @Override
            public void onSuccess(RequestId requestId) {
                sdkEventListener.logCatStateCallBack("[HMR] sendUnicastMessage Success");
                sdkEventListener.sendUnicastMessageSuccess();
            }

            @Override
            public void onFailed(RequestId requestId, Error err) {
                sdkEventListener.logCatStateCallBack("[HMR] sendUnicastMessage Failed" + err);
                sdkEventListener.sendUnicastMessageFailed(err);
            }
        });
    }

    @Override
    public void addRtsEventListener() {
        HMR.getService(PeerService.class).addEventListener(this);
        HMR.getService(RoomService.class).addRoomEventListener(this);
        HMR.getService(RoomService.class).addMemberEventListener(this);
    }

    @Override
    public void removeRtsEventListener() {
        HMR.getService(PeerService.class).removeEventListener(this);
        HMR.getService(RoomService.class).removeRoomEventListener(this);
        HMR.getService(RoomService.class).removeMemberEventListener(this);
    }


    private void joinRoom() {
        if (interfaceStepStatusThunderRoom == initialState) {
            int result = mThunderEngine.joinRoom(sdkToken.getBytes(), roomId, uid + "");
            interfaceStepStatusThunderRoom = initializedState;
            if (result != 0) {
                sdkEventListener.onjoinRoomFailed();
            }
        } else {
            sdkEventListener.onjoinRoomSuccess();
        }
    }

    private List<RtcEventListener> listeners;

    private ThunderEventHandler mHandler;

    {
        mHandler = new ThunderEventHandler() {
            @Override
            public void onError(int error) {
                super.onError(error);
            }

            @Override
            public void onJoinRoomSuccess(String room, String uid, int elapsed) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onJoinRoomSuccess(room, uid, elapsed);
                }
                sdkEventListener.onjoinRoomSuccess();
                sdkEventListener.logCatStateCallBack("JoinRoomSuccess " + "roomId：" + room + "  UserId：" + uid);
            }

            @Override
            public void onLeaveRoom(RoomStats status) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onLeaveRoom(status);
                }
            }

            @Override
            public void onBizAuthResult(boolean bPublish, int result) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onBizAuthResult(bPublish, result);
                }
            }

            @Override
            public void onSdkAuthResult(int result) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onSdkAuthResult(result);
                }
            }

            @Override
            public void onUserBanned(boolean status) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onUserBanned(status);
                }
            }

            @Override
            public void onUserJoined(String uid, int elapsed) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onUserJoined(uid, elapsed);
                }
            }

            @Override
            public void onUserOffline(String uid, int reason) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onUserOffline(uid, reason);
                }
            }

            @Override
            public void onTokenWillExpire(byte[] token) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onTokenWillExpire(token);
                }
            }

            @Override
            public void onTokenRequested() {
                for (RtcEventListener hanler : listeners) {
                    hanler.onTokenRequested();
                }
            }

            @Override
            public void onNetworkQuality(String uid, int txQuality, int rxQuality) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onNetworkQuality(uid, txQuality, rxQuality);
                }
                sdkEventListener.onNetworkQuality(uid, txQuality, rxQuality);
            }

            @Override
            public void onRoomStats(ThunderNotification.RoomStats stats) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onRoomStats(stats);
                }
            }

            @Override
            public void onPlayVolumeIndication(AudioVolumeInfo[] speakers, int totalVolume) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onPlayVolumeIndication(speakers, totalVolume);
                }
            }

            @Override
            public void onCaptureVolumeIndication(int totalVolume, int cpt, int micVolume) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onCaptureVolumeIndication(totalVolume, cpt, micVolume);
                }
            }

            @Override
            public void onAudioQuality(String uid, int quality, short delay, short lost) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onAudioQuality(uid, quality, delay, lost);
                }
            }

            @Override
            public void onConnectionLost() {
                for (RtcEventListener hanler : listeners) {
                    hanler.onConnectionLost();
                }
            }

            @Override
            public void onRemoteVideoPlay(String uid, int width, int height, int elapsed) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onRemoteVideoPlay(uid, width, height, elapsed);
                }
                sdkEventListener.onRemoteVideoPlay(uid);
            }

            @Override
            public void onRemoteVideoStatsOfUid(String uid, ThunderEventHandler.RemoteVideoStats stats) {
                for (RtcEventListener hanler : listeners) {
                    hanler.onRemoteVideoStatsOfUid(uid, stats);
                }
                sdkEventListener.onRemoteVideoStatsOfUid(uid, stats);
            }
        };
    }

    @Override
    public void onRoomMemberJoined(@NonNull RoomId roomId, @NonNull Set<Long> set) {
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMemberJoined  Roomid  " + roomId + "  Set" + set);
    }

    @Override
    public void onRoomMemberLeft(@NonNull RoomId roomId, @NonNull Set<Long> set) {
        sdkEventListener.onRoomMemberLeft(roomId, set);
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMemberLeft  Roomid  " + roomId + "  Set" + set);
    }

    @Override
    public void onRoomMemberOffline(Set<RoomId> set) {
        sdkEventListener.onRoomMemberOffline(set);
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMemberOffline  Set" + set);
    }

    @Override
    public void onRoomMemberCountChanged(@NonNull RoomId roomId, Integer integer) {
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMemberCountChanged  Roomid  " +
                roomId + "  Integer  " + integer);
    }

    @Override
    public void onRoomMemberAttributesSet(@NonNull RoomId roomId, long l, @NonNull Map<String, String> map) {
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMemberAttributesSet  Roomid  " + roomId + "Map  " + map);
    }

    @Override
    public void onRoomMemberAttributesAddedOrUpdated(@NonNull RoomId roomId, long l, @NonNull Map<String, String> map) {
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMemberAttributesAddedOrUpdated  Roomid"
                + roomId + "Map  " + map);
    }

    @Override
    public void onRoomMemberAttributesDeleted(@NonNull RoomId roomId, long l, @NonNull Map<String, String> map) {
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMemberAttributesDeleted  " + "RoomId  " +
                roomId + "userId  " + l + "Map  " + map);
    }

    @Override
    public void onRoomMemberAttributesCleared(@NonNull RoomId roomId, long l, @NonNull Map<String, String> map) {
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMemberAttributesCleared  " + "RoomId  " +
                roomId + "userId  " + l + "Map  " + map);
    }


    @Override
    public void onRoomAttributesSet(@NonNull RoomId roomId, long l, @NonNull Map<String, String> map) {
        sdkEventListener.logCatStateCallBack("[HMR] onRoomAttributesSet  " + "RoomId  " +
                roomId + "userId  " + l + "Map  " + map);
    }

    @Override
    public void onRoomAttributesDeleted(@NonNull RoomId roomId, long l, @NonNull Map<String, String> map) {
        sdkEventListener.onRoomAttributesDeleted(roomId, l, map);
        sdkEventListener.logCatStateCallBack("[HMR] onRoomAttributesDeleted  " + "RoomId  " +
                roomId + "userId  " + l + "set  " + map);
    }

    @Override
    public void onRoomAttributesCleared(@NonNull RoomId roomId, long l, @NonNull Map<String, String> map) {
        sdkEventListener.logCatStateCallBack("[HMR] onRoomAttributesCleared  " + "RoomId  " +
                roomId + "userId  " + l + "Map  " + map);
    }

    @Override
    public void onRoomAttributesAddedOrUpdated(@NonNull RoomId roomId, long l, @NonNull Map<String, String> map) {
        sdkEventListener.onRoomAttributesAddedOrUpdated(roomId, l, map);
        sdkEventListener.logCatStateCallBack("[HMR] onRoomAttributesAddedOrUpdated  " + "RoomId  " +
                roomId + "userId  " + l + "Map  " + map);

    }

    @Override
    public void onRoomMessageReceived(@NonNull RoomId roomId, long l, Message message) {
        sdkEventListener.onRoomMessageReceived(roomId, l, message);
        sdkEventListener.logCatStateCallBack("[HMR] onRoomMessageReceived  " + "Roomid  " + roomId + "Uid  " +
                l + "  Message  " + message);
    }

    @Override
    public void onPeerMessageReceived(long l, Message message) {
        sdkEventListener.logCatStateCallBack("[HMR] onPeerMessageReceived  " + "Uid  " +
                l + "  Message  " + message);
        sdkEventListener.onPeerMessageReceived(l, message);
    }
}
