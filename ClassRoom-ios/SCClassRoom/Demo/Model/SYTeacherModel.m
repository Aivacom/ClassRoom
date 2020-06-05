//
//  SYTeacherModel.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/4/29.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYTeacherModel.h"

@implementation SYTeacherModel

- (instancetype)init
{
    self= [super init];
    if (self) {
        [self resetState];
    }
    return self;
}

- (void)resetState
{
    self.nickname = @"";
    self.uid = @"";
    self.video = kVideoClose;
    self.audio = kAudioClose;
    self.role = kRoleAnchor;
    self.public_message = @"";
    self.class_mute = kOpenClassMute;
    self.open_hand = kCloseHand;
    self.board_state = @"";
    self.board_uuid = @"";
    self.class_state = kClassStateEnd;
}

@end
