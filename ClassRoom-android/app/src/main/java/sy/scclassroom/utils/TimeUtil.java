package sy.scclassroom.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeUtil {

    public static String stampToDate(long stamp) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm"); // HH:mm
        Date date = new Date(stamp);
        return simpleDateFormat.format(date);
    }

    public static long getCurrentTime() {
        Date date = new Date(System.currentTimeMillis());
        return date.getTime();
    }

}
