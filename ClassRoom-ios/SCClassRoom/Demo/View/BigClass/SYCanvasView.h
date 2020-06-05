//
//  SYCanvasView.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// 大班课老师画布 UI
@interface SYCanvasView : UIView

//canvas
@property (nonatomic, strong, readonly) UIView *canvasView;
//默认图的显示状态
@property (nonatomic, assign, readonly) BOOL showNormalImage;

/// 设置名称
/// @param nickname 名称
- (void)setNickname:(NSString *)nickname;

/// 显示默认图
- (void)showNormalImg;

/// 隐藏默认图
- (void)hiddenNormalImg;

/// 简洁模式（隐藏默认图和名称）
- (void)conciseModelView;

/// 清除画布视图（兼容 SDK）
- (void)removeSubviewOfCanvas;

@end

NS_ASSUME_NONNULL_END
