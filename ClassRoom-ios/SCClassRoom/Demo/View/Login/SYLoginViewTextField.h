//
//  SYLoginViewTextField.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// 登录页
@interface SYLoginViewTextField : UITextField

@property (nonatomic, assign) BOOL isAllowStartWithZero;    // 开头是0是否允许（默认 YES）
@property (nonatomic, copy) NSString *zeroToastString;      // 不允许的提示语


@end

NS_ASSUME_NONNULL_END
