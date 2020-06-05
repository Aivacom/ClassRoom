//
//  SYMessageJsonModel.h
//  SCClassRoom
//
//  Created by Huan on 2020/3/10.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SYMessageJsonModel : NSObject
/*
 public_message：公告内容
 class_mute：全员禁言状态
 open_hand：课堂举手状态
 boare_state：白板开启状态
 board_uuid：白板uuid
 */
@property (nonatomic, copy) NSString * public_message;
@property (nonatomic, copy) NSString * class_mute;
@property (nonatomic, copy) NSString * open_hand;
@property (nonatomic, copy) NSString * board_state;
@property (nonatomic, copy) NSString * board_uuid;
@property (nonatomic, copy) NSString * msg_content;
@property (nonatomic, copy) NSString * msg_time;
@property (nonatomic, copy) NSString * msg_nickname;

@end

NS_ASSUME_NONNULL_END
