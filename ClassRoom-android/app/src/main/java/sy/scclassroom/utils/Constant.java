package sy.scclassroom.utils;

public class Constant {
    public static final String TAG = "ClassRoom-android";

    /**
     * 以毫秒为Uid，取后8位
     */
    public static String mLocalUid = String.valueOf(System.currentTimeMillis() % 100000000);

    /**
     * 个人人禁言/解禁言
     */
    public static final String MUTE = "mute";

    /**
     * 状态是否是连麦
     */
    public static final String ONLINE = "online";

    /**
     * 聊天室消息
     */
    public static final String KEY = "key";
    public static final String VALUE = "value";
    public static final String JSONVALUE = "jsonValue";
    public static final String MSG_CONTENT = "msg_content";
    public static final String MSG_TIME = "msg_time";
    public static final String MSG_NIKENAME = "msg_nickname";
    public static final String MESSAGE = "message";

    /**
     * 主播属性
     * Teacher (老师)
     * StudentAnchor (学生)
     */
    public static final String TEACHER = "Teacher";

    /**
     * 取消/订阅 || 开启/关闭 || 上课/下课
     */
    public static final String OPEN = "1";
    public static final String CLOSE = "0";

    /**
     * 举手信令发送的Message
     * 举手属性 HAND
     * 1.HANDUP 举手
     * 2.CANCEL_HANDUP
     */
    public static final String HAND = "hand";
    public static final String STATE = "state";
    public static final String NETQUALITY = "netQuality";

    /**
     * 解码器采集和渲染的判断次数
     */
    public static final int VIDEOSTATS = 2;

}
