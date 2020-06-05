//
//  SYRequestManager.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/18.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYRequestManager.h"
#import <AFNetworking.h>

@interface SYRequestManager()

@property (nonatomic, strong) AFHTTPSessionManager *manager;

@end

@implementation SYRequestManager

+ (instancetype)sharedmanager
{
    static SYRequestManager *requestManager;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        requestManager = [SYRequestManager new];
    });
    return requestManager;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _manager = [AFHTTPSessionManager manager];
        _manager.requestSerializer = [AFJSONRequestSerializer serializer];
        _manager.responseSerializer.acceptableContentTypes = [NSSet setWithArray:@[@"application/json", @"text/json", @"text/html"]];
        [_manager.requestSerializer setTimeoutInterval:20.0];
    }
    return self;
}

- (void)post:(NSString *)url params:(NSDictionary *)params complete:(requestCompleteHandler)complete
{
    [self.manager POST:url parameters:params progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        !complete?:complete(nil, responseObject, task);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        !complete?:complete(error, nil, task);
    }];
}

- (void)get:(NSString *)url params:(NSDictionary *)params complete:(requestCompleteHandler)complete
{
    [self.manager GET:url parameters:params progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        !complete?:complete(nil, responseObject, task);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        !complete?:complete(error, nil, task);
    }];
}

@end
