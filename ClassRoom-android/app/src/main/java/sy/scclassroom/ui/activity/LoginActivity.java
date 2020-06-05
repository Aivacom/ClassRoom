package sy.scclassroom.ui.activity;
import android.Manifest;
import android.content.Intent;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.sy.scclassroom.BuildConfig;
import com.sy.scclassroom.R;
import java.util.Calendar;
import sy.scclassroom.base.BaseActivity;
import sy.scclassroom.utils.Constant;
import sy.scclassroom.utils.PermissionUtils;
import sy.scclassroom.utils.SpUtils;
import butterknife.BindView;
import butterknife.OnClick;

public class LoginActivity extends BaseActivity {

    @BindView(R.id.tv_classroom_assessment)
    protected TextView mClassAssessment;
    @BindView(R.id.text_multilingual)
    protected TextView mMultilingual;
    @BindView(R.id.et_class_room)
    protected EditText mEtClassRoom;
    @BindView(R.id.iv_classroom_clear)
    protected ImageView mClassRoomClear;
    @BindView(R.id.et_user_name)
    protected EditText mEtUserName;
    @BindView(R.id.iv_username_clear)
    protected ImageView mUserNameClear;
    @BindView(R.id.btn_join_classroom)
    protected Button mBtnJoinClassRoom;
    @BindView(R.id.tv_scclassroom_data)
    protected TextView mClassRoomData;
    @BindView(R.id.tv_classtype)
    protected TextView mClassType;
    @BindView(R.id.tv_classroom_version)
    protected TextView mClassRoomVersion;
    private String classname;
    private String username;
    private String[] permissions = new String[]{Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_EXTERNAL_STORAGE};

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_login;

    }

    @Override
    protected void initData() {
        if (!isTaskRoot()) {
            finish();
            return;
        }
        PermissionUtils.checkAndRequestMorePermissions(LoginActivity.this,
                permissions, PermissionUtils.REQUEST_CODE_PERMISSIONS,
                () -> Log.d(Constant.TAG, "已授予权限"));
    }

    @Override
    protected void initView() {
        //获取当前系统语言
        getCountryLanguage();
        //监听输入框
        initListener();

        Calendar calendar  = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        //月
        int month = calendar.get(Calendar.MONTH) + 1;
        //日
        int day = calendar.get(Calendar.DAY_OF_MONTH);

        //设置版本号
        mClassRoomVersion.setText("V" + BuildConfig.VERSION_NAME);

        //设置构建版本、时间、SDK版本号
        mClassRoomData.setText("Build: " + BuildConfig.VERSION_CODE + ",  " + month + "/" + day
                + "/" + year  + ",  HMR " + BuildConfig.HUMMER_VERSION + ",\n" + " TB " + BuildConfig.THUNDER_VERSION);

    }

    private void getCountryLanguage() {
        String lanStr = (String) SpUtils.get(this, "lan", "zh_CN");
        if (lanStr.equals("zh_CN")) {
            mMultilingual.setText(getResources().getString(R.string.english));

        } else {
            mMultilingual.setText("中文");
        }
    }

    /**
     * 键盘监听事件
     */
    private void initListener() {
        mEtClassRoom.addTextChangedListener(classRoomWatcher);
        mEtUserName.addTextChangedListener(userNameWatcher);

    }

    private TextWatcher classRoomWatcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            String classname = mEtClassRoom.getText().toString();
            if (mEtClassRoom.getEditableText().length() >= 1) {
                if (classname.equals("0")) {
                    Toast.makeText(LoginActivity.this, R.string.the_input_field_cannot_be_classroom, Toast.LENGTH_SHORT).show();
                    mEtClassRoom.setText("");
                } else {
                    mClassRoomClear.setVisibility(View.VISIBLE);
                }
            } else {
                mClassRoomClear.setVisibility(View.GONE);
            }
        }
    };

    private TextWatcher userNameWatcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            String username = mEtUserName.getText().toString();
            if (mEtUserName.getEditableText().length() >= 1) {
                if (username.equals("0")) {
                    Toast.makeText(LoginActivity.this, R.string.the_input_field_cannot_be_nicename, Toast.LENGTH_SHORT).show();
                    mEtUserName.setText("");
                } else {
                    mUserNameClear.setVisibility(View.VISIBLE);
                }
            } else {
                mUserNameClear.setVisibility(View.GONE);
            }

        }
    };

    /**
     * 点击事件
     */
    @OnClick({R.id.text_multilingual, R.id.tv_classroom_assessment,
            R.id.iv_classroom_clear, R.id.iv_username_clear, R.id.btn_join_classroom})
    public  void  onClick(View view) {
        switch (view.getId()) {
            case R.id.btn_join_classroom:
                joinRoom();
                break;

            case R.id.text_multilingual:
                String lanStr = (String) SpUtils.get(this, "lan", "zh_CN");
                switchLan(lanStr);
                break;

            case R.id.tv_classroom_assessment:
                startActivity(new Intent(this, FeedBackActivity.class));
                break;

            case R.id.iv_classroom_clear:
                mEtClassRoom.setText("");
                break;

            case R.id.iv_username_clear:
                mEtUserName.setText("");
                break;

            default:
                break;
        }

    }

    private void switchLan(String lanstr) {
        if (lanstr.contains("US")) {
            lanstr = "zh_CN";
        } else {
            lanstr = "en_US";
        }
        SpUtils.put(this, "lan", lanstr);
        resetLan();
    }


    private void resetLan() {
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    /**
     * 进入直播间
     */
    private void joinRoom() {
        classname = mEtClassRoom.getText().toString();
        username = mEtUserName.getText().toString();
        if (TextUtils.isEmpty(classname)) {
            Toast.makeText(this, R.string.please_enter_class_id, Toast.LENGTH_SHORT).show();
        } else if (TextUtils.isEmpty(username)) {
            Toast.makeText(this, R.string.username_cannot_be_empty, Toast.LENGTH_SHORT).show();

        } else {
            if (hasNetwork()) {
                if (classname.length() < 4 || username.length() < 4) {
                    Toast.makeText(this, R.string.please_enter_a_number, Toast.LENGTH_SHORT).show();
                } else {
                    startIntent();
                }
            } else {
                Toast.makeText(this, R.string.network_error, Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void startIntent() {
        SpUtils.put(getApplicationContext(), "classname", classname);
        SpUtils.put(getApplicationContext(), "username", username);
        startActivity(new Intent(getApplicationContext(), LargeClassActivity.class));

    }
}