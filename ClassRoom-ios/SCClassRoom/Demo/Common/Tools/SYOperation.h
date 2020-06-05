//
//  SYOperation.h
//  BarrierTest
//
//  Created by GasparChu on 2020/4/9.
//  Copyright © 2020 GasparChu. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface SYOperation : NSOperation

- (void)addOperationBlock:(dispatch_block_t)block;
- (void)operationFinished;

@end

NS_ASSUME_NONNULL_END
