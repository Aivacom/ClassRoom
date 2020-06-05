//
//  SYOperation.m
//  BarrierTest
//
//  Created by GasparChu on 2020/4/9.
//  Copyright © 2020 GasparChu. All rights reserved.
//

#import "SYOperation.h"

@interface SYOperation ()

@property (nonatomic, assign, getter=isExecuting) BOOL executing;
@property (nonatomic, assign, getter=isFinished) BOOL finished;
@property (nonatomic, copy) dispatch_block_t block;


@end

@implementation SYOperation

@synthesize executing = _executing;
@synthesize finished = _finished;

- (void)addOperationBlock:(dispatch_block_t)block
{
    _block = block;
}

- (void)operationFinished
{
    self.executing = NO;
    self.finished = YES;
}

- (void)start
{
    self.executing = YES;
    if (self.isCancelled) {
        self.executing = NO;
        self.finished = YES;
        return;
    }
    
    !self.block?:self.block();
}

- (void)setExecuting:(BOOL)executing
{
    [self willChangeValueForKey:@"isExecuting"];
    _executing = executing;
    [self didChangeValueForKey:@"isExecuting"];
}

- (void)setFinished:(BOOL)finished
{
    [self willChangeValueForKey:@"isFinished"];
    _finished = finished;
    [self didChangeValueForKey:@"isFinished"];
}


@end
