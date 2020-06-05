package sy.scclassroom.bean;



public class RtsStudentBean {

    private String nickname;
    private String uid;
    private String video; //视频是否开启
    private String audio; //音频是否开启
    private String chat; //聊天是否开启
    private String role; //角色 (1主播，2观众)
    private String networkQuality; //网络质量
    private String hand; //是否举手

    public RtsStudentBean(String nickname, String uid, String video, String audio, String chat,
                          String role, String networkQuality, String hand) {
        this.nickname = nickname;
        this.uid = uid;
        this.video = video;
        this.audio = audio;
        this.chat = chat;
        this.role = role;
        this.networkQuality = networkQuality;
        this.hand = hand;
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

    public String getNetworkQuality() {
        return networkQuality;
    }

    public void setNetworkQuality(String networkQuality) {
        this.networkQuality = networkQuality;
    }

    public String getHand() {
        return hand;
    }

    public void setHand(String hand) {
        this.hand = hand;
    }
}
