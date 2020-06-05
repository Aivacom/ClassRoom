//
//  SYTeacherModel.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/4/29.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SYTeacherModel : NSObject

@property (nonatomic, copy) NSString *nickname;
@property (nonatomic, copy) NSString *uid;
@property (nonatomic, copy) NSString *video;    // 视频是否开启
@property (nonatomic, copy) NSString *audio;    // 音频是否开启
@property (nonatomic, copy) NSString *role;     // 角色（1主播，2观众）
@property (nonatomic, copy) NSString *public_message;   // 公告内容
@property (nonatomic, copy) NSString *class_mute;       // 全员禁言状态
@property (nonatomic, copy) NSString *open_hand;        // 课堂举手状态
@property (nonatomic, copy) NSString *board_state;      // 白板开启状态
@property (nonatomic, copy) NSString *board_uuid;       // 白板 uuid
@property (nonatomic, copy) NSString *class_state;      // 上课状态

/// 重置状态
- (void)resetState;

@end

NS_ASSUME_NONNULL_END
