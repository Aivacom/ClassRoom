//
//  UIColor+Tools.h
//  SCClassRoom
//
//  Created by Huan on 2020/3/12.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIColor (Tools)

+ (UIColor *)yy_red:(NSInteger)red green:(NSInteger)green blue:(NSInteger)blue alpha:(CGFloat)alpha;
+ (NSArray *)yy_convertColorToRGB:(UIColor *)color;
+ (UIColor *)yy_colorWithHex:(NSInteger)hex;
+ (UIColor *)yy_colorWithHexString:(NSString *)hexString;
+ (UIColor *)yy_colorWithHexString:(NSString *)hexString alpha:(CGFloat)alpha;

@end

NS_ASSUME_NONNULL_END
