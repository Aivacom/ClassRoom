//
//  SYUtils.h
//  SYLiteDevToolKit
//
//  Created by iPhuan on 2019/8/6.
//  Copyright © 2019 SY. All rights reserved.
//


#import <Foundation/Foundation.h>

@class SYVideoCanvas;

@interface SYUtils : NSObject

+ (NSString *)appVersion;

+ (NSString *)appBuildVersion;

+ (NSDictionary *)dicFromJsonString:(NSString *)json;

#pragma mark - Network info

// 获取网络类型，需要在使用之前调用[[AFNetworkReachabilityManager sharedManager] startMonitoring];
+ (NSString *)networkTypeSting;

+ (NSString *)carrierName;

+ (float)cpuUsage;
+ (NSString *)memoryUsage;

@end
