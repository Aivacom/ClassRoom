package sy.scclassroom;
import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import androidx.multidex.MultiDex;
import org.jetbrains.annotations.NotNull;
import sy.scclassroom.manager.PreferenceManager;
import sy.scclassroom.ui.activity.LargeClassActivity;
import sy.scclassroom.utils.SpUtils;
import sy.scclassroom.utils.ToastManager;

public class MyApplication extends Application {
    private static MyApplication instance;
    public static Context mContext;
    private static final String LARGEACTIVITY = "sy.scclassroom.ui.activity.LargeClassActivity";

    @Override
    public void onCreate() {
        super.onCreate();
        //获取配置的app ID
        MultiDex.install(this);
        mContext = this;
        instance = this;
        initActivityCallBack();
        PreferenceManager.init(this);
        ToastManager.init(this);
    }

    public static MyApplication getInstance() {
        return instance;
    }

    private void initActivityCallBack() {
        registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(@NotNull Activity activity, Bundle savedInstanceState) {

            }
            @Override
            public void onActivityStarted(@NotNull Activity activity) {

            }

            @Override
            public void onActivityResumed(@NotNull Activity activity) {
            }

            @Override
            public void onActivityPaused(@NotNull Activity activity) {
            }

            @Override
            public void onActivityStopped(@NotNull Activity activity) {
                if (activity.getClass().getName().equals(LARGEACTIVITY)) {
                    Boolean studentIsBroadcast = (Boolean) SpUtils.get(getApplicationContext(),
                            "studentIsBroadcast", false);
                    if (activity instanceof LargeClassActivity) {
                        LargeClassActivity largeClassActivity = (LargeClassActivity) activity;
                        if (studentIsBroadcast != null) {
                            if (studentIsBroadcast) {
                                // studentIsBroadcast  = true ，为主播，设置身份为2
                                largeClassActivity.leaveSetAttributes();
                            } else {
                                //如果为false ，为观众，退出媒体房间
                                largeClassActivity.leaveRoom();
                            }
                        }
                    }
                }
            }

            @Override
            public void onActivitySaveInstanceState(@NotNull Activity activity, @NotNull Bundle outState) {

            }

            @Override
            public void onActivityDestroyed(@NotNull Activity activity) {

            }
        });
    }

}
