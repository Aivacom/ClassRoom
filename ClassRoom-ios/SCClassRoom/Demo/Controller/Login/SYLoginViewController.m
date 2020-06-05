//
//  SYLoginViewController.m
//  SCClassRoom
//
//  Created by Huan on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYLoginViewController.h"
#import "SYLoginView.h"
#import "SYBCViewController.h"
#import "SYUtils.h"
#import "SYFeedbackController.h"
#import "MBProgressHUD+SYHUD.h"
#import "NSBundle+SYLanguage.h"
#import "SYBCEducationManager.h"

@interface SYLoginViewController ()<SYLoginViewDelegate>

@property (nonatomic, strong) SYLoginView *loginView;
@property (nonatomic, copy) NSString *studentUid;

@end

@implementation SYLoginViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    [[AFNetworkReachabilityManager sharedManager] startMonitoring];
    _studentUid = [self getUid];
    [self setup];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES animated:animated];
}

- (void)setup {
    [self.view addSubview:self.loginView];
    [self.loginView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_offset(0.f);
    }];
}

#pragma mark - SYLoginViewDelegate
- (void)clickFeedbackBtn
{
    SYFeedbackController *vc = [SYFeedbackController new];
    vc.uid = self.studentUid;
    [self.navigationController pushViewController:vc animated:YES];
}

- (void)loginBtnClicked:(NSString *)className nickName:(NSString *)nickName classType:(NSString *)classType roleType:(NSString *)roleType {
    [MBProgressHUD jly_hideActivityIndicator];
    SYBCViewController *bcVC = [SYBCViewController new];
    bcVC.nickName = nickName;
    bcVC.roomId = className;
    bcVC.studentUid = self.studentUid;
    bcVC.modalPresentationStyle = UIModalPresentationFullScreen;
    [self presentViewController:bcVC animated:YES completion:nil];
}

#pragma mark - Getter & Setter
- (SYLoginView *)loginView
{
    if (!_loginView) {
        SYLoginView *view = [SYLoginView new];
        view.delegate = self;
        _loginView = view;
    }
    return _loginView;
}

/// 获取毫秒后8位
- (NSString *)getUid
{
    NSInteger time = [[NSDate date] timeIntervalSince1970] * 1000;
    NSInteger uid = time % (NSInteger)pow(10, 8);
    return [NSString stringWithFormat:@"%ld", (long)uid];
}

#pragma mark - Device Orientation
- (BOOL)shouldAutorotate
{
    return YES;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return UIInterfaceOrientationPortrait;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
