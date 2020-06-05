//
//  SYConsoleManager.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

#define Console_insert(format,...) [[SYConsoleManager sharedManager] insertOperateString:[NSString stringWithFormat:(format), ##__VA_ARGS__]]

/// 控制台监控操作流
@interface SYConsoleManager : NSObject

+ (instancetype)sharedManager;

/// 插入操作
/// @param string 操作字符串
- (void)insertOperateString:(NSString *)string;

/// 离开房间释放父视图
- (void)removeParentView;

/// 显示隐藏操作过程视图
/// @param parentView 父视图
- (void)showOrHiddenOperateView:(UIView *)parentView rightView:(UIView *)rightView;

/// 写入数据
/// @param path path description
- (void)writeToFile:(NSString *)path;


@end

NS_ASSUME_NONNULL_END
