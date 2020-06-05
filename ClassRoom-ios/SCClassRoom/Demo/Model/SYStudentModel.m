//
//  SYStudentModel.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/4/29.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYStudentModel.h"
#import <YYModel.h>

@implementation SYStudentModel

- (instancetype)init
{
    self= [super init];
    if (self) {
        self.nickname = @"";
        self.uid = @"";
        self.video = kVideoClose;
        self.audio = kAudioClose;
        self.chat = kOpenMute;
        self.role = kRoleAudience;
        self.networkQuality = @"0";
        self.hand = kCancleHand;
    }
    return self;
}

- (id)copyWithZone:(NSZone *)zone
{
    return [self yy_modelCopy];
}

@end
