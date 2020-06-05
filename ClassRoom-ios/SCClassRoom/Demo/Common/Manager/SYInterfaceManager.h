//
//  SYInterfaceManager.h
//  SCloudInterfaceDemo
//
//  Created by Huan on 2020/2/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <thunderboltdynamic/ThunderEngine.h>
#import <Hmr.h>
#import <HMRRts.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^SYInterfaceSuccessBlock)(NSString *_Nullable roomId, NSString *_Nullable uid);
typedef void (^SYInterfaceFailureBlock)(NSError *_Nullable error);

@protocol SYInterfaceManagerDelegate <NSObject>
@optional

/// 加入房间回调
/// @param error 错误信息，为空则加入成功
- (void)joinRoomWithError:(NSError *)error;

/// 离开房间回调
/// @param error 错误信息，为空则离开成功
- (void)leaveRoomWithError:(NSError *)error;

/// 当有一个用户往房间内发一条信令消息时，房间内所有的成员都会受到该事件的通知回调
/// @param message 收到的信令消息
/// @param user 房间成员
/// @param roomId 房间
- (void)didRoomMessageReceived:(HMRMessage *)message
                      fromUser:(NSString *)user
                        roomId:(NSString *)roomId;

/// 当收到P2P信令消息时，会收到该事件的通知回调
/// @param message 收到的信令消息
/// @param user 发送者
- (void)didPeerMessageReceived:(HMRMessage *)message
                      fromUser:(NSString *)user;

/// 成员离开房间通知
/// @param members 成员列表
/// @param roomId 房间
- (void)didRoomMemberLeft:(NSSet<NSString *> *)members
                   roomId:(NSString *)roomId;

/// 成员断线超时离开房间通知
/// @param roomIds 房间列表
- (void)didRoomMemberOffline:(NSSet<NSString *> *)roomIds;

/// hummer 状态改变通知
- (void)didHummerStateChanged:(HMRState)oldState toState:(HMRState)newState;

/// 房间属性新增或更新通知
/// @param roomId 房间信息
/// @param attributes 对应属性值
/// @param user 操作者
- (void)didRoomAttributesAddedOrUpdated:(NSString *)roomId
                         withAttributes:(NSDictionary<NSString *, NSString *> *)attributes
                                 byUser:(NSString *)user;

/// 房间属性删除通知
/// @param roomId 房间标识
/// @param attributes 对应属性
/// @param user 操作者
- (void)didRoomAttributesDeleted:(NSString *)roomId
                  withAttributes:(nullable NSDictionary<NSString *, NSString *> *)attributes
                          byUser:(NSString *)user;

/// 房间成员信息新增或更新回调通知（房间人数超过500人，属性变更不进行通知）
/// @param member 房间成员
/// @param roomId 房间
/// @param attributes 设置的属性
- (void)didRoomMemberAttributesAddedOrUpdated:(NSString *)member
                                       roomId:(NSString *)roomId
                               withAttributes:(NSDictionary<NSString *, NSString *> *)attributes;

/// 房间成员信息删除回调通知（房间人数超过500人，属性变更不进行通知）
/// @param member 房间成员
/// @param roomId 房间
/// @param keys 删除的keys
- (void)didRoomMemberAttributesDeleted:(NSString *)member
                                roomId:(NSString *)roomId
                        withAttributes:(nullable NSSet<NSString *> *)keys;

/// 已显示远端视频首帧回调
/// @param uid 对应的uid
/// @param size 视频尺寸(宽和高)
/// @param elapsed 实耗时间，从调用joinRoom到发生此事件经过的时间（毫秒）
- (void)onRemoteVideoPlay:(nonnull NSString *)uid
                     size:(CGSize)size
                  elapsed:(NSInteger)elapsed;

/// 通话中远端视频流信息回调
/// @param uid 远端用户/主播id
/// @param stats 流信息，参见ThunderRtcRemoteVideoStats
- (void)onRemoteVideoStatsOfUid:(nonnull NSString*)uid
                          stats:(ThunderRtcRemoteVideoStats* _Nonnull)stats;

/// 网路上下行质量报告回调
/// @param uid 表示该回调报告的是持有该id的用户的网络质量，当uid为0时，返回的是本地用户的网络质量
/// @param txQuality 该用户的上行网络质量，参见ThunderLiveRtcNetworkQuality
/// @param rxQuality 该用户的下行网络质量，参见ThunderLiveRtcNetworkQuality
- (void)onNetworkQuality:(nonnull NSString*)uid
               txQuality:(ThunderLiveRtcNetworkQuality)txQuality
               rxQuality:(ThunderLiveRtcNetworkQuality)rxQuality;

@end


@interface SYInterfaceManager : NSObject

@property (nonatomic, weak) id<SYInterfaceManagerDelegate> delegate;
+ (instancetype)sharedManager;

/// 获取 sdk 版本
+ (NSString *)getSDKVersion;

/// 查看 hummer 是否连接状态
- (BOOL)getHummerIsConnected;

/// 查看是否在房间内
- (BOOL)getRoomIsJoined;

/// 初始化 sdk 并创建 thunder engine
/// @param appId appId description
- (void)startSDKAndCreateEngineWithAppId:(NSString *)appId;

/// 加入房间
/// @param roomId 房间
/// @param uid 当前用户
/// @param token 校验 token
- (void)joinRoomWithRoomId:(NSString *_Nonnull)roomId
                       uid:(NSString *_Nonnull)uid
                     token:(NSString *_Nonnull)token;

/// 离开房间
/// @param roomId 房间
- (void)leaveRoomWithRoomId:(NSString *_Nonnull)roomId;

/// 设置远端视频的渲染视图（需在"初始化"后调用）
/// @param remote 具体的视图设置
- (void)setRemoteVideoCanvas:(ThunderVideoCanvas *_Nonnull)remote;

/// 设置远端视图显示模式（需在"初始化"后调用）
/// @param uid 指定用户
/// @param mode 渲染显示模式
- (void)setRemoteCanvasScaleMode:(NSString* _Nonnull)uid mode:(ThunderVideoRenderMode)mode;

/// 停止／接收所有远端视频（需在"初始化"后调用，仅在destroyEngine时重置）
/// @param stopped true:禁止所有远端视频流，false:接收所有远端视频流，默认值为:false
- (void)stopAllRemoteVideoStreams:(BOOL)stopped;

/// 停止/接收指定的远端视频（需在"初始化"后调用，仅在destroyEngine时重置）
/// @param uid 用户id
/// @param stopped stopped true:禁止指定用户远端视频，false:接收指定用户远端视频
- (void)stopRemoteVideoStream:(NSString* _Nonnull)uid stopped:(BOOL)stopped;

/// 停止/接收所有音频数据，默认是false（需在"初始化"后调用，仅在destroyEngine时重置）
/// @param stopped true:停止所有远端音频 false:接收所有远端音频
- (void)stopAllRemoteAudioStreams:(BOOL)stopped;

/// 停止/接收指定音频数据（需在"初始化"后调用，仅在destroyEngine时重置）
/// @param uid 用户id
/// @param stopped true:停止用户音频 false:接收用户音频
- (void)stopRemoteAudioStream:(NSString*_Nonnull)uid stopped:(BOOL)stopped;


#pragma mark - Thunder begin live & end live
/// 设置横竖屏，默认竖屏，预览前、开播中都可用
/// @param orientation 参见ThunderVideoCaptureOrientation
- (void)setVideoCaptureOrientation:(ThunderVideoCaptureOrientation)orientation;

/// 打开/关闭本地视频采集（需在"初始化"后调用）
/// @param enabled true:打开本地采集 false:关闭本地采集
/// @return 0:成功, 其它错误参见enum ThunderRet
- (int)enableLocalVideoCapture:(BOOL)enabled;

/// 开启本机摄像头视频预览（需在"初始化"后调用）
/// @return 0:成功, 其它错误参见enum ThunderRet
- (int)startVideoPreview;

/// 停止本机摄像头视频预览（需在"初始化"后调用）
/// @return 0:成功, 其它错误参见enum ThunderRet
- (int)stopVideoPreview;

/// 关闭/打开本地音频(包括音频的采集编码与上行,需"进房间成功"才能调用)
/// @param stopped true：关闭本地音频； false：打开本地音频
/// @return 0:成功, 其它错误参见enum ThunderRet
- (int)stopLocalAudioStream:(BOOL)stopped;

/// 打开/关闭本地视频发送
/// @param stopped true:打开本地视频发送 false:关闭本地视频发送
/// @return 0:成功, 其它错误参见enum ThunderRet
- (int)stopLocalVideoStream:(BOOL)stopped;

/// 设置本地视图显示模式（需在"初始化"后调用）
/// @param mode 渲染显示模式
- (void)setLocalCanvasScaleMode:(ThunderVideoRenderMode)mode;

/// 设置本地视频的渲染视图（需在"初始化"后调用）
/// @param local 具体的渲染设置
- (void)setLocalVideoCanvas:(ThunderVideoCanvas *_Nullable)local;

#pragma mark - Thunder config
/// 设置媒体模式 （需要"初始化"后、"进入房间"前调用，仅在destroyEngine被重置）
/// @param mode 媒体模式
- (void)setMediaMode:(ThunderRtcConfig)mode;

/// 设置房间模式 （需在"初始化"后，仅在destroyEngine被重置）
/// @param mode 房间模式
- (void)setRoomMode:(ThunderRtcRoomConfig)mode;

/// 设置用户国家区域（joinRoom前调用生效。国外用户必须调用，国内用户可以不调用）
/// @param area 区域类型（默认值：AREA_DEFAULT（国内））
- (void)setArea:(ThunderRtcAreaType)area;

/// 设置场景id
/// @param sceneId 场景id
- (void)setSceneId:(NSInteger)sceneId;

/// 设置音频属性（需音频采集开播前调用）
/// @param config 设置采样率，码率，编码模式和声道数
/// @param commutMode 设置交互模式
/// @param scenarioMode 设置场景模式
- (void)setAudioConfig:(ThunderRtcAudioConfig)config
            commutMode:(ThunderRtcCommutMode)commutMode
          scenarioMode:(ThunderRtcScenarioMode)scenarioMode;

/// 设置音频开播模式
/// @param sourceType 模式
- (void)setAudioSourceType:(ThunderSourceType)sourceType;

/// 设置视频编码配置（需在"初始化"后调用）
/// @param config 具体的编码配置
- (void)setVideoEncoderConfig:(ThunderVideoEncoderConfiguration* _Nonnull)config;

/// 开启跟websdk兼容后内部禁止编码B帧，因为websdk不能正常解码B帧。要求开播前调用，跟进退房间无关。
/// 需在"初始化"后调用，仅在destroyEngine时重置
/// @param enabled 是否开启兼容，默认关闭。
- (void)enableWebSdkCompatibility:(BOOL)enabled;

#pragma mark - Hummer Method
/// 发送房间消息
/// @param message message 消息
/// @param options 发送消息所需要的配置信息
/// @param roomId 房间
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)sendMessage:(HMRMessage *)message
        withOptions:(HMRMessagingOptions *)options
             inRoom:(HMRRoomId *)roomId
       successBlock:(SYInterfaceSuccessBlock)successBlock
       failureBlock:(SYInterfaceFailureBlock)failureBlock;

/// 发送P2P信令消息
/// @param message 需要发送的信令消息
/// @param options 发送消息所需要的配置信息
/// @param user 信令消息的接受者标识
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)sendMessage:(HMRMessage *)message
        withOptions:(HMRMessagingOptions *_Nullable)options
             toUser:(HMRUserId *)user
       successBlock:(SYInterfaceSuccessBlock)successBlock
       failureBlock:(SYInterfaceFailureBlock)failureBlock;

/// 更新指定房间的属性：属性存在则更新；属性不存在则添加；
/// @param roomId 房间
/// @param attributes 属性
/// @param options 预留字段
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)addOrUpdateRoomAttributes:(HMRRoomId *)roomId
                   withAttributes:(NSDictionary <NSString *, NSString *> *)attributes
                          options:(nullable HMRRoomAttributeOptions *)options
                     successBlock:(SYInterfaceSuccessBlock)successBlock
                     failureBlock:(SYInterfaceFailureBlock)failureBlock;

/// 删除指定房间的指定属性
/// @param roomId 房间
/// @param keys 属性keys：对应的单个key不能为空（返回错误）
/// @param options 预留字段
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)deleteRoomAttributes:(HMRRoomId *)roomId
                      byKeys:(NSSet <NSString *> *)keys
                     options:(nullable HMRRoomAttributeOptions *)options
                successBlock:(SYInterfaceSuccessBlock)successBlock
                failureBlock:(SYInterfaceFailureBlock)failureBlock;

/// 查询指定房间的全部属性
/// @param roomId 房间
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)queryRoomAttributes:(HMRRoomId *)roomId
               successBlock:(void(^)(NSDictionary<NSString *, NSString *> *attributes))successBlock
               failureBlock:(SYInterfaceFailureBlock)failureBlock;

/// 查询指定房间的指定属性
/// @param roomId 房间
/// @param keys 属性keys：对应的单个key不能为空（返回错误）
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)queryRoomAttributes:(HMRRoomId *)roomId
                     byKeys:(NSSet <NSString *> *)keys
               successBlock:(void(^)(NSDictionary<NSString *, NSString *> *attributes))successBlock
               failureBlock:(SYInterfaceFailureBlock)failureBlock;

/// 查看用户在当前房间指定属性
/// @param member 用户
/// @param roomId 房间
/// @param keys 需要查看的属性
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)queryMemberAttributtes:(HMRUserId *)member
                        inRoom:(HMRRoomId *)roomId
                        byKeys:(NSSet<NSString *> *)keys
                  successBlock:(void(^)(NSDictionary<NSString *, NSString *> *attributes))successBlock
                  failureBlock:(SYInterfaceFailureBlock)failureBlock;

/// 设置用户在当前房间属性,如属性已经存在，则更新，不存在，则新增
/// @param member 当前用户
/// @param roomId 房间
/// @param attributes 属性信息
/// @param options 属性可选项，预留
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)addOrUpdateMemberAttributes:(HMRUserId *)member
                             inRoom:(HMRRoomId *)roomId
                     withAttributes:(NSDictionary<NSString *, NSString *> *)attributes
                            options:(nullable HMRMemberAttributeOptions *)options
                       successBlock:(SYInterfaceSuccessBlock)successBlock
                       failureBlock:(SYInterfaceFailureBlock)failureBlock;

/// 删除用户在当前房间的某些信息,目前只支持删除自己的信息
/// @param member 当前用户
/// @param roomId 房间
/// @param keys 属性的key集合
/// @param options 属性可选项，预留
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)deleteMemberAttributes:(HMRUserId *)member
                        inRoom:(HMRRoomId *)roomId
                        byKeys:(NSSet<NSString *> *)keys
                       options:(nullable HMRMemberAttributeOptions *)options
                  successBlock:(SYInterfaceSuccessBlock)successBlock
                  failureBlock:(SYInterfaceFailureBlock)failureBlock;


@end

NS_ASSUME_NONNULL_END
