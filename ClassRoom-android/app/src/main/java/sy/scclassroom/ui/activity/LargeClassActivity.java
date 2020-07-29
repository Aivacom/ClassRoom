package sy.scclassroom.ui.activity;
import android.content.Intent;
import android.os.Handler;
import android.text.TextUtils;
import android.text.method.ScrollingMovementMethod;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.widget.AppCompatButton;
import androidx.appcompat.widget.AppCompatEditText;
import androidx.appcompat.widget.AppCompatImageView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.alibaba.fastjson.JSON;
import com.google.gson.Gson;
import com.hummer.Error;
import com.hummer.HMR;
import com.hummer._internals.log.Log;
import com.hummer.model.Message;
import com.hummer.model.RequestId;
import com.hummer.model.RoomId;
import com.thunder.livesdk.video.ThunderPlayerView;
import com.thunder.livesdk.video.ThunderPreviewView;
import io.reactivex.Observable;
import io.reactivex.ObservableEmitter;
import io.reactivex.ObservableOnSubscribe;
import io.reactivex.Observer;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;
import java.lang.ref.WeakReference;
import java.util.Collection;
import java.util.HashMap;
import java.util.Set;
import org.jetbrains.annotations.NotNull;
import sy.scclassroom.base.BaseActivity;
import sy.scclassroom.adapter.MessageListAdapter;
import sy.scclassroom.bean.BaseLiveBean;
import sy.scclassroom.bean.RtsStudentBean;
import sy.scclassroom.bean.RtsTeacherBean;
import sy.scclassroom.bean.ChatRoomBean;
import sy.scclassroom.listener.BoardEventListener;
import sy.scclassroom.manager.BoardManager;
import sy.scclassroom.utils.Constant;
import sy.scclassroom.utils.GsonUtil;
import sy.scclassroom.utils.RoomToken;
import sy.scclassroom.utils.SpUtils;
import sy.scclassroom.utils.TimeUtil;
import com.herewhite.sdk.RoomParams;
import com.herewhite.sdk.WhiteBroadView;
import com.herewhite.sdk.WhiteSdk;
import com.herewhite.sdk.WhiteSdkConfiguration;
import com.herewhite.sdk.domain.DeviceType;
import com.herewhite.sdk.domain.MemberState;
import com.herewhite.sdk.domain.Promise;
import com.herewhite.sdk.domain.RoomPhase;
import com.herewhite.sdk.domain.SDKError;
import com.herewhite.sdk.domain.SceneState;
import sy.scclassroom.utils.ToastManager;
import sy.scclassroom.utils.Utils;
import com.sy.scclassroom.R;
import com.thunder.livesdk.ThunderEventHandler;
import com.thunder.livesdk.ThunderRtcConstant;
import sy.sdk.listener.SdkEventListener;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import butterknife.BindView;
import butterknife.OnClick;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import sy.sdk.manager.CoreServiceImpl;
import sy.sdk.manager.EducationServiceImpl;
import static java.lang.Long.parseLong;

public class LargeClassActivity extends BaseActivity {

    @BindView(R.id.teacher_view)
    ThunderPlayerView mTeacherViewPlayerView;
    @BindView(R.id.student_view)
    ThunderPlayerView mStudentPlayerView;
    @BindView(R.id.student_preview_view_layout)
    ThunderPreviewView mStudentPreview;
    @BindView(R.id.tv_public_message)
    TextView tvPublicMessage;
    @BindView(R.id.rcv_chate_room)
    RecyclerView rcvChateRoom;
    @BindView(R.id.edit_send_msg)
    AppCompatEditText editSendMsg;
    @BindView(R.id.btn_reise_your_hand)
    AppCompatButton btnReiseYourHand;
    @BindView(R.id.img_teacherMsg)
    AppCompatImageView imgTeacherMsg;
    @BindView(R.id.live_status_bar)
    RelativeLayout mLiveStatusBar;
    @BindView(R.id.tv_logcat)
    TextView mLogCat;
    @BindView(R.id.btn_the_console)
    AppCompatButton mTheConsole;
    @BindView(R.id.text_live_roomid)
    TextView mTvLiveRoom;
    @BindView(R.id.iv_advertising_picture)
    AppCompatImageView mAdvertisingPicture;
    @BindView(R.id.white)
    WhiteBroadView whiteBroadView;
    @BindView(R.id.tv_theacher_player_view_id)
    TextView mTheacherId;
    @BindView(R.id.tv_student_player_view_id)
    TextView mStudentId;
    @BindView(R.id.text_live_userid)
    TextView mTvLiveUserId;
    @BindView(R.id.imageview_network)
    AppCompatImageView mIvNetWork;
    @BindView(R.id.alphaView)
    RelativeLayout alphaView;
    private boolean isLiveStatusBar;
    private boolean console = false;
    public  boolean studentIsBroadcast = false;
    private boolean theacherRate = false;
    private boolean isonUsersLeaved = false;
    private boolean isaudienceNetworkBroken = false;
    private boolean isReturnBackground = false;
    private boolean isRoomMemberOffline = false;
    private String classname; //Roomid
    private String username; //学生自己昵称
    private String teacherId; //老师Uid
    private int rate = 0;
    private int isRetryJoinRoom = 0;
    private EducationServiceImpl manager;
    private RtsTeacherBean rtsTeacherOriginBean;
    private CoreServiceImpl coreService;
    private LinearLayoutManager layoutManager;
    private MessageListAdapter adapter;
    private List<ChatRoomBean> allmsg = new ArrayList<>(); //所有消息
    private List<ChatRoomBean> teachermsg = new ArrayList<>(); //老师消息
    private boolean isOnlyShowTeacherMsg = false;
    private int handState = 0; //0:可举手  1:举手中但未连麦  2:连麦中
    private int netQuality = 0;
    private WhiteSdk whiteSdk = null;
    private BoardManager boardManager = new BoardManager();
    private RtsStudentBean rtsDataBean;
    private WeakHandler weakHandler = new WeakHandler(this);
    private static final int CODE_HIDEN = 1;
    private final long hidenTime = 5000;


    @Override
    protected int getLayoutResId() {
        return R.layout.activity_large_class;
    }

    @Override
    protected void initData() {

    }

    @Override
    protected void initView() {
        //初始化 SdkService
        manager = EducationServiceImpl.getInstances();
        coreService = CoreServiceImpl.getInstance();
        //设置始终显示最后一行
        mLogCat.setGravity(Gravity.BOTTOM);
        //并且可以拖动
        mLogCat.setMovementMethod(ScrollingMovementMethod.getInstance());
        mLogCat.setGravity(Gravity.TOP);
        //拿到登陆传过来的数据，roomid、userid、username
        classname = (String) SpUtils.get(getApplicationContext(), "classname", "");
        username = (String) SpUtils.get(getApplicationContext(), "username", "");
        //设置房间名称
        mTvLiveRoom.setText(this.classname);
        //设置自己昵称
        mTvLiveUserId.setText(username);
        //设置默认公告栏内容
        updatePublicMessage(getResources().getString(R.string.default_public_message));
        //默认禁言
        editSendMsg.setHint(getResources().getString(R.string.hint_muting));
        editSendMsg.setEnabled(false);
        rtsDataBean = new RtsStudentBean(username, Constant.mLocalUid, "0", "0",
                "", "0", "0", "");

        editSendMsg.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int actionId, KeyEvent keyEvent) {
                if (actionId == EditorInfo.IME_ACTION_SEND && !editSendMsg.getText().toString().trim().equals("")) {
                    String sendmessage = editSendMsg.getText().toString();
                    sendChateMessage(sendmessage, username);
                    editSendMsg.setText("");
                    Utils.hideKeyboard(LargeClassActivity.this);
                    return true;
                }
                return false;
            }
        });

        layoutManager = new LinearLayoutManager(this, LinearLayoutManager.VERTICAL, false);
        rcvChateRoom.setLayoutManager(layoutManager);
        adapter = new MessageListAdapter(this, allmsg);
        rcvChateRoom.setAdapter(adapter);

        WhiteSdkConfiguration configuration = new WhiteSdkConfiguration(DeviceType.touch, 10, 0.1);
        whiteSdk = new WhiteSdk(whiteBroadView, this, configuration);
        boardManager.setListener(boardEventListener);
        whiteBroadView.addOnLayoutChangeListener((v, left, top, right, bottom, oldLeft,
                                                  oldTop, oldRight, oldBottom) -> {
            boardManager.refreshViewSize();
        });

        android.os.Message msg = weakHandler.obtainMessage(CODE_HIDEN);
        weakHandler.sendMessageDelayed(msg, hidenTime);
    }

    /**
     *
     * 添加日志到控制台
     */
    private void addText(String content) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss"); // HH:mm:ss
                //获取当前时间
                Date date = new Date(System.currentTimeMillis());
                mLogCat.append("  " + simpleDateFormat.format(date) + "   " + content);
                mLogCat.append("\n");
                int offset = mLogCat.getLineCount() * mLogCat.getLineHeight();
                if (offset > mLogCat.getHeight()) {
                    mLogCat.scrollTo(0, offset - mLogCat.getHeight());
                }
            }
        });
    }

    /**
     * 广播发送聊天室消息
     */
    private void sendChateMessage(String msgContent, String msgNikename) {
        try {
            //组装jsonValue
            JSONObject jsonObjectJsonValue = new JSONObject();
            jsonObjectJsonValue.put(Constant.MSG_CONTENT, msgContent);
            //获取的时间是毫秒级别的，传入是需要秒级别
            jsonObjectJsonValue.put(Constant.MSG_TIME, TimeUtil.getCurrentTime() / 1000);
            jsonObjectJsonValue.put(Constant.MSG_NIKENAME, msgNikename);

            JSONObject jsonObjectData = new JSONObject();
            jsonObjectData.put(Constant.KEY, Constant.MESSAGE); //组装key
            jsonObjectData.put(Constant.VALUE, ""); //组装value
            jsonObjectData.put(Constant.JSONVALUE, jsonObjectJsonValue); //组装jsonValue

            String type = "100";
            String data = jsonObjectData.toString();
            //发送消息
            manager.sendBroadcastMessage(type, data);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 设置公告消息
     */
    private void updatePublicMessage(String msg) {
        tvPublicMessage.setText(getString(R.string.default_public_message));
    }


    /**
     * 上麦开播流程
     */
    private void setUserBroadcaster() {
        handState = 1;
        //显示预览
        mStudentPreview.setVisibility(View.VISIBLE);
        //设置本地预览视图
        manager.setLocalVideoCanvas(mStudentPreview, Constant.mLocalUid, -1);
        //开播 视频
        manager.startUpMicrophone();
        Toast.makeText(this, R.string.connect_the_wheat_with_the_teacher, Toast.LENGTH_SHORT).show();
        //设置按钮为"连麦中"
        btnReiseYourHand.setBackgroundResource(R.mipmap.even_in_the_wheat);
        //设置按钮为不可点击
        btnReiseYourHand.setEnabled(false);
        mStudentId.setText(Constant.mLocalUid);
        mStudentId.setVisibility(View.VISIBLE);
        studentIsBroadcast = true;
        //自己设置为主播，将设置为true,isClear是否清空Sp
        SpUtils.put(getApplicationContext(), "studentIsBroadcast", true);
    }

    /**
     * 下麦停播流程
     */
    private void setUserAudience() {
        handState = 0;
        //停播
        manager.stopDownMicrophone();
        //隐藏预览
        mStudentPreview.setVisibility(View.GONE);
        //设置按钮初始化，设置可点击状态
        btnReiseYourHand.setBackgroundResource(R.mipmap.live_exercises);
        //设置按钮为可点击状态
        btnReiseYourHand.setEnabled(true);
        //自己设置为观众，将设置为false
        studentIsBroadcast = false;
        mStudentId.setVisibility(View.GONE);
        //自己设置为观众，将设置为false,isClear是否清空Sp
        SpUtils.put(getApplicationContext(), "studentIsBroadcast", false);
    }

    /**
     * 初始化白板，并进入，失败重试三次
     */
    public void enterWhitBoard(String uuid, String token) {
        Observable.create(new ObservableOnSubscribe<Response>() {
            @Override
            public void subscribe(ObservableEmitter<Response> e) throws Exception {
                if (TextUtils.isEmpty(uuid)) return;
                    boardManager.getRoomPhase(new Promise<RoomPhase>() {
                    @Override
                    public void then(RoomPhase phase) {
                            Utils.getRoomToken(uuid, token, new Callback() {
                                @Override
                                public void onFailure(@NotNull Call call, @NotNull IOException e) {
                                    ToastManager.showShort(R.string.get_roomtoken_faild);
                                    addText("[白板] getRoomToken onFailure" + e.getMessage());
                                }

                                @Override
                                public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                                    RoomToken roomToken = JSON.parseObject(response.body().string(), RoomToken.class);
                                    if (roomToken.getCode() == 200 && roomToken.getMsg() != null && roomToken.getMsg()
                                            .getRoomToken() != null) {
                                        RoomParams params = new RoomParams(uuid, roomToken.getMsg().getRoomToken());
                                        params.setWritable(false); //设置学生不能操作白板
                                        boardManager.init(whiteSdk, params);
                                        e.onNext(response);
                                        e.onComplete();
                                    } else {
                                        e.onError(new Throwable(""));
                                    }
                                }
                            });
                    }

                    @Override
                    public void catchEx(SDKError t) {
                        ToastManager.showShort(t.getMessage());
                        rtsTeacherOriginBean.setBoard_uuid(Constant.CLOSE);
                        addText("[白板]initBoard Faild" + t.getMessage());
                    }
                });
            }
        }).retry(3).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread()).subscribe(new Observer<Response>() {
            private  Disposable mDisposable;
            @Override
            public void onSubscribe(Disposable d) {
                mDisposable = d;
            }

            @Override
            public void onNext(Response value) {
                Toast.makeText(LargeClassActivity.this, "进入白板房间成功", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onError(Throwable e) {
                Toast.makeText(LargeClassActivity.this, "进入白板房间失败", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onComplete() {
                mDisposable.dispose();
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        showDialogProgress();
        initSdk();
    }

    /**
     * 初始化SDK并加入房间
     */
    private void initSdk() {
        String appid = getApplicationContext().getString(R.string.app_id);
        if (appid.equals("")) {
            addText("[HMR] please input appid");
            return;
        }
        manager.init(getApplicationContext(), appid,
                getApplicationContext().getString(R.string.sdk_token), new SdkEventListener() {
                    @Override
                    public void onjoinRoomSuccess() {
                        isReturnBackground = false;
                        manager.queryRoomAttributes();
                        manager.stopAllRemoteAudioStreams(true);
                        manager.stopAllRemoteVideoStreams(true);
                        String jsonString = JSON.toJSONString(rtsDataBean);
                        Map<String, String> attributes = new HashMap<>(32);
                        attributes.put(Constant.mLocalUid, jsonString);
                        manager.addOrUpdateMemberAttributes(parseLong(Constant.mLocalUid), attributes);
                        rtsTeacherOriginBean = new RtsTeacherBean("0", "0", "0",
                                "0", "0", "0", "0", "1", "0", "0", "0", "0");
                        dissMissDialogProgress();
                    }

                    @Override
                    public void onjoinRoomFailed() {
                        isRetryJoinRoom++;
                        if (isRetryJoinRoom <= 3) {
                            manager.joinRoom(classname, parseLong(Constant.mLocalUid));
                        } else {
                            dissMissDialogProgress();
                            Toast.makeText(LargeClassActivity.this, R.string.joinroom_fail, Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onLeaveRoomSuccess() {
                        //重置举手状态
                        handState = 0;
                        mStudentId.setVisibility(View.GONE);
                        //按钮初始化
                        btnReiseYourHand.setBackgroundResource(R.mipmap.live_exercises);
                        //设置按钮为可点击
                        btnReiseYourHand.setEnabled(true);
                        mAdvertisingPicture.setVisibility(View.VISIBLE);
                        mStudentPlayerView.setVisibility(View.GONE);
                        mStudentPreview.setVisibility(View.GONE);
                        if (isonUsersLeaved) {
                            isonUsersLeaved = false;
                            manager.joinRoom(classname, parseLong(Constant.mLocalUid));

                        } else if (isaudienceNetworkBroken) {
                            manager.joinRoom(classname, parseLong(Constant.mLocalUid));
                        }

                    }

                    @Override
                    public void onLeaveRoomFailed() {
                    }

                    @Override
                    public void onRoomMemberOffline(Set<RoomId> roomIds) {
                        isRoomMemberOffline = true;
                        Toast.makeText(LargeClassActivity.this, R.string.left_to_timeout, Toast.LENGTH_SHORT).show();
                        if (HMR.getState().equals(HMR.State.Connected)) {
                            isRoomMemberOffline = false;
                            stateleaveRoom();
                        }
                    }

                    @Override
                    public void onNetworkQuality(String uid, int txQuality, int rxQuality) {
                        liveNetworkQuality(uid, rxQuality);
                    }

                    @Override
                    public void onRemoteVideoPlay(String uid) {
                        if (teacherId != null) {
                            if (uid.equals(teacherId)) {
                                //在首帧回调中将老师端画布显示
                                mAdvertisingPicture.setVisibility(View.GONE);
                                addText("[TB] onRemoteVideoPlay " + "uid: " + uid);
                            }
                        }
                    }

                    @Override
                    public void onRemoteVideoStatsOfUid(String uid, ThunderEventHandler.RemoteVideoStats stats) {
                        remoteVideoStatsOfUid(uid, stats);
                    }

                    @Override
                    public void onRoomMemberLeft(RoomId roomId, Set<Long> leftMembers) {
                        String remoteUser = (String) SpUtils.get(getApplicationContext(), "remoteUser", "");
                        for (Long members : leftMembers) {
                            //如果主播用户退出房间后将二麦视图隐藏
                            if (!remoteUser.equals("")) {
                                if (members == Long.parseLong(remoteUser)) {
                                    mStudentPlayerView.setVisibility(View.GONE);
                                }
                            }
                            //如果教师退出房间后，将停止老师的视频流并将默认图显示
                            if (teacherId != null) {
                                if (members == Long.parseLong(teacherId)) {
                                    manager.stopRemoteVideoStream(teacherId, true);
                                    mAdvertisingPicture.setVisibility(View.VISIBLE);
                                    mTheacherId.setText("");
                                    handState = 0;
                                    initTeacherData();
                                }
                            }
                        }
                    }

                    @Override
                    public void onRoomAttributesDeleted(RoomId roomId, long userId, Map<String, String> attributes) {
                        Collection<String> values = attributes.values();
                        Collection<String> keySet = attributes.keySet();
                        for (Object key : keySet) {
                            for (String value : values) {
                                BaseLiveBean baseLiveBean = GsonUtil.GsonToBean(value, BaseLiveBean.class);
                                if (baseLiveBean == null) {
                                    return;
                                }
                                //1、如果是online(互动连麦模式)并且是自己的情况下停播
                                //2、如果不是自己的情况下就停止订阅该学生的音视频流
                                if (Constant.ONLINE.equals(baseLiveBean.getKey())) {
                                    if (Constant.mLocalUid.equals(key)) {
                                        setUserAudience();
                                    } else {
                                        String studentId = baseLiveBean.getValue().getUid();
                                        manager.stopRemoteVideoStream(studentId, true);
                                        manager.stopRemoteAudioStream(studentId, true);
                                        mStudentPlayerView.setVisibility(View.GONE);
                                        mStudentId.setVisibility(View.GONE);
                                    }
                                }
                            }
                            if (Constant.TEACHER.equals(key)) {
                                mAdvertisingPicture.setVisibility(View.VISIBLE);
                                manager.stopRemoteVideoStream(teacherId, true);
                                manager.stopRemoteAudioStream(teacherId, true);
                                mTheacherId.setText("");
                                reStartClear();
                                initTeacherData();
                            }
                        }
                    }

                    @Override
                    public void onRoomAttributesAddedOrUpdated(RoomId roomId, long userId,
                                                               Map<String, String> attributes) {
                        Collection<String> values = attributes.values();
                        Collection<String> keySet = attributes.keySet();
                        for (Object key : keySet) {
                            //收到老师更新频道属性后学生做相应的状态更新
                            if (Constant.TEACHER.equals(key)) {
                                for (Object data : values) {
                                    parseTeacherData((String) data);
                                }
                            }
                            for (String value : values) {
                                BaseLiveBean baseLiveBean = GsonUtil.GsonToBean(value, BaseLiveBean.class);
                                if (baseLiveBean == null) {
                                    return;
                                }
                                //1、如果是online(互动连麦模式)并且是自己的情况下开播
                                //2、如果不是自己的情况下就订阅该学生的音视频流
                                if (Constant.ONLINE.equals(baseLiveBean.getKey())) {
                                    if (Constant.mLocalUid.equals(key)) {
                                        setUserBroadcaster();
                                    } else {
                                        String studentId = baseLiveBean.getValue().getUid();
                                        mStudentPlayerView.setVisibility(View.VISIBLE);
                                        manager.setRemoteVideoCanvas(mStudentPlayerView, studentId, -1);
                                        manager.stopRemoteVideoStream(studentId, false);
                                        manager.stopRemoteAudioStream(studentId, false);
                                        mStudentId.setText(studentId);
                                        mStudentId.setVisibility(View.VISIBLE);
                                        SpUtils.put(getApplicationContext(), "remoteUser", studentId);
                                    }
                                }
                            }
                        }
                    }

                    @Override
                    public void onRoomMessageReceived(RoomId roomId, long fromUserId, Message message) {
                        parseMessage(message, fromUserId);
                    }

                    @Override
                    public void onPeerMessageReceived(long fromUserId, Message message) {
                        parseMessage(message, fromUserId);
                    }

                    @Override
                    public void queryRoomAttributes(RequestId requestId, Map<String, String> arg) {
                        for (Map.Entry<String, String> e : arg.entrySet()) {
                            BaseLiveBean baseLiveBean = GsonUtil.GsonToBean(e.getValue(), BaseLiveBean.class);
                            if (baseLiveBean == null) {
                                return;
                            }
                            //1、查询到online(互动连麦模式)并且是自己的情况下开播
                            //2、如果不是自己的情况下就订阅该学生的音视频流
                            if (Constant.ONLINE.equals(baseLiveBean.getKey())) {
                                if (Constant.mLocalUid.equals(e.getKey())) {
                                    setUserBroadcaster();
                                } else {
                                    String studentId = baseLiveBean.getValue().getUid();
                                    mStudentPlayerView.setVisibility(View.VISIBLE);
                                    manager.setRemoteVideoCanvas(mStudentPlayerView, studentId, -1);
                                    manager.stopRemoteVideoStream(studentId, false);
                                    manager.stopRemoteAudioStream(studentId, false);
                                    mStudentId.setText(studentId);
                                    mStudentId.setVisibility(View.VISIBLE);
                                    SpUtils.put(getApplicationContext(), "remoteUser", studentId);
                                }
                            }
                            //如果有老师属性就更新房间内的状态
                            if (Constant.TEACHER.equals(e.getKey())) {
                                parseTeacherData(e.getValue());
                            }
                        }

                    }

                    @Override
                    public void sendUnicastMessageSuccess() {
                        if (handState == 1) { //可以举手，发送举手消息
                            Toast.makeText(getApplicationContext(), R.string.hand_is_up, Toast.LENGTH_SHORT).show();
                            btnReiseYourHand.setBackgroundResource(R.mipmap.raise_your_hand);
                        } else if (handState == 0) { //当前举手中，可以取消举手，发送取消举手消息
                            Toast.makeText(getApplicationContext(), R.string.hand_is_down, Toast.LENGTH_SHORT).show();
                            btnReiseYourHand.setBackgroundResource(R.mipmap.live_exercises);
                        }
                    }

                    @Override
                    public void sendUnicastMessageFailed(Error error) {

                    }

                    @Override
                    public void onHummerStateChanged(HMR.State fromState, HMR.State toState, String reason) {
                        if (HMR.State.Reconnecting.equals(fromState) && HMR.State.Connected.equals(toState)) {
                            if (isReturnBackground) {
                                if (coreService.interfaceStepStatusRtsRoom == 1 &&
                                        coreService.interfaceStepStatusThunderRoom == 1) {
                                    manager.leaveRoom();
                                }
                                return;
                            }

                            if (isRoomMemberOffline) {
                                isRoomMemberOffline = false;
                                stateleaveRoom();
                                return;
                            }

                            if (!(coreService.interfaceStepStatusRtsRoom == 1 &&
                                    coreService.interfaceStepStatusThunderRoom == 1)) {
                                manager.joinRoom(classname, Long.parseLong(Constant.mLocalUid));
                            }
                        }
                    }

                    @Override
                    public void logCatStateCallBack(String log) {
                        addText(log);
                    }
                });

        manager.joinRoom(classname, parseLong(Constant.mLocalUid));
    }

    @Override
    protected void onPause() {
        super.onPause();
        isReturnBackground = true;
        initTeacherData();
    }

    /**
     * 初始化本地老师数据
     */
    private void initTeacherData() {
        if (rtsTeacherOriginBean == null) {
            return;
        }
        rtsTeacherOriginBean.setUid("0");
        rtsTeacherOriginBean.setVideo("0");
        rtsTeacherOriginBean.setAudio("0");
        rtsTeacherOriginBean.setChat("0");
        rtsTeacherOriginBean.setBoard_state("0");
        rtsTeacherOriginBean.setClass_mute("1");
        rtsTeacherOriginBean.setClass_state("0");
    }

    private void stateleaveRoom() {
        if (studentIsBroadcast) {
            studentIsBroadcast = false;
            isonUsersLeaved = true;
            handState = 0;
            manager.leaveRoom();
        } else {
            isaudienceNetworkBroken = true;
            manager.leaveRoom();
        }
    }

    /**
     *
     * 通话中每个用户的网络上下行网络质量报告回调
     *
     */
    private void liveNetworkQuality(String uid, int rxQuality) {
        if (uid.equals("0")) {
            netQuality = rxQuality;
            if (rxQuality == ThunderRtcConstant.NetworkQuality.THUNDER_QUALITY_EXCELLENT |
                    rxQuality == ThunderRtcConstant.NetworkQuality.THUNDER_QUALITY_GOOD) {
                mIvNetWork.setImageResource(R.mipmap.good_signal_quality);
            } else if (rxQuality == ThunderRtcConstant.NetworkQuality.THUNDER_QUALITY_POOR) {
                mIvNetWork.setImageResource(R.mipmap.average_signal_quality);
            } else if (rxQuality == ThunderRtcConstant.NetworkQuality.THUNDER_QUALITY_BAD |
                    rxQuality == ThunderRtcConstant.NetworkQuality.THUNDER_QUALITY_VBAD) {
                mIvNetWork.setImageResource(R.mipmap.poor_signal_quality);
            } else if (rxQuality == ThunderRtcConstant.NetworkQuality.THUNDER_QUALITY_UNKNOWN) {
                mIvNetWork.setImageResource(R.mipmap.no_signal_quality);
            }
        }
    }

    /**
     *
     * 解码器和渲染器输出的帧率
     */
    private void remoteVideoStatsOfUid(String uid, ThunderEventHandler.RemoteVideoStats stats) {
        assert teacherId != null;
        if (uid.equals(teacherId) && stats.decoderOutputFrameRate == 0 && stats.rendererOutputFrameRate == 0) {
            rate++;
            if (rate == Constant.VIDEOSTATS) {
                addText("[TB] onRemoteVideoStatsOfUid  " + "解码帧率：" +
                        stats.decoderOutputFrameRate + "  渲染帧率：" + stats.rendererOutputFrameRate);
                theacherRate = true;
                mAdvertisingPicture.setVisibility(View.VISIBLE);
            }
        } else if (theacherRate) {
            if (uid.equals(teacherId) && stats.decoderOutputFrameRate != 0 && stats.rendererOutputFrameRate != 0) {
                addText("[TB] onRemoteVideoStatsOfUid  " + "解码帧率：" +
                        stats.decoderOutputFrameRate + "  渲染帧率：" + stats.rendererOutputFrameRate);
                mAdvertisingPicture.setVisibility(View.GONE);
                theacherRate = false;
                rate = 0;
            }
        }
    }

    /**
     * 统一处理各种消息
     */
    public void parseMessage(Message message, long fromUid) {
        String data = new String(message.getContent());
        try {
            JSONObject jsonObject = new JSONObject(data);
            String key = jsonObject.getString("key");
            switch (key) {
                case Constant.MESSAGE:   //聊天消息
                    ChatRoomBean messageBean = parseChateMsg(jsonObject, fromUid);
                    //如果是老师消息，添加到老师集合
                    if (messageBean.getType() == ChatRoomBean.TYPE_TEACHER) {
                        teachermsg.add(messageBean);
                    }
                    //添加消息到所有消息集合
                    allmsg.add(messageBean);
                    adapter.notifyDataSetChanged();
                    rcvChateRoom.scrollToPosition(adapter.getItemPosition(messageBean));
                    break;
                case Constant.MUTE:
                    int mute = parseMuteMsg(jsonObject);
                    setMute(mute);
                    break;
                    default:
                        break;
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 老师端退出房间后重置状态
     */
    private void reStartClear() {
        handState = 0;
        mAdvertisingPicture.setVisibility(View.VISIBLE);
        mStudentPlayerView.setVisibility(View.GONE);
    }

    /**
     * 解析老师端状态数据
     */
    private void parseTeacherData(String value) {
        Gson gson = new Gson();
        RtsTeacherBean rtsTeacherBean = gson.fromJson(value, RtsTeacherBean.class);
        teacherId = rtsTeacherBean.getUid();

        //音频是否开启
        if (!rtsTeacherBean.getAudio().equals(rtsTeacherOriginBean.getAudio())) {
            if (rtsTeacherBean.getAudio().equals(Constant.OPEN)) {
                manager.stopRemoteAudioStream(teacherId, false);
            } else {
                manager.stopRemoteAudioStream(teacherId, true);
            }
        }

        //视频是否开启
        if (!rtsTeacherBean.getVideo().equals(rtsTeacherOriginBean.getVideo())) {
            if (rtsTeacherBean.getVideo().equals(Constant.OPEN)) {
                manager.setRemoteVideoCanvas(mTeacherViewPlayerView, teacherId, -1);
                manager.stopRemoteVideoStream(teacherId, false);
            } else {
                manager.stopRemoteVideoStream(teacherId, true);
                mAdvertisingPicture.setVisibility(View.VISIBLE);
            }
        }

        //老师的Uid
        if (!rtsTeacherBean.getUid().equals(rtsTeacherOriginBean.getUid())) {
            if (rtsTeacherBean.getUid() != null) {
                mTheacherId.setText(rtsTeacherBean.getUid());
            }
        }

        //聊天是否开启
        if (!rtsTeacherBean.getClass_mute().equals(rtsTeacherOriginBean.getClass_mute())) {
            if (rtsTeacherBean.getClass_mute().equals(Constant.OPEN)) {
                editSendMsg.setHint(getResources().getString(R.string.hint_muting));
                editSendMsg.setEnabled(false);
            } else {
                editSendMsg.setHint(getResources().getString(R.string.hint_im_message));
                editSendMsg.setEnabled(true);
            }
        }

        //公告内容
        if (!rtsTeacherBean.getPublic_message().equals(rtsTeacherOriginBean.getPublic_message())) {
            if (rtsTeacherBean.getPublic_message() != null) {
                /*
                暂不处理公告内容
                tvPublicMessage.setText(rtsTeacherBean.getPublic_message());*/
            }
        }

        //课堂举手状态
        if (!rtsTeacherBean.getOpen_hand().equals(rtsTeacherOriginBean.getOpen_hand())) {
            if (rtsTeacherBean.getOpen_hand().equals(Constant.OPEN)) {
                btnReiseYourHand.setVisibility(View.VISIBLE);
                btnReiseYourHand.setBackgroundResource(R.mipmap.live_exercises);
            } else {
                btnReiseYourHand.setVisibility(View.INVISIBLE);
                btnReiseYourHand.setBackgroundResource(R.mipmap.raise_your_hand);
            }
        }

        //白板
        if (!rtsTeacherBean.getBoard_uuid().equals(rtsTeacherOriginBean.getBoard_uuid())) {
            String boarduuid = rtsTeacherBean.getBoard_uuid();
            if (boarduuid != null) {
                enterWhitBoard(boarduuid, getResources().getString(R.string.white_token));
            }

        }

        //下课状态
        if (!rtsTeacherBean.getClass_state().equals(rtsTeacherOriginBean.getClass_state())) {
            if (rtsTeacherBean.getClass_state().equals(Constant.CLOSE)) {
                reStartClear();
            }
        }

        //赋值给本地对象
        rtsTeacherOriginBean = rtsTeacherBean;

     }

    /**
     * 禁言/解禁言状态设置
     */
    private void setMute(int mute) {
        if (mute == 0) {
            editSendMsg.setHint(getResources().getString(R.string.hint_im_message));
            editSendMsg.setEnabled(true);
        } else {
            editSendMsg.setHint(getResources().getString(R.string.hint_muting));
            editSendMsg.setEnabled(false);
        }
    }

    /**
     * 解析个人禁言消息
     */
    private int parseMuteMsg(JSONObject jsonObject) throws JSONException {

        return jsonObject.getInt(Constant.VALUE);
    }

    /**
     * 解析处理聊天消息
     */
    private ChatRoomBean parseChateMsg(JSONObject jsonObject, long fromUid) throws JSONException {
        JSONObject jsonObjectJsonValue = jsonObject.getJSONObject(Constant.JSONVALUE);
        String msgContent = jsonObjectJsonValue.getString(Constant.MSG_CONTENT);
        long msgTime = jsonObjectJsonValue.getLong(Constant.MSG_TIME);
        String msgNickname = jsonObjectJsonValue.getString(Constant.MSG_NIKENAME);
        int msgType = ChatRoomBean.TYPE_OTHER; //其他消息

        if (String.valueOf(fromUid).equals(teacherId)) { //老师发的消息
            msgType = ChatRoomBean.TYPE_TEACHER;
        } else if (String.valueOf(fromUid).equals(Constant.mLocalUid)) { //自己发的消息
            msgType = ChatRoomBean.TYPE_ME;
        }
        return new ChatRoomBean(msgContent, msgTime, msgNickname, msgType);
    }
    //-----------------------------消息信令数据处理 End-----------------------------

    /**
     * 点击事件
     */
    @OnClick({R.id.img_teacherMsg, R.id.btn_reise_your_hand, R.id.constraint_layout, R.id.btn_the_console,
            R.id.back_direct_broadcasting_room, R.id.tv_live_assessment, R.id.alphaView})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_direct_broadcasting_room:
                if (hasNetwork()) {
                    finish();
                } else {
                    Toast.makeText(this, R.string.network_error, Toast.LENGTH_SHORT).show();
                }
                break;

            case R.id.btn_reise_your_hand://举手/取消举手
                if (HMR.getState().equals(HMR.State.Connected)) {
                    if (teacherId == null) {
                        return;
                    }
                    if (handState == 0) { //可以举手，发送举手消息
                        handState = 1;
                        sendHandMessage(handState, netQuality, teacherId);
                    } else if (handState == 1) { //当前举手中，可以取消举手，发送取消举手消息
                        handState = 0;
                        sendHandMessage(handState, netQuality, teacherId);
                    }
                } else {
                    Toast.makeText(this, R.string.network_error, Toast.LENGTH_SHORT).show();
                }
                break;

            case R.id.img_teacherMsg: //只看老师/恢复
                isOnlyShowTeacherMsg = !isOnlyShowTeacherMsg;
                if (isOnlyShowTeacherMsg) {
                    Toast.makeText(this, R.string.just_see_the_teacher, Toast.LENGTH_SHORT).show();
                    imgTeacherMsg.setImageResource(R.mipmap.just_see_all);
                    adapter.setNewData(teachermsg);
                    adapter.notifyDataSetChanged();
                    if (teachermsg.size() == 0) {
                        return;
                    }
                    rcvChateRoom.scrollToPosition(teachermsg.size() - 1);
                } else {
                    Toast.makeText(this, R.string.just_see_all, Toast.LENGTH_SHORT).show();
                    imgTeacherMsg.setImageResource(R.mipmap.just_see_the_teacher);
                    adapter.setNewData(allmsg);
                    adapter.notifyDataSetChanged();
                    if (allmsg.size() == 0) {
                        return;
                    }
                    rcvChateRoom.scrollToPosition(allmsg.size() - 1);
                }
                break;

            case R.id.btn_the_console:
                if (!console) {
                    console = true;
                    mLogCat.setVisibility(View.VISIBLE);
                    mTheConsole.setBackgroundResource(R.mipmap.console_off);
                } else {
                    console = false;
                    mLogCat.setVisibility(View.GONE);
                    mTheConsole.setBackgroundResource(R.mipmap.live_console);

                }
                break;

            case R.id.tv_live_assessment:
                startActivity(new Intent(this, FeedBackActivity.class));
                break;

            case R.id.alphaView:
                if (isLiveStatusBar) { ////显示中，则隐藏
                    isLiveStatusBar = false;
                    mLiveStatusBar.setVisibility(View.INVISIBLE);
                    weakHandler.removeMessages(CODE_HIDEN);
                } else { //已经隐藏，则显示，另外重置时间
                    mLiveStatusBar.setVisibility(View.VISIBLE);
                    resetTime();
                }
                break;

            default:
                break;
        }
    }

    /**
     * 发送举手消息
     */
    private void sendHandMessage(int state, int netQuality, String classname) {
        try {
            //组装jsonValue
            JSONObject jsonObjectJsonValue = new JSONObject();
            jsonObjectJsonValue.put(Constant.STATE, state);
            //获取的时间是毫秒级别的，传入是需要秒级别
            jsonObjectJsonValue.put(Constant.NETQUALITY, netQuality);

            JSONObject jsonObjectData = new JSONObject();
            jsonObjectData.put(Constant.KEY, Constant.HAND); //组装key
            jsonObjectData.put(Constant.VALUE, ""); //组装value
            jsonObjectData.put(Constant.JSONVALUE, jsonObjectJsonValue); //组装jsonValue
            String type = "100";
            byte[] data = jsonObjectData.toString().getBytes(); //组装好的json放data
            Message message = new Message(type, data, new HashMap<>(0));
            manager.sendUnicastMessage(message, Long.parseLong(classname));

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private BoardEventListener boardEventListener = new BoardEventListener() {
        @Override
        public void onRoomPhaseChanged(RoomPhase phase) {

        }

        @Override
        public void onSceneStateChanged(SceneState state) {

        }

        @Override
        public void onMemberStateChanged(MemberState state) {

        }

        @Override
        public void onJoinRoomFaild(SDKError error) {
            addText("[白板]onJoinRoomFaild" + error.getMessage());
        }
    };

    public void leaveSetAttributes() {
        if (hasNetwork()) {
            String appid = getApplicationContext().getString(R.string.app_id);
            if (appid.equals("")) {
                addText("[HMR] please input appid");
                return;
            }
            EducationServiceImpl manager = EducationServiceImpl.getInstances();
            manager.stopDownMicrophone();
            manager.leaveRoom();
        }
    }

    public void leaveRoom() {
        if (hasNetwork()) {
            String appid = getApplicationContext().getString(R.string.app_id);
            if (appid.equals("")) {
                addText("[HMR] please input appid");
                return;
            }
            EducationServiceImpl manager = EducationServiceImpl.getInstances();
            manager.leaveRoom();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        weakHandler.removeCallbacksAndMessages(null);
        boardManager.disconnect();

    }

    private static class WeakHandler extends Handler {
        WeakReference<LargeClassActivity> weakReference;

        WeakHandler(LargeClassActivity activity) {
            weakReference = new WeakReference<>(activity);
        }

        @Override
        public void handleMessage(@NonNull android.os.Message msg) {
            LargeClassActivity activity = weakReference.get();
            if (activity != null) {
                if (msg.what == CODE_HIDEN) {
                    activity.mLiveStatusBar.setVisibility(View.INVISIBLE);
                    activity.isLiveStatusBar = false;
                    activity.dissMissDialogProgress();
                }
            }
        }
    }

    /**
     * 重置隐藏标题倒计时
     */
    private void resetTime() {
        isLiveStatusBar = true;
        weakHandler.removeMessages(CODE_HIDEN);
        android.os.Message msg = weakHandler.obtainMessage(CODE_HIDEN);
        weakHandler.sendMessageDelayed(msg, hidenTime);
    }
}
