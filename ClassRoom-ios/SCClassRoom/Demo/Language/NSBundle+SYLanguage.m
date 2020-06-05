//
//  NSBundle+SYLanguage.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "NSBundle+SYLanguage.h"

static NSString *const SYLanguageKey = @"SYLanguageKey";

@implementation NSBundle (SYLanguage)

+ (NSString *)yy_localizedStringWithKey:(NSString *)key
{
    NSString *sysLanguageCode = [[[NSUserDefaults standardUserDefaults] objectForKey:@"AppleLanguages"] firstObject];
    NSString *localLanguageCode = [[NSUserDefaults standardUserDefaults] objectForKey:SYLanguageKey];
    NSString *currentLanguageCode = localLanguageCode.length ? localLanguageCode : sysLanguageCode;
    
    NSBundle *currentBundle = nil;
    if ([currentLanguageCode containsString:@"en"]) {
        currentLanguageCode = @"en";
        currentBundle = [NSBundle bundleWithPath:[[NSBundle mainBundle] pathForResource:currentLanguageCode ofType:@"lproj"]];
    } else {
        currentLanguageCode = @"zh-Hans";
        currentBundle = [NSBundle bundleWithPath:[[NSBundle mainBundle] pathForResource:currentLanguageCode ofType:@"lproj"]];
    }
    return currentBundle ? [currentBundle localizedStringForKey:key value:nil table:@"Localizable"] : key;
}

+ (void)yy_switchLanguageToHans
{
    [self switchLanguageCode:@"zh-Hans"];
}

+ (void)yy_switchLanguageToEn
{
    [self switchLanguageCode:@"en"];
}

+ (void)switchLanguageCode:(NSString *)code
{
    [[NSUserDefaults standardUserDefaults] setObject:code forKey:SYLanguageKey];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
