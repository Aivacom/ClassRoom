package sy.scclassroom.utils;

public class RoomToken {

    /**
     * code : 200
     * msg : {"roomToken":"WHITEcGFydGD"}
     */

    private int code;
    private MsgBean msg;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public MsgBean getMsg() {
        return msg;
    }

    public void setMsg(MsgBean msg) {
        this.msg = msg;
    }

    public static class MsgBean {
        /**
         * roomToken : WHITEcabm
         */

        private String roomToken;

        public String getRoomToken() {
            return roomToken;
        }

        public void setRoomToken(String roomToken) {
            this.roomToken = roomToken;
        }
    }
}
