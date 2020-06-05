package sy.scclassroom.utils;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import java.util.Locale;

public class CommUtils {
    private CommUtils() {
    }

    public static void changeLanguage(Context context, String lanStr) {
        Resources resources = context.getResources();
        Configuration config = resources.getConfiguration();
        String[] lans = lanStr.split("_");

        if (lanStr.startsWith("zh_")) {
            config.locale = new Locale(lans[0], lans[1]);
        } else {
            config.locale = new Locale("en", "US");
        }

        resources.updateConfiguration(config, resources.getDisplayMetrics());
    }
}
