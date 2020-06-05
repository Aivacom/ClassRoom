//
//  SYMessageModel.h
//  SCClassRoom
//
//  Created by Huan on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SYMessageJsonModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface SYMessageModel : NSObject

@property (nonatomic, copy) NSString *key;
@property (nonatomic, copy) NSString *value;
@property (nonatomic, strong) SYMessageJsonModel *jsonValue;

@end

NS_ASSUME_NONNULL_END
