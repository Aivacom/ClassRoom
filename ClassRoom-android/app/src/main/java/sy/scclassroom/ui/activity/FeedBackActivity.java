package sy.scclassroom.ui.activity;

import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.widget.Toolbar;
import com.sy.scclassroom.BuildConfig;
import com.sy.scclassroom.R;
import sy.scclassroom.base.BaseActivity;
import butterknife.BindView;
import butterknife.OnClick;

public class FeedBackActivity extends BaseActivity {

    @BindView(R.id.assessment_toolbar)
    Toolbar toolbar;
    @BindView(R.id.btn_feedback)
    Button mFeedbackBtn;
    @BindView(R.id.et_feedback_content)
    EditText mFeedbackEdit;
    @BindView(R.id.tv_feedback_version)
    TextView mTvFeedBackVersion;


    @Override
    protected int getLayoutResId() {
        return R.layout.activity_assessment;
    }

    @Override
    protected void initData() {

    }

    @Override
    protected void initView() {
        toolbar.setNavigationOnClickListener(v -> FeedBackActivity.this.finish());
        mTvFeedBackVersion.setText("当前版本:V" + BuildConfig.VERSION_NAME +
                "-classroom-" + BuildConfig.VERSION_CODE );
        //设置键盘监听
        mFeedbackEdit.addTextChangedListener(mFeedbackEditWatcher);
    }
    //ClassRoom输入框监听事件
    private TextWatcher mFeedbackEditWatcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            if (mFeedbackEdit.getEditableText().length() >= 1) {
                mFeedbackBtn.setEnabled(true);
            } else {
                mFeedbackBtn.setEnabled(false);
            }
        }
    };
    @OnClick({R.id.btn_feedback})
    public  void  onClick(View view) {
        switch (view.getId()) {
            case R.id.btn_feedback:
                String feedbackEdit = mFeedbackEdit.getText().toString();
                if (TextUtils.isEmpty(feedbackEdit)) {
                    Toast.makeText(this, R.string.please_describe_your_issue, Toast.LENGTH_SHORT).show();
                }
                break;

                default:
                    break;
        }
    }
}
