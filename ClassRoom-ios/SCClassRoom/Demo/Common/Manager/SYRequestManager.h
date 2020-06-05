//
//  SYRequestManager.h
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/18.
//  Copyright © 2020 SY. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^requestCompleteHandler)(NSError * _Nullable error, id _Nullable result, NSURLSessionTask *task);

@interface SYRequestManager : NSObject

+ (instancetype)sharedmanager;

- (void)post:(NSString *)url
      params:(NSDictionary *_Nullable)params
    complete:(requestCompleteHandler)complete;

- (void)get:(NSString *)url
      params:(NSDictionary *_Nullable)params
    complete:(requestCompleteHandler)complete;

@end

NS_ASSUME_NONNULL_END
