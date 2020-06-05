//
//  SYLoginView.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol SYLoginViewDelegate <NSObject>

- (void)clickFeedbackBtn;

- (void)loginBtnClicked:(NSString *)className nickName:(NSString *)nickName classType:(NSString *)classType roleType:(NSString *)roleType;

@end

/// 登录 UI
@interface SYLoginView : UIView

@property (nonatomic, weak  ) id<SYLoginViewDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
