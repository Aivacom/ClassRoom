package sy.scclassroom.bean;

public class RtsTeacherBean {

    private String nickname;
    private String uid;
    private String video; //视频是否开启
    private String audio; //音频是否开启
    private String chat; //聊天是否开启
    private String role; //角色(1主播，2观众)
    private String public_message; //公告内容
    private String class_mute; //全员禁言状态
    private String open_hand; //课堂举手状态
    private String board_state; //白板开启状态
    private String board_uuid; //白板 uuid
    private String class_state; //上课状态

    public RtsTeacherBean(String nickname, String uid, String video, String audio,
                          String chat, String role, String public_message, String class_mute, String open_hand,
                          String board_state, String board_uuid, String class_state) {
        this.nickname = nickname;
        this.uid = uid;
        this.video = video;
        this.audio = audio;
        this.chat = chat;
        this.role = role;
        this.public_message = public_message;
        this.class_mute = class_mute;
        this.open_hand = open_hand;
        this.board_state = board_state;
        this.board_uuid = board_uuid;
        this.class_state = class_state;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public String getAudio() {
        return audio;
    }

    public void setAudio(String audio) {
        this.audio = audio;
    }

    public String getChat() {
        return chat;
    }

    public void setChat(String chat) {
        this.chat = chat;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPublic_message() {
        return public_message;
    }

    public void setPublic_message(String public_message) {
        this.public_message = public_message;
    }

    public String getClass_mute() {
        return class_mute;
    }

    public void setClass_mute(String class_mute) {
        this.class_mute = class_mute;
    }

    public String getOpen_hand() {
        return open_hand;
    }

    public void setOpen_hand(String open_hand) {
        this.open_hand = open_hand;
    }

    public String getBoard_state() {
        return board_state;
    }

    public void setBoard_state(String board_state) {
        this.board_state = board_state;
    }

    public String getBoard_uuid() {
        return board_uuid;
    }

    public void setBoard_uuid(String board_uuid) {
        this.board_uuid = board_uuid;
    }

    public String getClass_state() {
        return class_state;
    }

    public void setClass_state(String class_state) {
        this.class_state = class_state;
    }
}
