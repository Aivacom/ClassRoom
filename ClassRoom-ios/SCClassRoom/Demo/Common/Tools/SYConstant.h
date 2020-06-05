//
//  SYConstant.h
//  SCClassRoom
//
//  Created by Huan on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//


extern CGFloat const kLeftOrRightConstraints;   // 布局属性
extern NSString * const kRoomAttKeyForTeacher;  // 频道属性
extern NSString * const kRoomAttKeyForAnchor;   // 频道属性
extern NSString * const kPeerAttKeyLinkIdForTeacher;    // 老师个人属性-连麦/断麦
extern NSString * const kRoomAttKeyOperationOnline;     // 频道属性里面连麦/断麦操作


//用户角色
extern NSString * const kRoleKey;           
extern NSString * const kRoleAnchor;
extern NSString * const kRoleAudience;

//申请举手/取消举手
extern NSString * const kHand;
extern NSString * const kRequireHand;
extern NSString * const kCancleHand;

//老师同意连麦/断麦
extern NSString * const kMike;
extern NSString * const kAgreeMike;
extern NSString * const kCloseMike;


//聊天室消息
extern NSString * const kChatRoomMessage;

//n次渲染失败后显示默认图
extern int const kRenderFailCount;

// 开启/关闭举手功能
extern NSString * const kOpenHand;
extern NSString * const kCloseHand;
// 开启/关闭全员禁言
extern NSString * const kOpenClassMute;
extern NSString * const kCloseClassMute;
// 上课/下课
extern NSString * const kClassStateStart;
extern NSString * const kClassStateEnd;
// 视频流开启/关闭
extern NSString * const kVideoOpen;
extern NSString * const kVideoClose;
// 音频流开启/关闭
extern NSString * const kAudioOpen;
extern NSString * const kAudioClose;
// 开启/关闭个人禁言
extern NSString * const kMute;
extern NSString * const kOpenMute;
extern NSString * const kCloseMute;
