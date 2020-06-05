package sy.scclassroom.base;

import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import sy.scclassroom.utils.CommUtils;
import sy.scclassroom.utils.LanguageContextWrapper;
import sy.scclassroom.utils.LoadingDialog;
import sy.scclassroom.utils.NetUtil;
import sy.scclassroom.utils.SpUtils;
import sy.scclassroom.utils.StatusBarUtil;
import sy.scclassroom.widget.EyeProtection;
import java.util.Locale;
import butterknife.ButterKnife;

public abstract class BaseActivity extends AppCompatActivity {
    private EyeProtection.EyeProtectionView eyeProtectionView;
    private LoadingDialog dialog;

    @Override
    protected void attachBaseContext(Context newBase) {
        String lanStr = (String) SpUtils.get(newBase, "lan", "zh_CN");
        Locale type = Locale.SIMPLIFIED_CHINESE;
        if (lanStr.equals("zh_CN")) {
            type = Locale.SIMPLIFIED_CHINESE;
        } else {
            type = Locale.ENGLISH;
        }
        Context context = LanguageContextWrapper.wrap(newBase, type);
        super.attachBaseContext(context);
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        language();
        setContentView(getLayoutResId());
        setStatusBar();
        ButterKnife.bind(this);
        initData();
        initView();
    }

    protected void setStatusBar() {
        //这里做了两件事情，1.使状态栏透明并使contentView填充到状态栏 2.预留出状态栏的位置，防止界面上的控件离顶部靠的太近。这样就可以实现开头说的第二种情况的沉浸式状态栏了
        StatusBarUtil.setTransparent(this);
    }

    private void language() {
        String lanStr = (String) SpUtils.get(this, "lan", "zh_CN");
        CommUtils.changeLanguage(this, lanStr);
    }

    protected void showDialogProgress() {
        if (dialog != null && dialog.isShowing()) {
            return;
        }
        LoadingDialog.Builder builder = new LoadingDialog.Builder(this)
                .setCancelable(false)
                .setCancelOutside(false);
        dialog = builder.create();
        dialog.show();
    }
    protected void dissMissDialogProgress() {
        if (dialog != null) {
            dialog.dismiss();
        }
    }


    protected abstract int getLayoutResId();


    protected abstract void initData();

    protected abstract void initView();


    @Override
    protected void onStart() {
        super.onStart();
        if (EyeProtection.isNeedShow()) {
            showEyeProtection();
        } else {
            dismissEyeProtection();
        }
    }

    protected void showEyeProtection() {
        if (eyeProtectionView == null) {
            eyeProtectionView = new EyeProtection.EyeProtectionView(this);
        }
        if (eyeProtectionView.getParent() == null) {
            addContentView(eyeProtectionView, new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        }
        eyeProtectionView.setVisibility(View.VISIBLE);
    }

    protected void dismissEyeProtection() {
        if (eyeProtectionView != null) {
            eyeProtectionView.setVisibility(View.GONE);
        }
    }

    /**
     * 判断是否有网络
     */
    public boolean hasNetwork() {
        return NetUtil.hasNetwork(this);
    }

    protected void removeFromParent(View view) {
        ViewGroup viewGroup = (ViewGroup) view.getParent();
        if (viewGroup != null) {
            viewGroup.removeView(view);
        }
    }

}

