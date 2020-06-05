//
//  SYInterfaceManager.m
//  SCloudInterfaceDemo
//
//  Created by Huan on 2020/2/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYInterfaceManager.h"
#import "SYConsoleManager.h"
#import "SYUtils.h"

//时序错误说明
#define kSYJoiningOrLeavingErrorDescription @"当前正在加入房间或正在退出房间"
//时序错误错误码
#define kSYJoiningOrLeavingErrorCode 10001
//加入房间失败说明
#define kSYJoinRoomFailDescription @"加入房间失败"
//加入房间失败错误码
#define kSYJoinRoomFailCode 10002
//离开房间失败说明
#define kSYLeaveRoomFailDescription @"离开房间失败"
//离开房间失败错误码
#define kSYLeaveRoomFailCode 10003

// 每一步骤的状态
typedef NS_OPTIONS(NSInteger, SYInterfaceStepStatus) {
    SYInterfaceStepStatusUnknown            = 0,
    SYInterfaceStepStatusHummerInit         = 1 << 0,   // hummerSDK 是否初始化
    SYInterfaceStepStatusHummerLogin        = 1 << 1,   // hummer 是否登录
    SYInterfaceStepStatusRtsRoom            = 1 << 2,   // rts room 是否进入
    SYInterfaceStepStatusThunderRoom        = 1 << 3,   // thunder room 是否进入
};

@interface SYInterfaceManager()<HMREventObserver, HMRRoomObserver, HMRRoomMemberObserver, HMRPeerServiceObserver, ThunderEventDelegate>

@property (nonatomic, copy) NSString *region;           // 区域设置
@property (nonatomic, strong) ThunderEngine *engine;    // ThunderEngine实例
@property (nonatomic, assign) SYInterfaceStepStatus stepStatus; // 步骤状态
@property (nonatomic, copy) NSString *appId;

@end

@implementation SYInterfaceManager

+ (instancetype)sharedManager
{
    static SYInterfaceManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

+ (NSString *)getSDKVersion
{
    NSString *thunderVersion = [ThunderEngine getVersion];
    NSString *hummerVersion = [Hummer sdkVersion];
    NSArray *array = [thunderVersion componentsSeparatedByString:@"|"];
    if (array.count) {
        thunderVersion = array.firstObject;
    }
    return [NSString stringWithFormat:@"TB%@, HMR%@", thunderVersion, hummerVersion];
}

- (NSString *)region
{
    _region = @"cn";
    return _region;
}

- (void)startSDKAndCreateEngineWithAppId:(NSString *)appId
{
    self.appId = appId;
    if (!self.appId.length) {
        Console_insert(@"[HMR] please input appid");
        return;
    }
    // 初始化 hummer sdk
    if (!(self.stepStatus & SYInterfaceStepStatusHummerInit)) {
        Console_insert(@"[HMR] init Hummer SDK");
        [Hummer startWithAppId:appId.longLongValue
                    appVersion:[SYUtils appVersion]
                 eventObserver:self];
    }
    
    // 创建 engine
    _engine = [ThunderEngine createEngine:appId sceneId:0 delegate:self];
    
    // 设置日志存储路径
    NSString *logPath = kLogFilePath;
    [self.engine setLogFilePath:logPath];
    [Hummer setLoggerFilePath:logPath];
    Console_insert(@"[TB] create engine");
}

- (BOOL)getHummerIsConnected
{
    HMRState state = [Hummer state];
    if (HMRStateConnected == state) {
        return YES;
    }
    return NO;
}

- (BOOL)getRoomIsJoined
{
    BOOL rtsRoomJoin = self.stepStatus & SYInterfaceStepStatusRtsRoom;
    BOOL thunderRoomJoin = self.stepStatus & SYInterfaceStepStatusThunderRoom;
    return rtsRoomJoin && thunderRoomJoin;
}

- (void)setRemoteVideoCanvas:(ThunderVideoCanvas *)remote
{
    int result = [self.engine setRemoteVideoCanvas:remote];
    Console_insert(@"[TB] setRemoteVideoCanvas result: %d", result);
}

- (void)setRemoteCanvasScaleMode:(NSString *)uid mode:(ThunderVideoRenderMode)mode
{
    int result = [self.engine setRemoteCanvasScaleMode:uid mode:mode];
    Console_insert(@"[TB] setRemoteCanvasScaleMode result: %d", result);
}

- (void)stopAllRemoteVideoStreams:(BOOL)stopped
{
    int result = [self.engine stopAllRemoteVideoStreams:stopped];
    Console_insert(@"[TB] stopAllRemoteVideoStreams stopped: %d, result: %d", stopped, result);
}

- (void)stopRemoteVideoStream:(NSString *)uid stopped:(BOOL)stopped
{
    int result = [self.engine stopRemoteVideoStream:uid stopped:stopped];
    Console_insert(@"[TB] stopRemoteVideoStream uid:%@, stopped:%d, result: %d", uid, stopped, result);
}

- (void)stopAllRemoteAudioStreams:(BOOL)stopped
{
    int result = [self.engine stopAllRemoteAudioStreams:stopped];
    Console_insert(@"[TB] stopAllRemoteAudioStreams stopped: %d, result: %d", stopped, result);
}

- (void)stopRemoteAudioStream:(NSString *)uid stopped:(BOOL)stopped
{
    int result = [self.engine stopRemoteAudioStream:uid stopped:stopped];
    Console_insert(@"[TB] stopRemoteAudioStream uid:%@, stopped:%d, result: %d", uid, stopped, result);
}

#pragma mark - join room
- (void)joinRoomWithRoomId:(NSString *)roomId uid:(NSString *)uid token:(NSString *)token
{
    if (!self.appId.length) {
        Console_insert(@"[HMR] please input appid");
        NSError *error = [NSError errorWithDomain:kSYJoinRoomFailDescription code:-1 userInfo:nil];
        [self joinRoomCallbackWithError:error];
        return;
    }
    // 添加监听
    [[HMRRoomService instance] addRoomObserver:self];
    [[HMRRoomService instance] addMemberObserver:self];
    [[HMRPeerService instance] addObserver:self];
    
    /*
     加入房间分三步，三步都成功才算加入成功
     1. loginHummer
     2. joinRTSRoom
     3. joinThunderRoom
     */
    [self loginHummerWithRoomId:roomId uid:uid token:token];
}

/// 加入房间回调
/// @param error error description
- (void)joinRoomCallbackWithError:(NSError *)error
{
    if ([self.delegate respondsToSelector:@selector(joinRoomWithError:)]) {
        [self.delegate joinRoomWithError:error];
    }
}

/// 登录 hummer
- (void)loginHummerWithRoomId:(NSString *)roomId uid:(NSString *)uid token:(NSString *)token
{
    Console_insert(@"[HMR] login hummer roomId: %@, uid: %@", roomId, uid);
    if (self.stepStatus & SYInterfaceStepStatusHummerLogin) {
        Console_insert(@"[HMR] login hummer repeat");
        [self joinRTSRoomWithRoomId:roomId uid:uid token:token];
        return;
    }
    [Hummer loginWithUid:uid.longLongValue region:self.region token:token completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            Console_insert(@"[HMR] login hummer success");
            self.stepStatus |= SYInterfaceStepStatusHummerLogin;
            [self joinRTSRoomWithRoomId:roomId uid:uid token:token];
        } else {
            Console_insert(@"[HMR] login hummer failed: %@", error.description);
            [self joinRoomCallbackWithError:error];
        }
    }];
}

/// 加入 rts 房间
- (void)joinRTSRoomWithRoomId:(NSString *)roomId uid:(NSString *)uid token:(NSString *)token
{
    Console_insert(@"[HMR] joinRTSRoom roomId: %@, uid: %@", roomId, uid);
    if (self.stepStatus & SYInterfaceStepStatusRtsRoom) {
        Console_insert(@"[HMR] joinRTSRoom repeat");
        [self joinThunderRoomWithRoomId:roomId uid:uid token:token];
        return;
    }
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    [[HMRRoomService instance] joinRoom:hmrRoomId withAppExtras:nil options:nil completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            Console_insert(@"[HMR] joinRTSRoom success");
            self.stepStatus |= SYInterfaceStepStatusRtsRoom;
            [self joinThunderRoomWithRoomId:roomId uid:uid token:token];
        } else {
            Console_insert(@"[HMR] joinRTSRoom failed: %@", error.description);
            [self joinRoomCallbackWithError:error];
        }
    }];
}

/// 加入 thunder 房间
- (void)joinThunderRoomWithRoomId:(NSString *)roomId uid:(NSString *)uid token:(NSString *)token
{
    Console_insert(@"[TB] joinThunderRoom roomId: %@, uid: %@", roomId, uid);
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] joinThunderRoom repeat");
        [self joinRoomCallbackWithError:nil];
        return;
    }
    int result = [self.engine joinRoom:token roomName:roomId uid:uid];
    if (0 != result) {
        Console_insert(@"[TB] joinThunderRoom failed: %d", result);
        NSError *error = [NSError errorWithDomain:kSYJoinRoomFailDescription code:result userInfo:nil];
        [self joinRoomCallbackWithError:error];
        
    }
}

#pragma mark - leave room
- (void)leaveRoomWithRoomId:(NSString *)roomId
{
    if (!self.appId.length) {
        Console_insert(@"[HMR] please input appid");
        [self leaveRoomCallbackWithError:nil];
        return;
    }
    
    [[HMRRoomService instance] removeRoomObserver:self];
    [[HMRRoomService instance] removeMemberObserver:self];
    [[HMRPeerService instance] removeObserver:self];
    /*
     离开房间分两步，都成功才算离开
     1. leaveThunderRoom
     2. leaveRTSRoom
     */
    [self leaveThunderRoomWithRoomId:roomId];
}

/// 离开房间回调
/// @param error error description
- (void)leaveRoomCallbackWithError:(NSError *)error
{
    if ([self.delegate respondsToSelector:@selector(leaveRoomWithError:)]) {
        [self.delegate leaveRoomWithError:error];
    }
}

- (void)leaveThunderRoomWithRoomId:(NSString *)roomId
{
    Console_insert(@"[TB] leaveThunderRoom roomId: %@", roomId);
    if (!(self.stepStatus & SYInterfaceStepStatusThunderRoom)) {
        Console_insert(@"[TB] leaveThunderRoom no join thunderRoom");
        [self leaveRTSRoomWithRoomId:roomId];
        return;
    }
    int result = [self.engine leaveRoom];
    if (0 == result) {
        Console_insert(@"[TB] leaveThunderRoom success");
        self.stepStatus ^= SYInterfaceStepStatusThunderRoom;
        [self leaveRTSRoomWithRoomId:roomId];
    } else {
        Console_insert(@"[TB] leaveThunderRoom failed: %d", result);
        NSError *error = [NSError errorWithDomain:kSYLeaveRoomFailDescription code:result userInfo:nil];
        [self leaveRoomCallbackWithError:error];
    }
}

- (void)leaveRTSRoomWithRoomId:(NSString *)roomId
{
    Console_insert(@"[HMR] leaveRTSRoom roomId: %@", roomId);
    if (!(self.stepStatus & SYInterfaceStepStatusRtsRoom)) {
        Console_insert(@"[HMR] leaveRTSRoom no join rtsRoom");
        [self leaveRoomCallbackWithError:nil];
        return;
    }
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    [[HMRRoomService instance] leaveRoom:hmrRoomId completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            Console_insert(@"[HMR] leaveRTSRoom success");
            self.stepStatus ^= SYInterfaceStepStatusRtsRoom;
            [self leaveRoomCallbackWithError:nil];
        } else {
            Console_insert(@"[HMR] leaveRTSRoom failed: %@", error.description);
            [self leaveRoomCallbackWithError:error];
        }
    }];
}

#pragma mark - Thunder begin live & end live
- (void)setVideoCaptureOrientation:(ThunderVideoCaptureOrientation)orientation
{
    int result = [self.engine setVideoCaptureOrientation:orientation];
    Console_insert(@"[TB] setVideoCaptureOrientation result: %d", result);
}

- (int)enableLocalVideoCapture:(BOOL)enabled
{
    int result = [self.engine enableLocalVideoCapture:enabled];
    Console_insert(@"[TB] enableLocalVideoCapture enabled: %d, result: %d", enabled, result);
    return result;
}

- (int)startVideoPreview
{
    int result = [self.engine startVideoPreview];
    Console_insert(@"[TB] startVideoPreview result: %d", result);
    return result;
}

- (int)stopVideoPreview
{
    int result = [self.engine stopVideoPreview];
    Console_insert(@"[TB] stopVideoPreview result: %d", result);
    return result;
}

- (int)stopLocalAudioStream:(BOOL)stopped
{
    int result = [self.engine stopLocalAudioStream:stopped];
    Console_insert(@"[TB] stopLocalAudioStream stopped:%d, result: %d", stopped, result);
    return result;
}

- (int)stopLocalVideoStream:(BOOL)stopped
{
    int result = [self.engine stopLocalVideoStream:stopped];
    Console_insert(@"[TB] stopLocalVideoStream stopped:%d, result: %d", stopped, result);
    return result;
}

- (void)setLocalVideoCanvas:(ThunderVideoCanvas *)local
{
    int result = [self.engine setLocalVideoCanvas:local];
    Console_insert(@"[TB] setLocalVideoCanvas result = %d", result);
}

- (void)setLocalCanvasScaleMode:(ThunderVideoRenderMode)mode
{
    int result = [self.engine setLocalCanvasScaleMode:mode];
    Console_insert(@"[TB] setLocalCanvasScaleMode result = %d", result);
}

#pragma mark - Thunder config
- (void)setMediaMode:(ThunderRtcConfig)mode
{
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] setMediaMode repeat");
        return;
    }
    int result = [self.engine setMediaMode:mode];
    Console_insert(@"[TB] setMediaMode result: %d", result);
}

- (void)setRoomMode:(ThunderRtcRoomConfig)mode
{
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] setRoomMode repeat");
        return;
    }
    int result = [self.engine setRoomMode:mode];
    Console_insert(@"[TB] setRoomMode result: %d", result);
}

- (void)setArea:(ThunderRtcAreaType)area
{
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] setArea repeat");
        return;
    }
    int result = [self.engine setArea:area];
    Console_insert(@"[TB] setArea result: %d", result);
}

- (void)setSceneId:(NSInteger)sceneId
{
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] setSceneId repeat");
        return;
    }
    [self.engine setSceneId:sceneId];
}

- (void)setAudioConfig:(ThunderRtcAudioConfig)config commutMode:(ThunderRtcCommutMode)commutMode scenarioMode:(ThunderRtcScenarioMode)scenarioMode
{
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] setAudioConfig repeat");
        return;
    }
    int result = [self.engine setAudioConfig:config commutMode:commutMode scenarioMode:scenarioMode];
    Console_insert(@"[TB] setAudioConfig result: %d", result);
}

- (void)setAudioSourceType:(ThunderSourceType)sourceType
{
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] setAudioSourceType repeat");
        return;
    }
    [self.engine setAudioSourceType:sourceType];
    Console_insert(@"[TB] setAudioSourceType");
}

- (void)setVideoEncoderConfig:(ThunderVideoEncoderConfiguration *)config
{
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] setVideoEncoderConfig repeat");
        return;
    }
    int result = [self.engine setVideoEncoderConfig:config];
    Console_insert(@"[TB] setVideoEncoderConfig result: %d", result);
}

- (void)enableWebSdkCompatibility:(BOOL)enabled
{
    if (self.stepStatus & SYInterfaceStepStatusThunderRoom) {
        Console_insert(@"[TB] enableWebSdkCompatibility repeat enabled: %d", enabled);
        return;
    }
    int result = [self.engine enableWebSdkCompatibility:enabled];
    Console_insert(@"[TB] enableWebSdkCompatibility enabled: %d, result: %d", enabled, result);
}

#pragma mark - Hummer Method
- (void)sendMessage:(HMRMessage *)message withOptions:(HMRMessagingOptions *)options inRoom:(HMRRoomId *)roomId successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    [[HMRRoomService instance] sendMessage:message withOptions:options inRoom:roomId completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            !successBlock?:successBlock(roomId.ID, nil);
        } else {
            !failureBlock?:failureBlock(error);
        }
    }];
}

- (void)sendMessage:(HMRMessage *)message withOptions:(HMRMessagingOptions *)options toUser:(HMRUserId *)user successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    [[HMRPeerService instance] sendMessage:message withOptions:options toUser:user completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            !successBlock?:successBlock(nil, @(user.ID).stringValue);
        } else {
            !failureBlock?:failureBlock(error);
        }
    }];
}

- (void)addOrUpdateRoomAttributes:(HMRRoomId *)roomId withAttributes:(NSDictionary<NSString *,NSString *> *)attributes options:(HMRRoomAttributeOptions *)options successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    Console_insert(@"[HMR] addOrUpdateRoomAttributes");
    [[HMRRoomService instance] addOrUpdateRoomAttributes:roomId withAttributes:attributes options:options completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            Console_insert(@"[HMR] addOrUpdateRoomAttributes success");
            !successBlock?:successBlock(roomId.ID, nil);
        } else {
            Console_insert(@"[HMR] addOrUpdateRoomAttributes failed: %@", error.description);
            !failureBlock?:failureBlock(error);
        }
    }];
}

- (void)deleteRoomAttributes:(HMRRoomId *)roomId byKeys:(NSSet<NSString *> *)keys options:(HMRRoomAttributeOptions *)options successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    Console_insert(@"[HMR] deleteRoomAttributes");
    [[HMRRoomService instance] deleteRoomAttributes:roomId byKeys:keys options:options completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            Console_insert(@"[HMR] deleteRoomAttributes success");
            !successBlock?:successBlock(roomId.ID, nil);
        } else {
            Console_insert(@"[HMR] deleteRoomAttributes failed: %@", error.description);
            !failureBlock?:failureBlock(error);
        }
    }];
}

- (void)queryRoomAttributes:(HMRRoomId *)roomId successBlock:(void (^)(NSDictionary<NSString *,NSString *> * _Nonnull))successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    Console_insert(@"[HMR] queryRoomAttributes");
    [[HMRRoomService instance] queryRoomAttributes:roomId completion:^(HMRRequestId  _Nonnull requestId, NSDictionary<NSString *,NSString *> * _Nonnull attributes, NSError * _Nonnull error) {
        if (!error) {
            Console_insert(@"[HMR] queryRoomAttributes success");
            !successBlock?:successBlock(attributes);
        } else {
            Console_insert(@"[HMR] queryRoomAttributes failed: %@", error.description);
            !failureBlock?:failureBlock(error);
        }
    }];
}

- (void)queryRoomAttributes:(HMRRoomId *)roomId byKeys:(NSSet<NSString *> *)keys successBlock:(void (^)(NSDictionary<NSString *,NSString *> * _Nonnull))successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    Console_insert(@"[HMR] queryRoomAttributes by keys");
    [[HMRRoomService instance] queryRoomAttributes:roomId byKeys:keys completion:^(HMRRequestId  _Nonnull requestId, NSDictionary<NSString *,NSString *> * _Nonnull attributes, NSError * _Nonnull error) {
        if (!error) {
            Console_insert(@"[HMR] queryRoomAttributes by keys success");
            !successBlock?:successBlock(attributes);
        } else {
            Console_insert(@"[HMR] queryRoomAttributes by keys failed: %@", error.description);
            !failureBlock?:failureBlock(error);
        }
    }];
}

- (void)queryMemberAttributtes:(HMRUserId *)member inRoom:(HMRRoomId *)roomId byKeys:(NSSet<NSString *> *)keys successBlock:(void (^)(NSDictionary<NSString *,NSString *> * _Nonnull))successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    Console_insert(@"[HMR] queryMemberAttributtes by keys");
    [[HMRRoomService instance] queryMemberAttributtes:member inRoom:roomId byKeys:keys completion:^(HMRRequestId  _Nonnull requestId, NSDictionary<NSString *,NSString *> * _Nonnull attributtes, NSError * _Nonnull error) {
        if (!error) {
            Console_insert(@"[HMR] queryMemberAttributtes by keys success");
            !successBlock?:successBlock(attributtes);
        } else {
            Console_insert(@"[HMR] queryMemberAttributtes by keys failed: %@", error.description);
            !failureBlock?:failureBlock(error);
        }
    }];
}

- (void)addOrUpdateMemberAttributes:(HMRUserId *)member inRoom:(HMRRoomId *)roomId withAttributes:(NSDictionary<NSString *,NSString *> *)attributes options:(HMRMemberAttributeOptions *)options successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    Console_insert(@"[HMR] addOrUpdateMemberAttributes");
    [[HMRRoomService instance] addOrUpdateMemberAttributes:member inRoom:roomId withAttributes:attributes options:options completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            Console_insert(@"[HMR] addOrUpdateMemberAttributes success");
            !successBlock?:successBlock(roomId.ID, @(member.ID).stringValue);
        } else {
            Console_insert(@"[HMR] addOrUpdateMemberAttributes failed: %@", error.description);
            !failureBlock?:failureBlock(error);
        }
    }];
}

- (void)deleteMemberAttributes:(HMRUserId *)member inRoom:(HMRRoomId *)roomId byKeys:(NSSet<NSString *> *)keys options:(HMRMemberAttributeOptions *)options successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    Console_insert(@"[HMR] deleteMemberAttributes");
    [[HMRRoomService instance] deleteMemberAttributes:member inRoom:roomId byKeys:keys options:nil completion:^(HMRRequestId reqId, NSError *error) {
        if (!error) {
            Console_insert(@"[HMR] deleteMemberAttributes success");
            !successBlock?:successBlock(roomId.ID, @(member.ID).stringValue);
        } else {
            Console_insert(@"[HMR] deleteMemberAttributes failed: %@", error.description);
            !failureBlock?:failureBlock(error);
        }
    }];
}

#pragma mark - Thunder delegate
/// 加入房间成功
- (void)thunderEngine:(ThunderEngine *)engine onJoinRoomSuccess:(NSString *)room withUid:(NSString *)uid elapsed:(NSInteger)elapsed
{
    Console_insert(@"[TB] joinThunderRoom success");
    self.stepStatus |= SYInterfaceStepStatusThunderRoom;
    [self joinRoomCallbackWithError:nil];
}

/// 收到首帧通知
- (void)thunderEngine:(ThunderEngine *)engine onRemoteVideoPlay:(NSString *)uid size:(CGSize)size elapsed:(NSInteger)elapsed
{
    if ([self.delegate respondsToSelector:@selector(onRemoteVideoPlay:size:elapsed:)]) {
        [self.delegate onRemoteVideoPlay:uid size:size elapsed:elapsed];
    }
}

/// 收到远端视频流信息通知
- (void)thunderEngine:(ThunderEngine *)engine onRemoteVideoStatsOfUid:(NSString *)uid stats:(ThunderRtcRemoteVideoStats *)stats
{
    if ([self.delegate respondsToSelector:@selector(onRemoteVideoStatsOfUid:stats:)]) {
        [self.delegate onRemoteVideoStatsOfUid:uid stats:stats];
    }
}

/// 收到网络质量通知
- (void)thunderEngine:(ThunderEngine *)engine onNetworkQuality:(nonnull NSString *)uid txQuality:(ThunderLiveRtcNetworkQuality)txQuality rxQuality:(ThunderLiveRtcNetworkQuality)rxQuality
{
    if ([self.delegate respondsToSelector:@selector(onNetworkQuality:txQuality:rxQuality:)]) {
        [self.delegate onNetworkQuality:uid txQuality:txQuality rxQuality:rxQuality];
    }
}

#pragma mark - Hummder delegate
/// 收到广播消息
- (void)didRoomMessageReceived:(HMRMessage *)message fromUser:(HMRUserId *)user inRoom:(HMRRoomId *)roomId
{
    NSString *uid = @(user.ID).stringValue;
    if ([self.delegate respondsToSelector:@selector(didRoomMessageReceived:fromUser:roomId:)]) {
        [self.delegate didRoomMessageReceived:message fromUser:uid roomId:roomId.ID];
    }
}

/// 收到点对点消息
- (void)didPeerMessageReceived:(HMRMessage *)message fromUser:(HMRUserId *)user
{
    NSString *uid = @(user.ID).stringValue;
    if ([self.delegate respondsToSelector:@selector(didPeerMessageReceived:fromUser:)]) {
        [self.delegate didPeerMessageReceived:message fromUser:uid];
    }
}

/// 收到成员离开的通知
- (void)didRoomMemberLeft:(NSSet<HMRUserId *> *)members inRoom:(HMRRoomId *)roomId
{
    NSMutableSet *mSet = [NSMutableSet set];
    [members enumerateObjectsUsingBlock:^(HMRUserId * _Nonnull obj, BOOL * _Nonnull stop) {
        NSString *uid = @(obj.ID).stringValue;
        [mSet addObject:uid];
    }];
    if ([self.delegate respondsToSelector:@selector(didRoomMemberLeft:roomId:)]) {
        [self.delegate didRoomMemberLeft:mSet roomId:roomId.ID];
    }
}

/// 收到自己断线离开房间的通知
- (void)didRoomMemberOffline:(NSSet<HMRRoomId *> *)roomIds
{
    Console_insert(@"[HMR] didRoomMemberOffline");
    self.stepStatus ^= SYInterfaceStepStatusRtsRoom;
    NSMutableSet *mSet = [NSMutableSet set];
    [roomIds enumerateObjectsUsingBlock:^(HMRRoomId * _Nonnull obj, BOOL * _Nonnull stop) {
        [mSet addObject:obj.ID];
    }];
    if ([self.delegate respondsToSelector:@selector(didRoomMemberOffline:)]) {
        [self.delegate didRoomMemberOffline:mSet];
    }
}

/// 收到频道属性更新的通知
- (void)didRoomAttributesAddedOrUpdated:(HMRRoomId *)roomId withAttributes:(NSDictionary<NSString *,NSString *> *)attributes byUser:(HMRUserId *)user
{
    NSString *uid = @(user.ID).stringValue;
    if ([self.delegate respondsToSelector:@selector(didRoomAttributesAddedOrUpdated:withAttributes:byUser:)]) {
        [self.delegate didRoomAttributesAddedOrUpdated:roomId.ID withAttributes:attributes byUser:uid];
    }
}

/// 收到频道属性删除的通知
- (void)didRoomAttributesDeleted:(HMRRoomId *)roomId withAttributes:(NSDictionary<NSString *,NSString *> *)attributes byUser:(HMRUserId *)user
{
    NSString *uid = @(user.ID).stringValue;
    if ([self.delegate respondsToSelector:@selector(didRoomAttributesDeleted:withAttributes:byUser:)]) {
        [self.delegate didRoomAttributesDeleted:roomId.ID withAttributes:attributes byUser:uid];
    }
}

/// 收到频道内用户属性更新的通知
- (void)didRoomMemberAttributesAddedOrUpdated:(HMRUserId *)member inRoom:(HMRRoomId *)roomId withAttributes:(NSDictionary<NSString *,NSString *> *)attributes
{
    NSString *uid = @(member.ID).stringValue;
    if ([self.delegate respondsToSelector:@selector(didRoomMemberAttributesAddedOrUpdated:roomId:withAttributes:)]) {
        [self.delegate didRoomMemberAttributesAddedOrUpdated:uid roomId:roomId.ID withAttributes:attributes];
    }
}

/// 收到频道内用户属性删除的通知
- (void)didRoomMemberAttributesDeleted:(HMRUserId *)member inRoom:(HMRRoomId *)roomId withAttributes:(NSSet<NSString *> *)keys
{
    NSString *uid = @(member.ID).stringValue;
    if ([self.delegate respondsToSelector:@selector(didRoomMemberAttributesDeleted:roomId:withAttributes:)]) {
        [self.delegate didRoomMemberAttributesDeleted:uid roomId:roomId.ID withAttributes:keys];
    }
}

- (void)didHummerStateChanged:(HMRState)oldState toState:(HMRState)newState withReason:(NSString *)reason
{
    Console_insert(@"[HMR] hummer state change to %lu", (unsigned long)newState);
    if ([self.delegate respondsToSelector:@selector(didHummerStateChanged:toState:)]) {
        [self.delegate didHummerStateChanged:oldState toState:newState];
    }
}

@end
