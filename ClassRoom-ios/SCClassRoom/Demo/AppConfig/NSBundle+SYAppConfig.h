//
//  NSBundle+SYAppConfig.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/31.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSBundle (SYAppConfig)

/// 获取 appid
+ (NSString *)sy_getAppId;

/// 获取 sdk token
+ (NSString *)sy_getSDKToken;

/// 获取白板请求 url
+ (NSString *)sy_getWhiteRequestUrl;

/// 获取白板 token
+ (NSString *)sy_getWhiteToken;

@end

NS_ASSUME_NONNULL_END
