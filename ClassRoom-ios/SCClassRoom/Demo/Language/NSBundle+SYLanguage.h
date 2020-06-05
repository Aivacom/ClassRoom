//
//  NSBundle+SYLanguage.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSBundle (SYLanguage)

/// 获取本地字符
/// @param key 字符 key
+ (NSString *)yy_localizedStringWithKey:(NSString *)key;

/// 切换至汉字
+ (void)yy_switchLanguageToHans;

/// 切换至英文
+ (void)yy_switchLanguageToEn;

@end

NS_ASSUME_NONNULL_END
