//
//  NSBundle+SYAppConfig.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/31.
//  Copyright © 2020 SY. All rights reserved.
//

#import "NSBundle+SYAppConfig.h"

@implementation NSBundle (SYAppConfig)

+ (NSString *)sy_getAppId
{
    NSString *configPath = [[NSBundle mainBundle] pathForResource:@"SYAppConfig" ofType:@"plist"];
    NSDictionary *configDic = [[NSDictionary alloc] initWithContentsOfFile:configPath];
    return configDic[@"app_id"];
}

+ (NSString *)sy_getSDKToken
{
    NSString *configPath = [[NSBundle mainBundle] pathForResource:@"SYAppConfig" ofType:@"plist"];
    NSDictionary *configDic = [[NSDictionary alloc] initWithContentsOfFile:configPath];
    return configDic[@"sdk_token"];
}

+ (NSString *)sy_getWhiteRequestUrl
{
    NSString *configPath = [[NSBundle mainBundle] pathForResource:@"SYAppConfig" ofType:@"plist"];
    NSDictionary *configDic = [[NSDictionary alloc] initWithContentsOfFile:configPath];
    return configDic[@"white_url"];
}

+ (NSString *)sy_getWhiteToken
{
    NSString *configPath = [[NSBundle mainBundle] pathForResource:@"SYAppConfig" ofType:@"plist"];
    NSDictionary *configDic = [[NSDictionary alloc] initWithContentsOfFile:configPath];
    return configDic[@"white_token"];
}

@end
