//
//  SYBigStatusView.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, SYNetworkQuality) {
    SYNetworkQualityUnknown = 1,    // 未知
    SYNetworkQualityVeryBad = 2,    // 很差
    SYNetworkQualityGenral = 3,     // 一般
    SYNetworkQualityGood = 4,       // 好
};


NS_ASSUME_NONNULL_BEGIN

@protocol SYBigStatusViewDelegate <NSObject>

/// 点击关闭房间
- (void)clickCloseBtn;

/// 点击反馈（课堂评价）
- (void)clickFeedbackBtn;

@end

/// 大班课顶部状态 UI
@interface SYBigStatusView : UIView

@property (nonatomic, weak) id<SYBigStatusViewDelegate> delegate;

/// 设置房间信息
/// @param classRoomName 课堂名称
/// @param nickname 学生昵称
- (void)setClassRoomName:(NSString *)classRoomName nickname:(NSString *)nickname;

/// 显示/隐藏 view
- (void)showOrHiddenStatusView;

/// 取消隐藏
- (void)cancelHiddenStatusView;

/// 设置网络质量图片
/// @param quality quality description
- (void)setNetworkQuality:(SYNetworkQuality)quality;

@end

NS_ASSUME_NONNULL_END
