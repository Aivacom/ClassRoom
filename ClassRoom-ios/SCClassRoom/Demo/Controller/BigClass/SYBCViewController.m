//
//  SYBCViewController.m
//  SCClassRoom
//
//  Created by Huan on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYBCViewController.h"
#import "SYBCEducationManager.h"
#import "MBProgressHUD+SYHUD.h"
#import "SYBigStatusView.h"
#import "SYCanvasView.h"
#import "SYBigToolView.h"
#import "SYConsoleManager.h"
#import "SYConstant.h"
#import "MJExtension.h"
#import "SYMessageModel.h"
#import "SYMessageView.h"
#import "NSBundle+SYLanguage.h"
#import <IQKeyboardManager.h>
#import "SYMessageTxtModel.h"
#import "UITextField+SYAdditions.h"
#import "SYFeedbackController.h"
#import "SYNavigationController.h"
#import "SYStudentModel.h"
#import "SYTeacherModel.h"
#import "SYOperation.h"
#import "SYUtils.h"

typedef NS_OPTIONS(NSInteger, SYBCStatus) {
    SYBCStatusNormal = 0,                       // 默认状态
    SYBCStatusClickCloseBtn = 1 << 0,           // 是否点击关闭按钮
    SYBCStatusBackground = 1 << 1,              // 是否在后台
    SYBCStatusJoinFailAndReJoining = 1 << 2,    // 是否加入房间失败并重新加入中
    SYBCStatusConnectLostOffline = 1 << 3,      // 是否断线离开状态
    SYBCStatusConnectedAndReJoining = 1 << 4,   // hummer 重连后重新加入房间中
};

@interface SYBCViewController ()<SYInterfaceManagerDelegate, SYBigStatusViewDelegate, SYBigToolViewDelegate, SYMessageViewDelegate, UITextFieldDelegate,SYWhiteBoardManagerDelegate>

@property (nonatomic, strong) SYBCEducationManager *manager;
@property (nonatomic, strong) UIView *bgView;                   // 适配 X 两侧留黑边
@property (nonatomic, strong) SYBigStatusView *statusView;      // 顶部状态视图
@property (nonatomic, strong) SYBigToolView *toolView;          // 底部工具栏
@property (nonatomic, strong) SYCanvasView *canvasForTeaView;   // 老师画布
@property (nonatomic, strong) SYCanvasView *canvasForStuView;   // 学生画布
@property (nonatomic, strong) UITextView *noticeTextView;       // 公告栏
@property (nonatomic, strong) SYMessageView *messageView;       // 聊天视图
@property (nonatomic, strong) UITextField *chatTextField;       // 输入框
@property (nonatomic, strong) WhiteRoom *whiteRoom;             // 白板房间
@property (nonatomic, strong) WhiteBoardView *whiteView;        // 白板视图
@property (nonatomic, strong) UIButton *placeholderBtn;         // 白板上方按钮点击事件

@property (nonatomic, strong) SYStudentModel *studentModel;
@property (nonatomic, strong) SYStudentModel *studentAnchorModel;
@property (nonatomic, strong) SYTeacherModel *teacherModel;
@property (nonatomic, assign) int renderFalseCount;             // 老师视图渲染错误次数
@property (nonatomic, strong) NSOperationQueue *bcQueue;
@property (nonatomic, assign) SYBCStatus bcStatus;              // 房间状态
@property (nonatomic, assign) int reJoinRoomCount;              // 重试加入房间次数，默认3次
@property (nonatomic, assign) int reJoinWhiteboardCount;        // 重试加入白板次数，默认3次

@end

@implementation SYBCViewController

- (void)dealloc
{
    NSLog(@"%@ dealloc", NSStringFromClass([self class]));
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    if (self.bcStatus & SYBCStatusBackground) {
        self.bcStatus ^= SYBCStatusBackground;
    }
    [self joinRoom];
    [[IQKeyboardManager sharedManager] setEnable:NO];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self initOperation];
}

/// 初始化操作
- (void)initOperation
{
    [self setup];
    [self setupNotification];
    
    _renderFalseCount = 0;
    _studentModel = [SYStudentModel new];
    self.studentModel.uid = self.studentUid;
    self.studentModel.nickname = self.nickName;
    _studentAnchorModel = [SYStudentModel new];
    _teacherModel = [SYTeacherModel new];
    _bcQueue = [NSOperationQueue new];
    _bcQueue.maxConcurrentOperationCount = 1;
    Console_insert(@"当前进入 uid:%@", self.studentModel.uid);

    _manager = [SYBCEducationManager sharedManager];
    [self.manager startSDKAndCreateEngineWithDelegate:self];
    [self.manager createWhite:_whiteView delegate:self];
}

#pragma mark - Method
- (void)PlaceholderBtnClicked:(UIButton *)sender
{
    [self.statusView showOrHiddenStatusView];
    [self.view endEditing:YES];
}

- (void)appDidEnterBackground
{
    self.bcStatus |= SYBCStatusBackground;
    AFNetworkReachabilityStatus netStatus = [AFNetworkReachabilityManager sharedManager].networkReachabilityStatus;
    if (AFNetworkReachabilityStatusUnknown == netStatus || AFNetworkReachabilityStatusNotReachable == netStatus) {
        Console_insert(@"[BCon] enter background but no network");
        return;
    }
    Console_insert(@"[BCon] enter background");
    self.canvasForStuView.hidden = YES;
    [self leaveRoom];
}

- (void)appDidEnterForeground
{
    if (self.bcStatus & SYBCStatusBackground) {
        self.bcStatus ^= SYBCStatusBackground;
    }
    AFNetworkReachabilityStatus netStatus = [AFNetworkReachabilityManager sharedManager].networkReachabilityStatus;
    if (AFNetworkReachabilityStatusUnknown == netStatus || AFNetworkReachabilityStatusNotReachable == netStatus) {
        Console_insert(@"[BCon] enter foreground but no network");
        return;
    }
    Console_insert(@"[BCon] enter foreground");
    [self joinRoom];
}

- (void)joinRoom
{
    if (self.bcStatus & SYBCStatusConnectedAndReJoining) {
        Console_insert(@"[BCon] joinRoom connectedAndReJoining return");
        return;
    }
    Console_insert(@"[BCon] joinRoom");
    SYOperation *op = [SYOperation new];
    WeakSelf
    [op addOperationBlock:^{
        StrongSelf
        dispatch_async(dispatch_get_main_queue(), ^{
            [MBProgressHUD jly_showActivityIndicator];
            Console_insert(@"[BCon] joinRoom start");
            [strongSelf.manager joinRoomWithRoomId:strongSelf.roomId uid:strongSelf.studentModel.uid];
        });
    }];
    [self.bcQueue addOperation:op];
}

- (void)leaveRoom
{
    if (self.bcStatus & SYBCStatusConnectedAndReJoining) {
        Console_insert(@"[BCon] leaveRoom connectedAndReJoining return");
        return;
    }
    Console_insert(@"[BCon] leaveRoom");
    SYOperation *op = [SYOperation new];
    WeakSelf
    [op addOperationBlock:^{
        StrongSelf
        dispatch_async(dispatch_get_main_queue(), ^{
            Console_insert(@"[BCon] leaveRoom start");
            [strongSelf.manager leaveRoomWithRoomId:strongSelf.roomId];
        });
    }];
    [self.bcQueue addOperation:op];
}

/// 判断主播是不是自己
- (BOOL)studentAnchorIsOneself
{
    return [self.studentModel.uid isEqualToString:self.studentAnchorModel.uid];
}

/// 处理频道属性
- (void)dealUpdatedRoomAttributes:(NSDictionary<NSString *, NSString *> *_Nonnull)attributes
{
    NSArray *allKeys = attributes.allKeys;
    // 处理老师更新的频道属性
    if ([allKeys containsObject:kRoomAttKeyForTeacher]) {
        NSString *teacherJson = attributes[kRoomAttKeyForTeacher];
        [self updateRoomMoudlesStateByTeacherJson:teacherJson];
    }
    // 存在其他频道属性
    for (NSString *key in allKeys) {
        NSString *jsonString = attributes[key];
        NSDictionary *dic = [SYUtils dicFromJsonString:jsonString];
        NSString *operationType = dic[@"key"];
        NSString *operationValue = dic[@"value"];
        // 连麦操作
        if ([operationType isEqualToString:kRoomAttKeyOperationOnline]) {
            self.studentAnchorModel = [SYStudentModel yy_modelWithJSON:operationValue];
            if ([key isEqualToString:self.studentModel.uid]) {
                [self startLive];
            } else {
                [self subscribeStudentAnchorStreamByStudentAnchorId:key];
            }
        }
    }
}

/// 根据老师更新的频道属性更新房间模块状态
- (void)updateRoomMoudlesStateByTeacherJson:(NSString *)teacherJson
{
    Console_insert(@"[BCon] update room moudles");
    SYTeacherModel *newTeacherModel = [SYTeacherModel yy_modelWithJSON:teacherJson];
    // 全员禁言状态更新
    if (![self.teacherModel.class_mute isEqualToString:newTeacherModel.class_mute]) {
        [self updateChatBtnStatusByClassMute:newTeacherModel.class_mute];
    }
    // 课堂举手状态更新
    if (![self.teacherModel.open_hand isEqualToString:newTeacherModel.open_hand]) {
        [self updateHandBtnStatusByOpenHand:newTeacherModel.open_hand];
    }
    // 白板 uuid 更新
    if (![self.teacherModel.board_uuid isEqualToString:newTeacherModel.board_uuid]) {
        [self joinWhiteBoardByBoardUUID:newTeacherModel.board_uuid];
    }
    // 视频流状态更新
    if (![self.teacherModel.video isEqualToString:newTeacherModel.video]) {
        [self videoStatusUpdated:newTeacherModel.video teacherId:newTeacherModel.uid];
    }
    // 音频流状态更新
    if (![self.teacherModel.audio isEqualToString:newTeacherModel.audio]) {
        [self audioStatusUpdated:newTeacherModel.audio teacherId:newTeacherModel.uid];
    }
    // 上下课状态更新
    if (![self.teacherModel.class_state isEqualToString:newTeacherModel.class_state]) {
        [self classStateUpdated:newTeacherModel.class_state];
    }
    
    self.teacherModel = newTeacherModel;
    [self.messageView setUserId:self.studentModel.uid teacherId:self.teacherModel.uid];
    [self.canvasForTeaView setNickname:self.teacherModel.uid];
}

/// 视频状态更新
- (void)videoStatusUpdated:(NSString *)video teacherId:(NSString *)teacherId
{
    if ([video isEqualToString:kVideoOpen]) {
        [self subscribeTeacherVideoStreamByTeacherId:teacherId];
    } else if ([video isEqualToString:kVideoClose]) {
        [self unSubscribeTeacherVideoStreamByTeacherId:teacherId];
    }
}

/// 音频状态更新
- (void)audioStatusUpdated:(NSString *)audio teacherId:(NSString *)teacherId
{
    if ([audio isEqualToString:kAudioOpen]) {
        [self subscribeTeacherAudioStreamByTeacherId:teacherId];
    } else if ([audio isEqualToString:kAudioClose]) {
        [self unSubscribeTeacherAudioStreamByTeacherId:teacherId];
    }
}

/// 上下课状态更新
- (void)classStateUpdated:(NSString *)class_state
{
    Console_insert(@"[BCon] class status update: %@", class_state);
}

/// 加入白板
- (void)joinWhiteBoardByBoardUUID:(NSString *)board_uuid
{
    Console_insert(@"[BCon] joinWhiteBoard");
    if (!board_uuid.length) {
        Console_insert(@"[BCon] joinWhiteBoard uuid null");
        return;
    }
    WeakSelf
    [self.manager joinWhiteRoomWithUuid:board_uuid completionHandler:^(WhiteRoom * _Nullable room, NSError * _Nullable error) {
        StrongSelf
        if (!error) {
            strongSelf.whiteRoom = room;
            [strongSelf.manager disableWhiteDeviceInputs:YES];
            Console_insert(@"[BCon] joinWhiteBoard success");
        } else {
            self.reJoinWhiteboardCount += 1;
            if (self.reJoinWhiteboardCount <= 3) {
                [self joinWhiteBoardByBoardUUID:board_uuid];
            } else {
                strongSelf.teacherModel.board_uuid = @"";
                [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"进入白板房间失败"]];
                Console_insert(@"[BCon] joinWhiteBoard failure: %@", error);
            }
        }
    }];
}

/// 更新课堂举手状态
- (void)updateHandBtnStatusByOpenHand:(NSString *)open_hand
{
    if ([open_hand isEqualToString:kOpenHand]) {
        [self.toolView setHandleBtnStatus:SYHandleBtnStatusShow];
    } else if ([open_hand isEqualToString:kCloseHand]) {
        [self.toolView setHandleBtnStatus:SYHandleBtnStatusHidden];
    }
    Console_insert(@"[BCon] update open btn status: %@", open_hand);
}

/// 更新全员禁言状态
- (void)updateChatBtnStatusByClassMute:(NSString *)class_mute
{
    if ([class_mute isEqualToString:kOpenClassMute]) {
        [self.messageView setChatbtnStatus:NO];
    } else if ([class_mute isEqualToString:kCloseClassMute]) {
        [self.messageView setChatbtnStatus:YES];
    }
    Console_insert(@"[BCon] update chat btn status: %@", class_mute);
}

/// 开始推流
- (void)startLive
{
    [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"老师已同意与你连麦"]];
    Console_insert(@"[BCon] startLive");
    self.studentAnchorModel = self.studentModel.copy;
    self.canvasForStuView.hidden = NO;
    [self.canvasForStuView setNickname:self.studentAnchorModel.uid];
    [self.manager createLocalCanvasWithUid:self.studentModel.uid canvasView:self.canvasForStuView.canvasView];
    [self.manager enableLive];
    [self.toolView setHandleBtnStatus:SYHandleBtnStatusDisable];
}

/// 停止推流
- (void)endLive
{
    Console_insert(@"[BCon] endLive");
    [MBProgressHUD jly_hideActivityIndicator];
    self.studentAnchorModel = nil;
    [self.manager disableLive];
    self.canvasForStuView.hidden = YES;
    [self.canvasForStuView removeSubviewOfCanvas];
    [self.toolView setHandleBtnStatus:SYHandleBtnStatusNormal];
}

/// 订阅老师视频流
- (void)subscribeTeacherVideoStreamByTeacherId:(NSString *)teacherId
{
    [self.canvasForTeaView removeSubviewOfCanvas];
    [self.manager createRomoteCanvasWithUid:teacherId canvasView:self.canvasForTeaView.canvasView];
    [self.manager stopRemoteVideoStream:teacherId stopped:NO];
    Console_insert(@"[BCon] subscribe teacher video stream: %@", teacherId);
}

/// 订阅老师音频流
- (void)subscribeTeacherAudioStreamByTeacherId:(NSString *)teacherId
{
    [self.manager stopRemoteAudioStream:teacherId stopped:NO];
    Console_insert(@"[BCon] subscribe teacher audio stream: %@", teacherId);
}

/// 取消订阅老师音视频流
- (void)unSubscribeTeacherStreamByTeacherId:(NSString *)teacherId
{
    [self unSubscribeTeacherVideoStreamByTeacherId:teacherId];
    [self unSubscribeTeacherAudioStreamByTeacherId:teacherId];
    // 重置按钮状态
    [self updateChatBtnStatusByClassMute:kCloseClassMute];
    [self updateHandBtnStatusByOpenHand:kCloseHand];
    [self.teacherModel resetState];
    [self.canvasForTeaView setNickname:@""];
    Console_insert(@"[BCon] unSubscribe teacher stream: %@", teacherId);
}

/// 取消订阅老师视频流
- (void)unSubscribeTeacherVideoStreamByTeacherId:(NSString *)teacherId
{
    [self.canvasForTeaView showNormalImg];
    [self.canvasForTeaView removeSubviewOfCanvas];
    [self.manager stopRemoteVideoStream:teacherId stopped:YES];
}

/// 取消订阅老师音频流
- (void)unSubscribeTeacherAudioStreamByTeacherId:(NSString *)teacherId
{
    [self.manager stopRemoteAudioStream:teacherId stopped:YES];
}

/// 订阅学生主播流
- (void)subscribeStudentAnchorStreamByStudentAnchorId:(NSString *)studentAnchorId
{
    if (!studentAnchorId.length) {
        return;
    }
    self.canvasForStuView.hidden = NO;
    [self.canvasForStuView setNickname:studentAnchorId];
    [self.canvasForStuView removeSubviewOfCanvas];
    [self.manager createRomoteCanvasWithUid:studentAnchorId canvasView:self.canvasForStuView.canvasView];
    
    [self.manager stopRemoteVideoStream:studentAnchorId stopped:NO];
    [self.manager stopRemoteAudioStream:studentAnchorId stopped:NO];
    Console_insert(@"[BCon] subscribe anchor stream: %@", studentAnchorId);
}

/// 取消订阅学生主播流
- (void)unSubscribeStudentAnchorStreamByStudentAnchorId:(NSString *)studentAnchorId
{
    if (!studentAnchorId.length) {
        return;
    }
    self.canvasForStuView.hidden = YES;
    [self.canvasForStuView removeSubviewOfCanvas];
    
    [self.manager stopRemoteVideoStream:studentAnchorId stopped:YES];
    [self.manager stopRemoteAudioStream:studentAnchorId stopped:YES];
    self.studentAnchorModel = nil;
    Console_insert(@"[BCon] unSubscribe anchor stream: %@", studentAnchorId);
}

#pragma mark - SYInterfaceManagerDelegate
/// 加入房间回调
- (void)joinRoomWithError:(NSError *)error
{
    [self.bcQueue.operations.firstObject operationFinished];
    [MBProgressHUD jly_hideActivityIndicator];
    if (!error) {
        [self joinSuccess];
    } else {
        [self joinFailure:error];
    }
    if (self.bcStatus & SYBCStatusConnectedAndReJoining) {
        self.bcStatus ^= SYBCStatusConnectedAndReJoining;
    }
    if (self.bcStatus & SYBCStatusConnectLostOffline) {
        self.bcStatus ^= SYBCStatusConnectLostOffline;
    }
}

- (void)joinSuccess
{
    // 加入房间失败后三次重试加入房间成功
    if (self.bcStatus & SYBCStatusJoinFailAndReJoining) {
        self.bcStatus ^= SYBCStatusJoinFailAndReJoining;
        self.reJoinRoomCount = 0;
        Console_insert(@"[BCon] joinRoom retry success");
    }
    Console_insert(@"[BCon] joinRoom success");
    WeakSelf
    // 设置屏幕常亮
    [UIApplication sharedApplication].idleTimerDisabled = YES;
    
    // 停止订阅所有音视频流
    [self.manager stopAllRemoteVideoStreams:YES];
    [self.manager stopAllRemoteAudioStreams:YES];
    
    // 设置自己的用户属性
    NSDictionary *dic = @{self.studentModel.uid : self.studentModel.mj_JSONString};
    [self.manager addOrUpdateMemberAttributesWithRoomId:self.roomId uid:self.studentModel.uid attributes:dic successBlock:nil failureBlock:nil];
    
    // 查询所有频道属性
    [self.manager queryRoomAttributes:self.roomId successBlock:^(NSDictionary<NSString *,NSString *> * _Nonnull attributes) {
        StrongSelf
        Console_insert(@"[BCon] query room attributes roomId:%@ attributes:%@", strongSelf.roomId, attributes);
        [strongSelf dealUpdatedRoomAttributes:attributes];
    } failureBlock:nil];
}

- (void)joinFailure:(NSError *)error
{
    if (self.reJoinRoomCount <= 3) {
        self.bcStatus |= SYBCStatusJoinFailAndReJoining;
        self.reJoinRoomCount += 1;
        [self joinRoom];
        Console_insert(@"[BCon] joinRoom retryCount: %d", self.reJoinRoomCount);
    } else {
        self.bcStatus ^= SYBCStatusJoinFailAndReJoining;
        Console_insert(@"[BCon] joinRoom failure: %@", error);
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"进入房间失败"] duration:0.f];
    }
}

/// 离开房间回调
- (void)leaveRoomWithError:(NSError *)error
{
    [self.bcQueue.operations.firstObject operationFinished];
    [MBProgressHUD jly_hideActivityIndicator];
    if (!error) {
        [self leaveRoomSuccess];
    } else {
        [self leaveRoomFailure:error];
    }
}

- (void)leaveRoomSuccess
{
    if (self.bcStatus & SYBCStatusClickCloseBtn) {
        Console_insert(@"[BCon] leaveRoom success dismiss \n\n");
        //移除通知
        [self removeNotification];
        [[SYConsoleManager sharedManager] removeParentView];
        [self.manager destroyWhiteBoard];
        [self dismissViewControllerAnimated:YES completion:nil];
    } else {
        Console_insert(@"[BCon] leaveRoom success for other");
        [self.canvasForTeaView showNormalImg];
        [self.teacherModel resetState];
    }
}

- (void)leaveRoomFailure:(NSError *)error
{
    Console_insert(@"[BCon] leaveRoom failure: %@", error);
    [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"退出房间失败"]];
}

/// 收到广播消息
- (void)didRoomMessageReceived:(HMRMessage *)message fromUser:(NSString *)user roomId:(NSString *)roomId
{
    Console_insert(@"[BCon] reveice room message user:%@ roomId:%@", user, roomId);
    if (![roomId isEqualToString:self.roomId] || [user isEqualToString:self.studentModel.uid]) {
        return;
    }
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:message.content options:NSJSONReadingFragmentsAllowed error:nil];
    SYMessageModel *model = [SYMessageModel mj_objectWithKeyValues:dict];
    if ([model.key isEqualToString:kChatRoomMessage]) {
        SYMessageTxtModel *txtModel = [[SYMessageTxtModel alloc] init];
        txtModel.sendUserId = user;
        txtModel.message = model.jsonValue.msg_content;
        txtModel.nickname = model.jsonValue.msg_nickname;
        txtModel.sendTime = model.jsonValue.msg_time;
        [self.messageView didReceiveMessage:txtModel];
    }
}

/// 收到单播消息
- (void)didPeerMessageReceived:(HMRMessage *)message fromUser:(NSString *)user
{
    NSData *messageData = message.content;
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:messageData options:NSJSONReadingFragmentsAllowed error:nil];
    SYMessageModel *model = [SYMessageModel mj_objectWithKeyValues:dict];
    Console_insert(@"[BCon] reveice peer message user:%@ msg:%@", user, model.mj_JSONString);
    // 个人禁言
    if ([model.key isEqualToString:kMute]) {
        self.studentModel.chat = model.value;
        if ([self.studentModel.chat isEqualToString:kOpenMute]) {
            [self.messageView setChatbtnStatus:NO];//开启个人禁言
        } else if ([self.studentModel.chat isEqualToString:kCloseMute]) {
            [self.messageView setChatbtnStatus:YES];//关闭个人禁言
        }
    }
}

/// 收到频道属性更新
- (void)didRoomAttributesAddedOrUpdated:(NSString *)roomId withAttributes:(NSDictionary<NSString *,NSString *> *)attributes byUser:(NSString *)user
{
    Console_insert(@"[BCon] reveice room attributes update by user:%@ attributes:%@", user, attributes);
    if (![self.roomId isEqualToString:roomId]) {
        return;
    }
    [self dealUpdatedRoomAttributes:attributes];
}

/// 收到频道属性删除
- (void)didRoomAttributesDeleted:(NSString *)roomId withAttributes:(NSDictionary<NSString *,NSString *> *)attributes byUser:(NSString *)user
{
    Console_insert(@"[BCon] reveice room attributes delete by user:%@ attributes:%@", user, attributes);
    if (![self.roomId isEqualToString:roomId]) {
        return;
    }
    NSArray *allKeys = attributes.allKeys;
    // 老师频道属性被删除
    if ([allKeys containsObject:kRoomAttKeyForTeacher]) {
        [self unSubscribeTeacherStreamByTeacherId:self.teacherModel.uid];
    }
    // 存在其他频道属性
    for (NSString *key in allKeys) {
        NSString *jsonString = attributes[key];
        NSDictionary *dic = [SYUtils dicFromJsonString:jsonString];
        NSString *operationType = dic[@"key"];
        // 连麦操作
        if ([operationType isEqualToString:kRoomAttKeyOperationOnline]) {
            self.studentAnchorModel = nil;
            if ([key isEqualToString:self.studentModel.uid]) {
                [self endLive];
            } else {
                [self unSubscribeStudentAnchorStreamByStudentAnchorId:key];
            }
        }
    }
}

/// 成员离开房间
- (void)didRoomMemberLeft:(NSSet<NSString *> *)members roomId:(NSString *)roomId
{
    Console_insert(@"[BCon] reveice member leave users:%@", members);
    if (![self.roomId isEqualToString:roomId]) {
        return;
    }
    // 老师离开房间
    if ([members containsObject:self.teacherModel.uid]) {
        [self unSubscribeTeacherStreamByTeacherId:self.teacherModel.uid];
    }
    // 自己离开房间 && 自己是主播
    if ([members containsObject:self.studentModel.uid] && [self studentAnchorIsOneself]) {
        [self endLive];
        return;
    }
    // 主播离开房间
    if ([members containsObject:self.studentAnchorModel.uid]) {
        [self unSubscribeStudentAnchorStreamByStudentAnchorId:self.studentAnchorModel.uid];
    }
}

/// 自己因为断线超时离开房间
- (void)didRoomMemberOffline:(NSSet<NSString *> *)roomIds
{
    [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"断线超时离开房间"]];
    self.bcStatus |= SYBCStatusConnectLostOffline;
    if ([self.manager getHummerIsConnected]) {
        Console_insert(@"[BCon] reveice offline but hummer connected so leave and join room");
        self.canvasForStuView.hidden = YES;
        [self leaveRoom];
        [self joinRoom];
        self.bcStatus |= SYBCStatusConnectedAndReJoining;
    }
}

/// hummer 状态回调
- (void)didHummerStateChanged:(HMRState)oldState toState:(HMRState)newState
{
    // 重连状态改变到已连接状态
    if ((HMRStateReconnecting == oldState) && (HMRStateConnected == newState)) {
        Console_insert(@"[BCon] reveice hummer state reconnecting to connected");
        // 在后台并且还在房间则重连后离开房间
        if (self.bcStatus & SYBCStatusBackground) {
            if ([self.manager getRoomIsJoined]) {
                Console_insert(@"[BCon] reveice hummer state reconnecting to connected background no joined");
                self.canvasForStuView.hidden = YES;
                [self leaveRoom];
            }
            return;
        }
        // 断线离开状态重连
        if (self.bcStatus & SYBCStatusConnectLostOffline) {
            Console_insert(@"[BCon] reveice hummer state reconnecting to connected offline");
            self.canvasForStuView.hidden = YES;
            [self leaveRoom];
            [self joinRoom];
            self.bcStatus |= SYBCStatusConnectedAndReJoining;
            return;
        }
        // sdk 不在房间内（兼容有网退后台后断网进入前台，然后再恢复网络不能进入房间问题）
        if (![self.manager getRoomIsJoined]) {
            Console_insert(@"[BCon] reveice hummer state reconnecting to connected no joined");
            [self joinRoom];
            self.bcStatus |= SYBCStatusConnectedAndReJoining;
        }
    }
}

/// 显示远端视频首帧回调
- (void)onRemoteVideoPlay:(NSString *)uid size:(CGSize)size elapsed:(NSInteger)elapsed
{
    Console_insert(@"[BCon] reveice video first frame uid: %@", uid);
    if ([uid isEqualToString:self.teacherModel.uid]) {//隐藏默认图
        self.renderFalseCount = 0;
        [self.canvasForTeaView hiddenNormalImg];
    }
}

/// 通话中远端视频流信息回调
- (void)onRemoteVideoStatsOfUid:(NSString *)uid stats:(ThunderRtcRemoteVideoStats *)stats
{
    if (![uid isEqualToString:self.teacherModel.uid]) {
        return;
    }
    if (0 == stats.rendererOutputFrameRate) { // 渲染帧率为 0
        self.renderFalseCount += 1;
        if (self.renderFalseCount == kRenderFailCount) {
            [self.canvasForTeaView showNormalImg];
            Console_insert(@"[BCon] remote video stats uid:%@ render fps:%lu, decode fps:%lu, receive bit:%lu", uid, (unsigned long)stats.rendererOutputFrameRate, (unsigned long)stats.decoderOutputFrameRate, (unsigned long)stats.receivedBitrate);
        }
    } else if ((0 != stats.rendererOutputFrameRate) && self.canvasForTeaView.showNormalImage) {
        self.renderFalseCount = 0;
        [self.canvasForTeaView hiddenNormalImg];
        Console_insert(@"[BCon] remote video stats uid:%@ render fps:%lu, decode fps:%lu, receive bit:%lu", uid, (unsigned long)stats.rendererOutputFrameRate, (unsigned long)stats.decoderOutputFrameRate, (unsigned long)stats.receivedBitrate);
    }
}

/// 网络质量信号检测
- (void)onNetworkQuality:(NSString *)uid txQuality:(ThunderLiveRtcNetworkQuality)txQuality rxQuality:(ThunderLiveRtcNetworkQuality)rxQuality
{
    if ([uid isEqualToString:@"0"]) {
        self.studentModel.networkQuality = @(rxQuality).stringValue;
        if (rxQuality == THUNDER_SDK_NETWORK_QUALITY_UNKNOWN) {//质量未知
            [self.statusView setNetworkQuality:SYNetworkQualityUnknown];
        } else if (rxQuality == THUNDER_SDK_NETWORK_QUALITY_EXCELLENT || rxQuality == THUNDER_SDK_NETWORK_QUALITY_GOOD) {//质量极好
            [self.statusView setNetworkQuality:SYNetworkQualityGood];
        } else if (rxQuality == THUNDER_SDK_NETWORK_QUALITY_POOR || rxQuality == THUNDER_SDK_NETWORK_QUALITY_BAD) {//质量一般
            [self.statusView setNetworkQuality:SYNetworkQualityGenral];
        } else if (rxQuality == THUNDER_SDK_NETWORK_QUALITY_VBAD) {
            [self.statusView setNetworkQuality:SYNetworkQualityVeryBad];
        }
    }
}

#pragma mark - SYBigStatusViewDelegate
/// 点击退出按钮
- (void)clickCloseBtn
{
    AFNetworkReachabilityStatus netStatus = [AFNetworkReachabilityManager sharedManager].networkReachabilityStatus;
    if (AFNetworkReachabilityStatusUnknown == netStatus || AFNetworkReachabilityStatusNotReachable == netStatus) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"网络异常"]];
        return;
    }
    self.bcStatus |= SYBCStatusClickCloseBtn;
    [self.statusView cancelHiddenStatusView];
    [MBProgressHUD jly_showActivityIndicator];
    [self leaveRoom];
}

/// 点击课堂评价
- (void)clickFeedbackBtn
{
    Console_insert(@"[BCon] click feedback");
    [self appDidEnterBackground];
    SYFeedbackController *vc = [SYFeedbackController new];
    SYNavigationController *nav = [[SYNavigationController alloc] initWithRootViewController:vc];
    vc.uid = self.studentModel.uid;
    nav.modalPresentationStyle = UIModalPresentationFullScreen;
    [self presentViewController:nav animated:YES completion:nil];
}

#pragma mark - SYBigToolViewDelegate
/// 点击控制台按钮
- (void)clickConsoleBtn
{
    [[SYConsoleManager sharedManager] showOrHiddenOperateView:self.view rightView:self.toolView];
}

/// 举手按钮点击事件
- (void)clickHandleBtn:(BOOL)isHandle
{
    if (![self.manager getHummerIsConnected]) {
        Console_insert(@"[BCon] hand failure for hummer lost connect");
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"网络异常"]];
        return;
    }
    NSString *handOption;
    if (isHandle) {//举手操作
        handOption = kRequireHand;
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"举手中，等待老师连麦"]];
    } else {//取消举手
        handOption = kCancleHand;
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"已取消举手"]];
    }
    NSDictionary *jsonValue = @{
        @"state" : handOption,
        @"netQuality" : self.studentModel.networkQuality,
    };
    NSDictionary *param = @{
        @"key" : kHand,
        @"value" : @"",
        @"jsonValue" : jsonValue
    };
    NSString *type = @"100";
    WeakSelf
    Console_insert(@"[BCon] sendMessageToUser msg: %@", param);
    [self.manager sendPeerMessageToUser:self.teacherModel.uid content:param type:type successBlock:^(NSString * _Nullable roomId, NSString * _Nullable uid) {
        StrongSelf
        Console_insert(@"[BCon] sendMessageToUser success");
        if (isHandle) {
            [strongSelf.toolView setHandleBtnStatus:SYHandleBtnStatusHandleSuc];
        } else {
            [strongSelf.toolView setHandleBtnStatus:SYHandleBtnStatusNormal];
        }
    } failureBlock:^(NSError * _Nullable error) {
        Console_insert(@"[BCon] sendMessageToUser failed: %@", error.description);
    }];
}

#pragma mark - SYMessageViewDelegate
/// 开始编辑聊天内容
- (void)chatBeiginEditing
{
    [self.view bringSubviewToFront:self.chatTextField];
    [self.chatTextField becomeFirstResponder];
}

#pragma mark - UITextFieldDelegate
/// 点击发送
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    if (!textField.text.length) {
        return YES;
    }
    [self sendChatRoomMessageWithContent:textField.text];
    textField.text = @"";
    [textField resignFirstResponder];
    return YES;
}

/// 发送聊天室消息
- (void)sendChatRoomMessageWithContent:(NSString *)content
{
    NSTimeInterval timeInterval = [[NSDate date] timeIntervalSince1970];
    NSString *sendTime = [NSString stringWithFormat:@"%lf",timeInterval];
    
    NSDictionary *jsonValue = @{
        @"msg_content" : content,
        @"msg_time" : sendTime,
        @"msg_nickname" : self.nickName
    };
    NSDictionary *params = @{
        @"key" : kChatRoomMessage,
        @"value" : @"",
        @"jsonValue" : jsonValue
    };
    
    NSString *type = @"100";
    WeakSelf
    Console_insert(@"[BCon] sendMessageToRoom msg: %@", params);
    [self.manager sendMessageRoomId:self.roomId content:params type:type successBlock:^(NSString * _Nullable roomId, NSString * _Nullable uid) {
        StrongSelf
        Console_insert(@"[BCon] sendMessageToRoom success");
        SYMessageTxtModel *model = [[SYMessageTxtModel alloc] init];
        model.nickname = strongSelf.studentModel.nickname;
        model.message = content;
        model.sendTime = sendTime;
        model.sendUserId = strongSelf.studentModel.uid;
        [strongSelf.messageView didReceiveMessage:model];
    } failureBlock:^(NSError * _Nullable error) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"发送失败"]];
        Console_insert(@"[BCon] sendMessageToRoom failed: %@", error.description);
    }];
}

#pragma mark - keyboard Notification
- (void)keyboardWillShow:(NSNotification *)sender
{
    self.chatTextField.hidden = NO;
    CGFloat height = [[[sender userInfo] objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue].size.height;
    [UIView animateWithDuration:0.25 animations:^{
        [self.chatTextField mas_updateConstraints:^(MASConstraintMaker *make) {
            make.bottom.mas_offset(-height);
        }];
        [self.view layoutIfNeeded];
    }];
}

- (void)keyboardWillHidden:(NSNotification *)sender
{
    self.chatTextField.hidden = YES;
    [UIView animateWithDuration:0.25 animations:^{
        [self.chatTextField mas_updateConstraints:^(MASConstraintMaker *make) {
            make.bottom.mas_offset(0.f);
        }];
        [self.view layoutIfNeeded];
    }];
}

#pragma mark - Getter & Setter
- (SYBigStatusView *)statusView
{
    if (!_statusView) {
        SYBigStatusView *view = [SYBigStatusView new];
        view.delegate = self;
        _statusView = view;
    }
    return _statusView;
}

- (SYBigToolView *)toolView
{
    if (!_toolView) {
        SYBigToolView *view = [SYBigToolView new];
        view.delegate = self;
        _toolView = view;
        [view setHandleBtnStatus:SYHandleBtnStatusNormal];
    }
    return _toolView;
}

- (UIView *)bgView
{
    if (!_bgView) {
        UIView *view = [[UIView alloc] init];
        view.backgroundColor = [UIColor whiteColor];
        _bgView = view;
    }
    return _bgView;
}

- (SYCanvasView *)canvasForTeaView
{
    if (!_canvasForTeaView) {
        SYCanvasView *view = [SYCanvasView new];
        _canvasForTeaView = view;
    }
    return _canvasForTeaView;
}

- (SYCanvasView *)canvasForStuView
{
    if (!_canvasForStuView) {
        SYCanvasView *view = [SYCanvasView new];
        [view conciseModelView];
        view.hidden = YES;
        _canvasForStuView = view;
    }
    return _canvasForStuView;
}

- (UITextView *)noticeTextView
{
    if (!_noticeTextView) {
        UITextView *view = [UITextView new];
        view.backgroundColor = [UIColor colorWithRed:245/255.0 green:245/255.0 blue:245/255.0 alpha:1.0];
        view.font = [UIFont systemFontOfSize:11.f];
        view.textColor = [UIColor colorWithRed:153/255.0 green:153/255.0 blue:153/255.0 alpha:1.0];
        view.editable = NO;
        view.text = [NSBundle yy_localizedStringWithKey:@"欢迎使用云教育大班课"];
        view.layer.cornerRadius = 1.f;
        _noticeTextView = view;
    }
    return _noticeTextView;
}

- (SYMessageView *)messageView
{
    if (!_messageView) {
        SYMessageView *view = [SYMessageView new];
        view.delegate = self;
        _messageView = view;
    }
    return _messageView;
}

- (UITextField *)chatTextField
{
    if (!_chatTextField) {
        UITextField *field = [UITextField new];
        field.placeholder = [NSBundle yy_localizedStringWithKey:@"请输入文字..."];
        field.backgroundColor = [UIColor whiteColor];
        field.font = [UIFont systemFontOfSize:14.f];
        field.layer.borderColor = [UIColor grayColor].CGColor;
        field.layer.borderWidth = 1.f;
        field.returnKeyType = UIReturnKeySend;
        field.delegate = self;
        field.hidden = YES;
        field.yy_maxLength = 10;
        _chatTextField = field;
    }
    return _chatTextField;
}

- (WhiteBoardView *)whiteView
{
    if (!_whiteView) {
        _whiteView = [[WhiteBoardView alloc] init];
    }
    return _whiteView;
}

- (UIButton *)placeholderBtn
{
    if (!_placeholderBtn) {
        UIButton *btn = [UIButton buttonWithType:UIButtonTypeSystem];
        btn.backgroundColor = [UIColor clearColor];
        [btn addTarget:self action:@selector(PlaceholderBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _placeholderBtn = btn;
    }
    return _placeholderBtn;
}

#pragma mark - Device Orientation
- (BOOL)prefersStatusBarHidden
{
    return YES;
}

- (BOOL)shouldAutorotate
{
    return YES;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return UIInterfaceOrientationLandscapeRight;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskLandscapeRight;
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    [self.statusView showOrHiddenStatusView];
}

- (void)setup
{
    
    [self.view addSubview:self.bgView];
    [self.view addSubview:self.chatTextField];
    [self.bgView addSubview:self.statusView];
    [self.bgView addSubview:self.whiteView];
    [self.whiteView addSubview:self.placeholderBtn];
    [self.bgView addSubview:self.toolView];
    [self.bgView addSubview:self.canvasForTeaView];
    [self.bgView addSubview:self.canvasForStuView];
    [self.bgView addSubview:self.noticeTextView];
    [self.bgView addSubview:self.messageView];
    [self.bgView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_offset(0.f);
        if (@available(iOS 11.0, *)) {
            make.left.equalTo(self.view.mas_safeAreaLayoutGuideLeft);
            make.right.equalTo(self.view.mas_safeAreaLayoutGuideRight);
        } else {
            make.left.right.mas_offset(0.f);
        }
        make.bottom.equalTo(@(0));
    }];
    [self.chatTextField mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(self.bgView);
        make.bottom.mas_offset(-44.f);
        make.height.mas_offset(44.f);
    }];
    [self.statusView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.top.mas_offset(0.f);
        make.height.mas_offset(80.f);
    }];
    [self.whiteView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.bottom.mas_offset(0.f);
        make.right.mas_equalTo(self.messageView.mas_left);
    }];
    [self.placeholderBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.right.mas_offset(0.f);
        make.height.mas_offset(44.f);
    }];
    [self.toolView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(self.canvasForTeaView.mas_left).mas_offset(-15.f);
        make.bottom.mas_offset(-10.f);
    }];
    [self.canvasForTeaView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.right.equalTo(self.bgView);
        make.width.equalTo(@186);
        make.height.equalTo(@101);
    }];
    [self.canvasForStuView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.canvasForTeaView.mas_top);
        make.width.height.equalTo(self.canvasForTeaView);
        make.right.equalTo(self.canvasForTeaView.mas_left);
    }];
    [self.noticeTextView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(self.canvasForTeaView);
        make.top.mas_equalTo(self.canvasForTeaView.mas_bottom);
        make.height.mas_offset(39.f);
    }];
    [self.messageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.canvasForTeaView);
        make.top.mas_equalTo(self.noticeTextView.mas_bottom);
        make.bottom.right.mas_offset(0.f);
    }];
    
    [self.bgView bringSubviewToFront:self.statusView];
    [self.statusView setClassRoomName:self.roomId nickname:self.nickName];
}

- (void)setupNotification
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHidden:) name:UIKeyboardWillHideNotification object:nil];
    //退到后台通知
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appDidEnterBackground) name:UIApplicationDidEnterBackgroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appDidEnterForeground) name:UIApplicationWillEnterForegroundNotification object:nil];
}

- (void)removeNotification
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
