//
//  SYBCEducationManager.m
//  SCClassRoom
//
//  Created by Huan on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYBCEducationManager.h"
#import "AFNetworking.h"
#import "SYRequestManager.h"
#import "NSBundle+SYAppConfig.h"

#define WeakSelf __weak __typeof__(self) weakSelf = self;

@interface SYBCEducationManager()

@property (nonatomic, copy) NSString *token;    // SDK 校验 token
@property (nonatomic, strong) SYInterfaceManager *manager;
@property (nonatomic, strong) SYWhiteBoardManager *whiteManager;    //whiteManager
@property (nonatomic, strong) ThunderVideoCanvas *remoteCanvas1;

@end


@implementation SYBCEducationManager

+ (instancetype)sharedManager {
    static SYBCEducationManager *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

+ (NSString *)getSDKVersion
{
    return [SYInterfaceManager getSDKVersion];
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
    return [self.manager getRoomIsJoined];
}

#pragma mark Thunder & Hummer
- (void)startSDKAndCreateEngineWithDelegate:(id<SYInterfaceManagerDelegate>)delegate
{
    self.token = [NSBundle sy_getSDKToken];
    _manager = [SYInterfaceManager sharedManager];
    [self.manager startSDKAndCreateEngineWithAppId:[NSBundle sy_getAppId]];
    self.manager.delegate = delegate;
}

- (void)joinRoomWithRoomId:(NSString *)roomId uid:(NSString *)uid
{
    if (roomId.length == 0 || uid.length == 0) {
        return;
    }
    
    //设置区域为默认值（国内）
    [self.manager setArea:THUNDER_AREA_DEFAULT];
    //设置房间属性
    [self.manager setRoomMode:THUNDER_ROOM_CONFIG_COMMUNICATION];
    [self.manager setMediaMode:THUNDER_CONFIG_NORMAL];
    //设置音频属性
    [self.manager setAudioConfig:THUNDER_AUDIO_CONFIG_MUSIC_STANDARD commutMode:THUNDER_COMMUT_MODE_HIGH scenarioMode:THUNDER_SCENARIO_MODE_DEFAULT];
    ThunderVideoEncoderConfiguration *videoEncoderConfiguration = [[ThunderVideoEncoderConfiguration alloc] init];
    //开播类型为多人连麦开播
    videoEncoderConfiguration.playType = THUNDERPUBLISH_PLAY_INTERACT;
    // 设置视频编码类型为101
    videoEncoderConfiguration.publishMode = 101;
    [self.manager setVideoEncoderConfig:videoEncoderConfiguration];
    [self.manager enableWebSdkCompatibility:YES];
    
    [self.manager joinRoomWithRoomId:roomId uid:uid token:self.token];
}

- (void)leaveRoomWithRoomId:(NSString *)roomId
{
    [self.manager leaveRoomWithRoomId:roomId];
}

#pragma mark - Thunder
- (void)stopAllRemoteVideoStreams:(BOOL)stopped
{
    [self.manager stopAllRemoteVideoStreams:stopped];
}

- (void)stopRemoteVideoStream:(NSString *)uid stopped:(BOOL)stopped
{
    [self.manager stopRemoteVideoStream:uid stopped:stopped];
}

- (void)stopAllRemoteAudioStreams:(BOOL)stopped
{
    [self.manager stopAllRemoteAudioStreams:stopped];
}

- (void)stopRemoteAudioStream:(NSString *)uid stopped:(BOOL)stopped
{
    [self.manager stopRemoteAudioStream:uid stopped:stopped];
}

- (void)createRomoteCanvasWithUid:(NSString *)uid canvasView:(nonnull UIView *)view
{
    // 创建视频视图
    ThunderVideoCanvas *remoteCanvas = [[ThunderVideoCanvas alloc] init];
    remoteCanvas.view = view;
    // 设置视频布局
    [remoteCanvas setRenderMode:THUNDER_RENDER_MODE_CLIP_TO_BOUNDS];
    // 设置用户uid
    [remoteCanvas setUid:uid];
    [_manager setRemoteVideoCanvas:remoteCanvas];
    [_manager setRemoteCanvasScaleMode:uid mode:THUNDER_RENDER_MODE_CLIP_TO_BOUNDS];
}

- (void)createLocalCanvasWithUid:(NSString *)uid canvasView:(nonnull UIView *)view
{
    // 创建视频视图
    ThunderVideoCanvas *localCanvas = [[ThunderVideoCanvas alloc] init];
    localCanvas.view = view;
    // 设置视频布局
    [localCanvas setRenderMode:THUNDER_RENDER_MODE_CLIP_TO_BOUNDS];
    // 设置用户uid
    [localCanvas setUid:uid];
    [_manager setLocalVideoCanvas:localCanvas];
    [_manager setLocalCanvasScaleMode:THUNDER_RENDER_MODE_CLIP_TO_BOUNDS];
}

- (BOOL)enableLive
{
    [_manager setVideoCaptureOrientation:THUNDER_VIDEO_CAPTURE_ORIENTATION_LANDSCAPE];
    int startPreview = [_manager startVideoPreview];
    int enableCapture = [_manager enableLocalVideoCapture:YES];
    int publishAudio = [_manager stopLocalAudioStream:NO];
    int publishVideo = [_manager stopLocalVideoStream:NO];
    if (enableCapture || startPreview || publishAudio || publishVideo) {
        return NO;
    }
    return YES;
}

- (BOOL)disableLive
{
    int stopPreview = [_manager stopVideoPreview];
    int disableCapture = [_manager enableLocalVideoCapture:NO];
    int stopAudio = [_manager stopLocalAudioStream:YES];
    int stopVideo = [_manager stopLocalVideoStream:YES];
    if (stopAudio || stopPreview || stopVideo || disableCapture) {
        return NO;
    }
    return YES;
}

#pragma mark - Hummer
- (void)sendPeerMessageToUser:(NSString *)uid content:(id)content type:(NSString *)type successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    NSData *data = [NSJSONSerialization dataWithJSONObject:content options:NSJSONWritingPrettyPrinted error:nil];
    NSString *jsonString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    HMRMessage *message = [HMRMessage messageWithType:type content:jsonData appExtras:nil];
    HMRUserId *user = [HMRUserId userWithID:uid.longLongValue];
    [self.manager sendMessage:message withOptions:nil toUser:user successBlock:successBlock failureBlock:failureBlock];
}

- (void)sendMessageRoomId:(NSString *)roomId content:(id)content type:(NSString *)type successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    NSData *data = [NSJSONSerialization dataWithJSONObject:content options:NSJSONWritingPrettyPrinted error:nil];
    NSString *jsonString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    HMRMessage *message = [HMRMessage messageWithType:type content:jsonData appExtras:nil];
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    [self.manager sendMessage:message withOptions:[HMRMessagingOptions new] inRoom:hmrRoomId successBlock:successBlock failureBlock:failureBlock];
}

- (void)addOrUpdateRoomAttributesWithRoomId:(NSString *)roomId attributes:(NSDictionary<NSString *,NSString *> *)attributes successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    [self.manager addOrUpdateRoomAttributes:hmrRoomId withAttributes:attributes options:nil successBlock:successBlock failureBlock:failureBlock];
}

- (void)deleteRoomAttributesWithRoomId:(NSString *)roomId keys:(NSSet<NSString *> *)keys successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    [self.manager deleteRoomAttributes:hmrRoomId byKeys:keys options:nil successBlock:successBlock failureBlock:failureBlock];
}

- (void)queryRoomAttributes:(NSString *)roomId successBlock:(void (^)(NSDictionary<NSString *,NSString *> * _Nonnull))successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    [self.manager queryRoomAttributes:hmrRoomId successBlock:successBlock failureBlock:failureBlock];
}

- (void)queryRoomAttributesWithRoomId:(NSString *)roomId keys:(NSSet<NSString *> *)keys successBlock:(void (^)(NSDictionary<NSString *,NSString *> * _Nonnull))successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    [self.manager queryRoomAttributes:hmrRoomId byKeys:keys successBlock:successBlock failureBlock:failureBlock];
}

- (void)queryMemberAttributtes:(NSString *)uid inRoom:(NSString *)roomId byKeys:(NSSet<NSString *> *)keys successBlock:(void (^)(NSDictionary<NSString *,NSString *> * _Nonnull))successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    HMRUserId *user = [HMRUserId userWithID:uid.longLongValue];
    [self.manager queryMemberAttributtes:user inRoom:hmrRoomId byKeys:keys successBlock:successBlock failureBlock:failureBlock];
}

- (void)addOrUpdateMemberAttributesWithRoomId:(NSString *)roomId uid:(NSString *)uid attributes:(NSDictionary<NSString *,NSString *> *)attributes successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    HMRUserId *user = [HMRUserId userWithID:uid.longLongValue];
    [self.manager addOrUpdateMemberAttributes:user inRoom:hmrRoomId withAttributes:attributes options:nil successBlock:successBlock failureBlock:failureBlock];
}

- (void)deleteMemberAttributesWithRoomId:(NSString *)roomId uid:(NSString *)uid keys:(NSSet<NSString *> *)keys successBlock:(SYInterfaceSuccessBlock)successBlock failureBlock:(SYInterfaceFailureBlock)failureBlock
{
    HMRRoomId *hmrRoomId = [HMRRoomId roomWithID:roomId];
    HMRUserId *user = [HMRUserId userWithID:uid.longLongValue];
    [self.manager deleteMemberAttributes:user inRoom:hmrRoomId byKeys:keys options:nil successBlock:successBlock failureBlock:failureBlock];
}

#pragma mark - White board
- (void)createWhite:(WhiteBoardView *)boardView delegate:(id<SYWhiteBoardManagerDelegate>)delegate
{
    _whiteManager = [[SYWhiteBoardManager alloc] init];
    [_whiteManager initWhiteSDKWithBoardView:boardView config:[WhiteSdkConfiguration defaultConfig]];
    _whiteManager.whiteManagerDelegate = delegate;
}

- (void)joinWhiteRoomWithUuid:(NSString *)uuid completionHandler:(void (^)(WhiteRoom * _Nullable, NSError * _Nullable))handler
{
    WeakSelf
    [self getWhiteTokenWithUUID:uuid success:^(NSString * _Nonnull token) {
        WhiteRoomConfig *roomConfig = [[WhiteRoomConfig alloc] initWithUuid:uuid roomToken:token];
        [weakSelf.whiteManager joinWhiteRoomWithConfig:roomConfig completionHandler:^(WhiteRoom * _Nullable room, NSError * _Nullable error) {
            !handler?:handler(room,error);
        }];
    } failure:^(NSError * _Nonnull error) {
        !handler?:handler(nil,error);
    }];
}

- (void)disableWhiteDeviceInputs:(BOOL)disable
{
    [_whiteManager disableDeviceInputs:disable];
}

- (void)setWhiteBoardToolsName:(NSString *)name
{
    [_whiteManager setWhiteBoardToolsName:name];
}

- (void)setWhiteBoardStrokeColor:(NSArray<NSNumber *> *)strokeColor
{
    [_whiteManager setWhiteBoardStrokeColor:strokeColor];
}

- (void)setWhiteSceneIndex:(NSUInteger)index completionHandler:(void (^)(BOOL, NSError * _Nullable))completionHandler
{
    [_whiteManager setSceneIndex:index completionHandler:completionHandler];
}

- (void)destroyWhiteBoard
{
    [_whiteManager destroyWhiteBoard];
}

- (void)getWhiteTokenWithUUID:(NSString *)uuid success:(void (^) (NSString * _Nonnull token))success failure:(void (^) (NSError * _Nonnull error))failure
{
    NSString *urlString = [NSBundle sy_getWhiteRequestUrl];
    NSString *token = [NSBundle sy_getWhiteToken];
    if (!urlString.length || !token.length) {
        NSLog(@"please input whiteboard url and token");
        NSError *error = [NSError errorWithDomain:@"please input whiteboard url and token" code:-1 userInfo:nil];
        !failure?:failure(error);
        return;
    }
    NSString *url = [NSString stringWithFormat:@"%@?uuid=%@&token=%@", urlString, uuid, token];
    [[SYRequestManager sharedmanager] post:url params:nil complete:^(NSError * _Nullable error, id  _Nullable result, NSURLSessionTask * _Nonnull task) {
        if (!error) {
            NSDictionary *dic = result;
            !success?:success(dic[@"msg"][@"roomToken"]);
        } else {
            !failure?:failure(error);
        }
    }];
}

@end
