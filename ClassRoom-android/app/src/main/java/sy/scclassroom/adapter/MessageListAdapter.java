package sy.scclassroom.adapter;

import android.content.Context;
import androidx.annotation.Nullable;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.viewholder.BaseViewHolder;
import com.sy.scclassroom.R;
import sy.scclassroom.bean.ChatRoomBean;
import sy.scclassroom.utils.TimeUtil;
import org.jetbrains.annotations.NotNull;
import java.util.List;

public class MessageListAdapter extends BaseQuickAdapter<ChatRoomBean, BaseViewHolder> {

    private List<ChatRoomBean> data;
    private Context mContext;

    public MessageListAdapter(Context mContext, @Nullable List<ChatRoomBean> data) {
        super(R.layout.item_message, data);
        this.data = data;
        this.mContext = mContext;
    }

    @Override
    protected void convert(@NotNull BaseViewHolder helper, ChatRoomBean item) {
        //item.getMsgTime()获取的是秒级别的，需要毫秒级别转换
        helper.setText(R.id.tv_time, TimeUtil.stampToDate(item.getMsgTime() * 1000));
        helper.setText(R.id.tv_content, item.getMsgContent());

        if (item.getType() == ChatRoomBean.TYPE_ME) {
            setMeStyle(helper);
        } else if (item.getType() == ChatRoomBean.TYPE_TEACHER) {
            setTeacherStyle(helper, item);
        } else if (item.getType() == ChatRoomBean.TYPE_OTHER) {
            setOtherStyle(helper, item);
        }

    }

    private void setMeStyle(BaseViewHolder helper) {
        helper.setText(R.id.tv_nikename, mContext.getResources().getString(R.string.role_me));
        helper.setTextColor(R.id.tv_content, mContext.getResources().getColor(R.color.blue_0092FF));
    }

    private void setTeacherStyle(BaseViewHolder helper, ChatRoomBean item) {
        helper.setText(R.id.tv_nikename, mContext.getResources().getString(R.string.role_teacher));
        helper.setTextColor(R.id.tv_content, mContext.getResources().getColor(R.color.green_00BA9E));
    }

    private void setOtherStyle(BaseViewHolder helper, ChatRoomBean item) {
        helper.setText(R.id.tv_nikename, item.getMsgNikename() + "");
        helper.setTextColor(R.id.tv_content, mContext.getResources().getColor(R.color.gray_666666));
    }
}
