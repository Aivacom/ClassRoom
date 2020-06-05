//
//  MBProgressHUD+SYHUD.h
//  SYLiteDevToolKit
//
//  Created by iPhuan on 2019/8/26.
//


#import "MBProgressHUD.h"

@interface MBProgressHUD (SYHUD)

// 显示toast提示
+ (void)jly_showToast:(NSString *)message;

+ (void)jly_showToast:(NSString *)message duration:(NSTimeInterval)duration;

// margin设置边距
+ (void)jly_showToast:(NSString *)message margin:(CGFloat)margin duration:(NSTimeInterval)duration;

// 显示loading
+ (void)jly_showActivityIndicator;

// 显示带”加载中...“的loading
+ (void)jly_showLoadingActivityIndicator;

// 显示指定提示语的loading
+ (void)jly_showActivityIndicatorWithMessage:(NSString *)message;


+ (void)jly_hideActivityIndicator;

@end
