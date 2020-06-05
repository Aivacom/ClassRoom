//
//  SYStudentModel.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/4/29.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SYStudentModel : NSObject<NSCopying>

@property (nonatomic, copy) NSString *nickname;
@property (nonatomic, copy) NSString *uid;
@property (nonatomic, copy) NSString *video;    // 视频是否开启
@property (nonatomic, copy) NSString *audio;    // 音频是否开启
@property (nonatomic, copy) NSString *chat;     // 聊天是否开启
@property (nonatomic, copy) NSString *role;     // 角色（1主播，2观众）
@property (nonatomic, copy) NSString *networkQuality; // 网络质量
@property (nonatomic, copy) NSString *hand;     // 是否举手


@end

NS_ASSUME_NONNULL_END
