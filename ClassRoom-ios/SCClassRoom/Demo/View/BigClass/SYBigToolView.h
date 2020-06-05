//
//  SYBigToolView.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, SYHandleBtnStatus) {
    SYHandleBtnStatusNormal = 0,        // 初始状态
    SYHandleBtnStatusHandleSuc = 1,     // 举手成功
    SYHandleBtnStatusDisable = 2,       // 不可用（连麦中）
    SYHandleBtnStatusShow = 3,          // 显示按钮
    SYHandleBtnStatusHidden = 4         // 隐藏按钮
};


NS_ASSUME_NONNULL_BEGIN

@protocol SYBigToolViewDelegate <NSObject>

/// 点击控制台
- (void)clickConsoleBtn;

/// 点击举手
/// @param isHandle 是否举手 yes:举手 no:取消举手
- (void)clickHandleBtn:(BOOL)isHandle;

@end

/// 大班课工具栏 UI
@interface SYBigToolView : UIView

@property (nonatomic, weak) id<SYBigToolViewDelegate> delegate;

/// 设置举手按钮状态
/// @param status SYHandleBtnStatus
- (void)setHandleBtnStatus:(SYHandleBtnStatus)status;

@end

NS_ASSUME_NONNULL_END
