//
//  SYWhiteBoardManager.h
//  SCClassRoom
//
//  Created by Huan on 2020/3/11.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Whiteboard.h"

NS_ASSUME_NONNULL_BEGIN

@protocol SYWhiteBoardManagerDelegate <NSObject>

@optional


@end

@interface SYWhiteBoardManager : NSObject

@property (nonatomic, assign) id<SYWhiteBoardManagerDelegate> whiteManagerDelegate;

/// 初始化白板SDK
/// @param boardView boardView description
/// @param config config description
- (void)initWhiteSDKWithBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config;

/// 进入房间
/// @param config config description
/// @param handler handler description
- (void)joinWhiteRoomWithConfig:(WhiteRoomConfig *)config completionHandler:(void (^) (WhiteRoom * _Nullable room,NSError * _Nullable error))handler;

/// 设置白板书写权限
/// @param disable disable description
- (void)disableDeviceInputs:(BOOL)disable;

/// 设置白板工具
/// @param name name description
- (void)setWhiteBoardToolsName:(NSString *)name;

/// 设置画笔颜色
/// @param strokeColor strokeColor description
- (void)setWhiteBoardStrokeColor:(NSArray<NSNumber *>*)strokeColor;

/// 选择白板场景
/// @param index index description
/// @param completionHandler completionHandler description
- (void)setSceneIndex:(NSUInteger)index completionHandler:(void (^ _Nullable)(BOOL success, NSError * _Nullable error))completionHandler;

/// 销毁白板
- (void)destroyWhiteBoard;

@end

NS_ASSUME_NONNULL_END
