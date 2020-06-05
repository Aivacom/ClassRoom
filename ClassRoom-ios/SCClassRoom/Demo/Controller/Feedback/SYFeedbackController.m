//
//  SYFeedbackController.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/17.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYFeedbackController.h"
#import "NSBundle+SYLanguage.h"
#import "NSBundle+SYAppConfig.h"
#import "SYUtils.h"
#import "MBProgressHUD+SYHUD.h"
#import <AFNetworking.h>
#import "SSZipArchive.h"
#import "SYConsoleManager.h"

@interface SYFeedbackController ()<UITextViewDelegate>

@property (nonatomic, strong) UILabel *versionLbl;
@property (nonatomic, strong) UITextView *textView;
@property (nonatomic, strong) UILabel *textViewPlaceholderLbl;
@property (nonatomic, strong) UITextField *textField;
@property (nonatomic, strong) UIButton *submitBtn;
@property (nonatomic, strong) CAShapeLayer *cornerRadiusLayer;
@property (nonatomic, strong) CAShapeLayer *cornerRadiusLayer1;

// feedback service params
@property (nonatomic, copy) NSString *appId;        // 反馈的 appId
@property (nonatomic, copy) NSString *marketChannel;  // 市场渠道，默认值Demo
@property (nonatomic, copy) NSString *sceneName;    // 场景名称
@property (nonatomic, copy) NSString *logFilePath;  // 日志路径
@property (nonatomic, copy) NSString *feedbackUrl;  // 上传 url


@end

@implementation SYFeedbackController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [self setup];
    [self setupNotification];
    [self setupFeedback];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:animated];
}

- (void)setup
{
    self.edgesForExtendedLayout = UIRectEdgeNone;
    [self.navigationController.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
    [self.navigationController.navigationBar setShadowImage:[UIImage new]];
    self.view.backgroundColor = [UIColor whiteColor];
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"nav_btn_back"] style:UIBarButtonItemStylePlain target:self action:@selector(backBtnClicked:)];
    
    self.navigationItem.title = [NSBundle yy_localizedStringWithKey:@"课堂评价"];
    self.versionLbl.text = [NSString stringWithFormat:@"  %@V%@-ClassRoom-%@", [NSBundle yy_localizedStringWithKey:@"当前版本"], [SYUtils appVersion], [SYUtils appBuildVersion]];
    
    [self.view addSubview:self.versionLbl];
    [self.view addSubview:self.textView];
    [self.view addSubview:self.textViewPlaceholderLbl];
    [self.view addSubview:self.textField];
    [self.view addSubview:self.submitBtn];
    
    [self.versionLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_offset(20.f);
        make.top.mas_offset(20.f);
        make.right.mas_offset(-20.f);
        make.height.mas_offset(36.f);
    }];
    [self.textView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(self.versionLbl);
        make.top.mas_equalTo(self.versionLbl.mas_bottom);
        make.height.mas_offset(260.f);
    }];
    [self.textViewPlaceholderLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.mas_equalTo(self.textView).mas_offset(5.f);
        make.right.mas_equalTo(self.textView).mas_offset(-5.f);
    }];
    [self.textField mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(self.versionLbl);
        make.top.mas_equalTo(self.textView.mas_bottom).mas_offset(10.f);
        make.height.mas_offset(40.f);
    }];
    [self.submitBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(self.versionLbl);
        make.top.mas_equalTo(self.textField.mas_bottom).mas_offset(10.f);
        make.height.mas_offset(40.f);
    }];
    
    [self setupCornerRadius];
}

- (void)setupCornerRadius
{
    [self.view layoutIfNeeded];
    [self.cornerRadiusLayer removeFromSuperlayer];
    [self.cornerRadiusLayer1 removeFromSuperlayer];
    
    // 做个延时，要不 frame 是错的
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        UIBezierPath *cornerRadiusPath = [UIBezierPath bezierPathWithRoundedRect:self.versionLbl.bounds byRoundingCorners:UIRectCornerTopRight | UIRectCornerTopLeft cornerRadii:CGSizeMake(4, 4)];
        self.cornerRadiusLayer = [CAShapeLayer new];
        self.cornerRadiusLayer.frame = self.versionLbl.bounds;
        self.cornerRadiusLayer.path = cornerRadiusPath.CGPath;
        self.versionLbl.layer.mask = self.cornerRadiusLayer;
        
        UIBezierPath *cornerRadiusPath1 = [UIBezierPath bezierPathWithRoundedRect:self.textView.bounds byRoundingCorners:UIRectCornerBottomRight | UIRectCornerBottomLeft cornerRadii:CGSizeMake(10, 10)];
        self.cornerRadiusLayer1 = [CAShapeLayer new];
        self.cornerRadiusLayer1.lineWidth = 0.5f;
        self.cornerRadiusLayer1.strokeColor = [UIColor colorWithRed:230/255.0 green:230/255.0 blue:230/255.0 alpha:1.0].CGColor;
        self.cornerRadiusLayer1.fillColor = [UIColor whiteColor].CGColor;
        self.cornerRadiusLayer1.frame = self.textView.bounds;
        self.cornerRadiusLayer1.path = cornerRadiusPath1.CGPath;
        [self.textView.layer insertSublayer:self.cornerRadiusLayer1 atIndex:0];
    });
}

- (void)setupNotification
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(deviceChanged:) name:UIApplicationDidChangeStatusBarOrientationNotification  object:nil];
}

- (void)setupFeedback
{
    self.appId = @"";
    self.sceneName = @"";
    self.marketChannel = @"";
    self.logFilePath = kLogFilePath;
    self.feedbackUrl = @"";
}

#pragma mark - Event
- (void)backBtnClicked:(UIBarButtonItem *)sender
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    if (self.presentingViewController) {
        [self dismissViewControllerAnimated:YES completion:nil];
    } else {
        [self.navigationController popViewControllerAnimated:YES];
    }
}

- (void)deviceChanged:(NSNotification *)sender
{
    UIInterfaceOrientation orientation = [[UIApplication sharedApplication] statusBarOrientation];
    if (orientation == UIInterfaceOrientationLandscapeLeft || orientation == UIInterfaceOrientationLandscapeRight) {
        [self.versionLbl mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.mas_offset(10.f);
            if (@available(iOS 11.0, *)) {
                make.left.mas_equalTo(self.view.mas_safeAreaLayoutGuideLeft).mas_offset(20.f);
            } else {
                make.left.mas_offset(20.f);
            }
            if (@available(iOS 11.0, *)) {
                make.right.mas_equalTo(self.view.mas_safeAreaLayoutGuideRight).mas_offset(-20.f);
            } else {
                make.right.mas_offset(-20.f);
            }
            make.height.mas_offset(36.f);
        }];
        [self.textView mas_updateConstraints:^(MASConstraintMaker *make) {
            make.height.mas_offset(101.f);
        }];
    }
    if (orientation == UIInterfaceOrientationPortrait) {
        [self.versionLbl mas_remakeConstraints:^(MASConstraintMaker *make) {
            make.top.mas_offset(20.f);
            make.left.mas_offset(20.f);
            make.right.mas_offset(-20.f);
            make.height.mas_offset(36.f);
        }];
        [self.textView mas_updateConstraints:^(MASConstraintMaker *make) {
            make.height.mas_offset(260.f);
        }];
    }
    
    [self setupCornerRadius];
}

- (void)submitBtnClicked:(UIButton *)sender
{
    if (!self.feedbackUrl.length) {
        [self backBtnClicked:nil];
        return;
    }
    if (!self.appId.length || !self.uid.length) {
        [MBProgressHUD jly_showToast:@"please input appid or uid"];
        return;
    }
    if (self.textView.text.length == 0 || [[self.textView.text  stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]]length] == 0) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"请输入反馈内容（不可留空）"]];
        return;
    }
    
    [self submitRequest];
}

- (void)submitRequest
{
    [MBProgressHUD jly_showActivityIndicator];
    
    // 压缩日志文件
    NSString *zipPath = [self compressionLogFileData];
    if (!zipPath.length) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"意见反馈提交失败"]];
        return;
    }
    
    // 初始化上传数据
    NSString *postData = [self getPostData];
    
    // 上传日志文件
    [[AFHTTPSessionManager manager] POST:self.feedbackUrl parameters:nil  constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
        [formData appendPartWithFormData:[postData dataUsingEncoding:NSUTF8StringEncoding] name:@"nyy"];
        if (zipPath) {
            NSData *zipData = [NSData dataWithContentsOfFile:zipPath];
            if (zipData == nil || zipData.length == 0) {
                return;
            }
            [formData appendPartWithFileData:zipData
                                        name:@"file"
                                    fileName:@"sylog.zip"
                                    mimeType:@"multipart/form-data"];
            
            if ([[NSFileManager defaultManager] fileExistsAtPath:zipPath isDirectory:nil]) {
                [[NSFileManager defaultManager] removeItemAtPath:zipPath error:nil];
            }
        }
    } progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSInteger statusCode = ((NSHTTPURLResponse *)task.response).statusCode;
        if (statusCode == 204 || statusCode == 206) {
            [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"意见反馈提交成功"]];
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [self backBtnClicked:nil];
            });
        } else {
            [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"意见反馈提交失败"]];
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"意见反馈提交失败"]];
    }];
}

// 压缩日志
- (NSString *)compressionLogFileData
{
    NSString *logFile = self.logFilePath;
    [[SYConsoleManager sharedManager] writeToFile:logFile];
    NSString *zipPath = [NSTemporaryDirectory() stringByAppendingPathComponent:@"feedback.zip"];
    if ([[NSFileManager defaultManager] fileExistsAtPath:zipPath]) {
        [[NSFileManager defaultManager] removeItemAtPath:zipPath error:nil];
    }
    BOOL isSuccess = NO;
    if ([[NSFileManager defaultManager] fileExistsAtPath:logFile]) {
        if ([self isDirectory:logFile]) {
            isSuccess = [SSZipArchive createZipFileAtPath:zipPath withContentsOfDirectory:logFile];
        } else {
            NSArray *files = @[logFile];
            isSuccess = [SSZipArchive createZipFileAtPath:zipPath withFilesAtPaths:files];
        }
    }
    return isSuccess ? zipPath : @"";
}

// 初始化上传数据
- (NSString *)getPostData
{
    NSString *uploadContent = self.textView.text;
    if (uploadContent.length == 0) {
        uploadContent = self.uid;
    }
    
    NSString *networkState = [SYUtils networkTypeSting];
    NSString *marketChannel = self.marketChannel;
    NSString *serviceProvider = [SYUtils carrierName];
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *appVersion = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    NSString *guid = @"123456";
    NSString *systemVersion = [UIDevice currentDevice].systemVersion;
    NSString *reportType = @"UFB";
    NSString *deviceName = [[UIDevice currentDevice] systemName];
    NSString *contact = @"";
    
    NSDictionary *dataDict = @{
                               @"feedback" : uploadContent,
                               @"uid" : self.uid,
                               @"networkState" : networkState,
                               @"marketChannel" : marketChannel,
                               @"serviceProvider" : serviceProvider,
                               @"productVer" : appVersion,
                               @"guid" : guid,
                               @"osVer" : systemVersion,
                               @"reportType" : reportType,
                               @"phoneType" : deviceName,
                               @"contactInfo" : contact
                               };
    NSString *postData = [NSString stringWithFormat:@"{\"appId\":\"%@\",\"sign\":\"\",\"data\":%@}", self.appId, [self jsonStringFromObject:dataDict]];
    return postData;
}

- (BOOL)isDirectory:(NSString *)filePath {
    BOOL isDirectory = NO;
    [[NSFileManager defaultManager] fileExistsAtPath:filePath isDirectory:&isDirectory];
    return isDirectory;
}

- (NSString *)jsonStringFromObject:(id)object {
    NSString *jsonString = nil;
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:object
                                                       options:NSJSONWritingPrettyPrinted
                                                         error:&error];
    if (!jsonData) {
        NSLog(@"object to json faile, object: %@, error: %@", object, error.localizedDescription);
    } else {
        jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    return jsonString;
}

#pragma mark - UITextViewDelegate
- (void)textViewDidBeginEditing:(UITextView *)textView
{
    self.textViewPlaceholderLbl.hidden = YES;
}

- (void)textViewDidEndEditing:(UITextView *)textView
{
    if (!textView.text.length) {
        self.textViewPlaceholderLbl.hidden = NO;
    }
}

#pragma mark - Getter & Setter
- (UILabel *)versionLbl
{
    if (!_versionLbl) {
        UILabel *label = [UILabel new];
        label.backgroundColor = [UIColor colorWithRed:235/255.0 green:248/255.0 blue:246/255.0 alpha:1.0];
        label.textColor = [UIColor colorWithRed:72/255.0 green:130/255.0 blue:122/255.0 alpha:1.0];
        label.font = [UIFont boldSystemFontOfSize:13.f];
        _versionLbl = label;
    }
    return _versionLbl;
}

- (UITextView *)textView
{
    if (!_textView) {
        UITextView *view = [UITextView new];
        view.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
        view.font = [UIFont systemFontOfSize:15.f];
        view.delegate = self;
        _textView = view;
    }
    return _textView;
}

- (UILabel *)textViewPlaceholderLbl
{
    if (!_textViewPlaceholderLbl) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor colorWithRed:187/255.0 green:187/255.0 blue:187/255.0 alpha:1.0];
        label.font = [UIFont systemFontOfSize:15.f];
        label.numberOfLines = 0;
        label.text = [NSBundle yy_localizedStringWithKey:@"请输入反馈内容（不可留空）"];
        _textViewPlaceholderLbl = label;
    }
    return _textViewPlaceholderLbl;
}

- (UITextField *)textField
{
    if (!_textField) {
        UITextField *field = [UITextField new];
        field.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
        field.font = [UIFont systemFontOfSize:15.f];
        field.layer.cornerRadius = 4.f;
        field.layer.borderColor = [UIColor colorWithRed:230/255.0 green:230/255.0 blue:230/255.0 alpha:1.0].CGColor;
        field.layer.borderWidth = 0.5f;
        field.placeholder = [NSBundle yy_localizedStringWithKey:@"请输入您的手机号或电子邮箱（选填）"];
        _textField = field;
    }
    return _textField;
}

- (UIButton *)submitBtn
{
    if (!_submitBtn) {
        UIButton *btn = [UIButton new];
        [btn setTitle:[NSBundle yy_localizedStringWithKey:@"提交评价"] forState:UIControlStateNormal];
        btn.backgroundColor = [UIColor colorWithRed:22/255.0 green:212/255.0 blue:177/255.0 alpha:1.0];
        btn.layer.cornerRadius = 6.f;
        btn.layer.shadowColor = [UIColor colorWithRed:152/255.0 green:223/255.0 blue:209/255.0 alpha:0.42].CGColor;
        btn.layer.shadowOffset = CGSizeMake(0,5);
        btn.layer.shadowOpacity = 1;
        btn.layer.shadowRadius = 13;
        [btn addTarget:self action:@selector(submitBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _submitBtn = btn;
    }
    return _submitBtn;
}

#pragma mark - Device Orientation
- (BOOL)prefersStatusBarHidden
{
    return NO;
}

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
    return UIInterfaceOrientationMaskAll;
}

@end
