//
//  SYWhiteBoardManager.m
//  SCClassRoom
//
//  Created by Huan on 2020/3/11.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYWhiteBoardManager.h"

#define WeakSelf __weak __typeof__(self) weakSelf = self;

@interface SYWhiteBoardManager()<WhiteCommonCallbackDelegate,WhiteRoomCallbackDelegate>

@property (nonatomic, strong) WhiteSDK *whiteSDK;
@property (nonatomic, strong) WhiteRoom *whiteRoom;

@end

@implementation SYWhiteBoardManager

#pragma mark 初始化白板SDK
- (void)initWhiteSDKWithBoardView:(WhiteBoardView *)boardView config:(WhiteSdkConfiguration *)config
{
    _whiteSDK = [[WhiteSDK alloc] initWithWhiteBoardView:boardView config:config commonCallbackDelegate:self];
}

#pragma mark 进入白板房间
- (void)joinWhiteRoomWithConfig:(WhiteRoomConfig *)config completionHandler:(void (^)(WhiteRoom * _Nullable, NSError * _Nullable))handler
{
    WeakSelf
    [_whiteSDK joinRoomWithConfig:config callbacks:self completionHandler:^(BOOL success, WhiteRoom * _Nullable room, NSError * _Nullable error) {
        weakSelf.whiteRoom = room;
        handler(room,error);
    }];
}

#pragma mark 设置白板书写权限
- (void)disableDeviceInputs:(BOOL)disable
{
    [_whiteRoom disableDeviceInputs:disable];
}

#pragma mark 设置白板工具
- (void)setWhiteBoardToolsName:(NSString *)name
{
    WhiteMemberState *state = [[WhiteMemberState alloc] init];
    state.currentApplianceName = name;
    [_whiteRoom setMemberState:state];
}

#pragma mark 设置画笔颜色
- (void)setWhiteBoardStrokeColor:(NSArray<NSNumber *> *)strokeColor
{
    WhiteMemberState *state = [[WhiteMemberState alloc] init];
    state.strokeColor = strokeColor;
    [_whiteRoom setMemberState:state];
}

#pragma mark 选择白板场景
- (void)setSceneIndex:(NSUInteger)index completionHandler:(void (^)(BOOL, NSError * _Nullable))completionHandler
{
    [self.whiteRoom setSceneIndex:index completionHandler:completionHandler];
}

#pragma mark 销毁白板
- (void)destroyWhiteBoard
{
    if (self.whiteRoom != nil) {
        [self.whiteRoom disconnect:^{
            
        }];
    }
    self.whiteRoom = nil;
    self.whiteSDK = nil;
}

@end
