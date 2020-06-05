//
//  SYBCEducationManager.h
//  SCClassRoom
//
//  Created by Huan on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Foundation/NSAutoreleasePool.h>
#import "SYInterfaceManager.h"
#import "SYWhiteBoardManager.h"

NS_ASSUME_NONNULL_BEGIN

@interface SYBCEducationManager : NSObject

+ (instancetype)sharedManager;

#pragma mark - Thunder & Hummer
/// 获取 sdk 版本
+ (NSString *)getSDKVersion;

/// 查看 hummer 是否连接状态
- (BOOL)getHummerIsConnected;

/// 查看是否在房间内
- (BOOL)getRoomIsJoined;

/// 初始化 sdk 并创建 thunder engine
/// @param delegate delegate description
- (void)startSDKAndCreateEngineWithDelegate:(id<SYInterfaceManagerDelegate>)delegate;

/// 加入房间
/// @param roomId 房间
/// @param uid 当前用户
- (void)joinRoomWithRoomId:(NSString *_Nonnull)roomId
                       uid:(NSString *_Nonnull)uid;

/// 离开房间
/// @param roomId 房间
- (void)leaveRoomWithRoomId:(NSString *_Nonnull)roomId;

#pragma mark - Thunder
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

/// 设置远端视图
/// @param uid 用户
/// @param view 视图
- (void)createRomoteCanvasWithUid:(NSString *)uid canvasView:(UIView *)view;

/// 设置本地视图
/// @param uid 用户
/// @param view 视图
- (void)createLocalCanvasWithUid:(NSString *)uid canvasView:(UIView *)view;

/// 开启音视频功能
- (BOOL)enableLive;

/// 关闭音视频功能
- (BOOL)disableLive;

#pragma mark - Hummer
/// 发送点对点消息
/// @param uid 接收用户
/// @param content 内容
/// @param type 消息类型
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)sendPeerMessageToUser:(NSString *)uid
                      content:(id)content
                         type:(NSString *)type
                 successBlock:(SYInterfaceSuccessBlock _Nullable)successBlock
                 failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;

/// 发送广播消息
/// @param roomId 房间
/// @param content 内容
/// @param type 消息类型
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)sendMessageRoomId:(NSString *)roomId
                  content:(id)content
                     type:(NSString *)type
             successBlock:(SYInterfaceSuccessBlock _Nullable)successBlock
             failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;

/// 更新指定房间的属性：属性存在则更新；属性不存在则添加；
/// @param roomId 房间
/// @param attributes 属性
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)addOrUpdateRoomAttributesWithRoomId:(NSString *_Nonnull)roomId
                                 attributes:(NSDictionary <NSString *, NSString *> *)attributes
                               successBlock:(SYInterfaceSuccessBlock _Nullable)successBlock
                               failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;

/// 删除指定房间的指定属性
/// @param roomId 房间
/// @param keys 属性keys：对应的单个key不能为空（返回错误）
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)deleteRoomAttributesWithRoomId:(NSString *_Nonnull)roomId
                                  keys:(NSSet <NSString *> *)keys
                          successBlock:(SYInterfaceSuccessBlock _Nullable)successBlock
                          failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;

/// 查询指定房间的全部属性
/// @param roomId 房间
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)queryRoomAttributes:(NSString *_Nonnull)roomId
               successBlock:(void(^)(NSDictionary<NSString *, NSString *> *attributes))successBlock
               failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;

/// 查询指定房间的指定属性
/// @param roomId 房间
/// @param keys 属性keys：对应的单个key不能为空（返回错误）
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)queryRoomAttributesWithRoomId:(NSString *_Nonnull)roomId
                                 keys:(NSSet <NSString *> *)keys
                         successBlock:(void(^)(NSDictionary<NSString *, NSString *> *attributes))successBlock
                         failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;

/// 查看用户在当前房间指定属性
/// @param uid 用户
/// @param roomId 房间
/// @param keys 需要查看的属性
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)queryMemberAttributtes:(NSString *_Nonnull)uid
                        inRoom:(NSString *_Nonnull)roomId
                        byKeys:(NSSet<NSString *> *)keys
                  successBlock:(void(^)(NSDictionary<NSString *, NSString *> *attributes))successBlock
                  failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;

/// 设置用户在当前房间属性,如属性已经存在，则更新，不存在，则新增
/// @param roomId 房间
/// @param uid 当前用户
/// @param attributes 属性信息
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)addOrUpdateMemberAttributesWithRoomId:(NSString *_Nonnull)roomId
                                          uid:(NSString *_Nonnull)uid
                                   attributes:(NSDictionary<NSString *, NSString *> *)attributes
                                 successBlock:(SYInterfaceSuccessBlock _Nullable)successBlock
                                 failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;
                                     
/// 删除用户在当前房间的某些信息（目前只支持删除自己的信息）
/// @param roomId 房间
/// @param uid 当前用户
/// @param keys 属性的key集合
/// @param successBlock 回调
/// @param failureBlock 回调
- (void)deleteMemberAttributesWithRoomId:(NSString *_Nonnull)roomId
                                     uid:(NSString *_Nonnull)uid
                                    keys:(NSSet<NSString *> *)keys
                            successBlock:(SYInterfaceSuccessBlock _Nullable)successBlock
                            failureBlock:(SYInterfaceFailureBlock _Nullable)failureBlock;

#pragma mark - White board
/// 初始化白板SDK
/// @param boardView boardView description
/// @param delegate delegate description
- (void)createWhite:(WhiteBoardView *)boardView delegate:(id<SYWhiteBoardManagerDelegate>)delegate;

/// 进入白板房间
/// @param uuid uuid description
/// @param handler handler description
- (void)joinWhiteRoomWithUuid:(NSString *)uuid completionHandler:(void (^) (WhiteRoom * _Nullable room,NSError * _Nullable error))handler;

/// 设置白板书写权限
/// @param disable disable description
- (void)disableWhiteDeviceInputs:(BOOL)disable;

/// 设置白板工具
/// @param name name description
- (void)setWhiteBoardToolsName:(NSString *)name;

/// 设置白板画笔颜色
/// @param strokeColor strokeColor description
- (void)setWhiteBoardStrokeColor:(NSArray<NSNumber *>*)strokeColor;

/// 选择白板场景
/// @param index index description
/// @param completionHandler completionHandler description
- (void)setWhiteSceneIndex:(NSUInteger)index completionHandler:(void (^ _Nullable)(BOOL success, NSError * _Nullable error))completionHandler;

/// 销毁白板
- (void)destroyWhiteBoard;

@end

NS_ASSUME_NONNULL_END
