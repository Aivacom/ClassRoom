//
//  UITextField+SYAdditions.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/10.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UITextField (SYAdditions)

@property (nonatomic, assign) NSUInteger yy_maxLength; // 输入最大长度

/// 是否输入的是数字字符
/// @param string 输入的字符串
- (BOOL)yy_isInputNum:(NSString *)string;

@end

NS_ASSUME_NONNULL_END
