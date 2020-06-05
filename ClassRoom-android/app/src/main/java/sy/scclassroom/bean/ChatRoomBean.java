package sy.scclassroom.bean;

public class ChatRoomBean {
    public static int TYPE_ME = 0;
    public static int TYPE_TEACHER = 1;
    public static int TYPE_OTHER = 2;
    private String msgContent;
    private long msgTime;
    private String msgNikename;
    private int type; //对应0、1、2

    public ChatRoomBean(String msgContent, long msgTime, String msgNikename, int type) {
        this.msgContent = msgContent;
        this.msgTime = msgTime;
        this.msgNikename = msgNikename;
        this.type = type;
    }

    public String getMsgContent() {
        return msgContent;
    }

    public void setMsgContent(String msgContent) {
        this.msgContent = msgContent;
    }

    public long getMsgTime() {
        return msgTime;
    }

    public void setMsgTime(long msgTime) {
        this.msgTime = msgTime;
    }

    public String getMsgNikename() {
        return msgNikename;
    }

    public void setMsgNikename(String msgNikename) {
        this.msgNikename = msgNikename;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
