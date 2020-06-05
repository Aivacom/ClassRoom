//
//  SYMessageView.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol SYMessageViewDelegate <NSObject>

/// 开始编辑
- (void)chatBeiginEditing;

@end

@class SYMessageTxtModel;
@interface SYMessageView : UIView

@property (nonatomic, weak) id<SYMessageViewDelegate> delegate;

/// 设置自己的 id 和老师的 id
/// @param userId userId description
/// @param teacherId teacherId description
- (void)setUserId:(NSString *)userId teacherId:(NSString *)teacherId;

/// 设置聊天按钮状态
/// @param isEnable 是否可用
- (void)setChatbtnStatus:(BOOL)isEnable;

/// 收到广播消息
/// @param model 文本消息模型
- (void)didReceiveMessage:(SYMessageTxtModel *)model;

@end

NS_ASSUME_NONNULL_END
