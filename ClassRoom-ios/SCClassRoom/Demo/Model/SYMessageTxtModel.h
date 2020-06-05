//
//  SYMessageTxtModel.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/9.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SYMessageTxtModel : NSObject

@property (nonatomic, copy) NSString *sendUserId;
@property (nonatomic, copy) NSString *message;
@property (nonatomic, copy) NSString *nickname;
@property (nonatomic, copy) NSString *sendTime;

@end

NS_ASSUME_NONNULL_END
