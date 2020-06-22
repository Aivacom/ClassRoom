//
//  SYLoginView.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYLoginView.h"
#import "NSBundle+SYLanguage.h"
#import "SYLoginViewTextField.h"
#import "UITextField+SYAdditions.h"
#import "SYLoginSwitchView.h"
#import "MBProgressHUD+SYHUD.h"
#import "SYUtils.h"
#import "SYBCEducationManager.h"

@interface SYLoginView ()

@property (nonatomic, strong) UIImageView *backImg;                 // 背景图
@property (nonatomic, strong) UIImageView *LogoImg;        //  logo
@property (nonatomic, strong) UIButton *feedbackBtn;                // 课堂评价 btn
@property (nonatomic, strong) UIButton *languageSwitchBtn;          // 语言切换 btn
@property (nonatomic, strong) UILabel *DescriptionLbl;     // 描述 lbl
@property (nonatomic, strong) UILabel *demoVersion;                 // demo 版本号
@property (nonatomic, strong) UILabel *buildDes;                    // 构建版本详情
@property (nonatomic, strong) UIImageView *peopleImg;               // 人物图片
@property (nonatomic, strong) UIView *centerBackView;               // 中间背景视图 view
@property (nonatomic, strong) UILabel *classRoomNameLbl;            // 课堂名称 label
@property (nonatomic, strong) SYLoginViewTextField *classRoomNameField; // 课堂名称 textField
@property (nonatomic, strong) UILabel *nickNameLbl;                 // 昵称 label
@property (nonatomic, strong) SYLoginViewTextField *nickNameField;      // 昵称 textField
@property (nonatomic, strong) UILabel *classRoomTypeLbl;            // 课堂类型 label
@property (nonatomic, strong) SYLoginSwitchView *classRoomSwitchView;     // 课堂类型切换
@property (nonatomic, strong) UILabel *roleTypeLbl;                 // 角色 label
@property (nonatomic, strong) SYLoginSwitchView *roleSwitchView;          // 角色切换
@property (nonatomic, strong) UIButton *loginBtn;                   // 登录 btn
@property (nonatomic, strong) UILabel *Url;                // 官网
@property (nonatomic, strong) UIImageView *bottomImg;               // 底部图片

@end

@implementation SYLoginView

- (instancetype)init
{
    if (self = [super init]) {
        [self setup];
    }
    return self;
}

- (void)setup
{
    [self addSubview:self.backImg];
    [self addSubview:self.LogoImg];
    [self addSubview:self.feedbackBtn];
    [self addSubview:self.languageSwitchBtn];
    [self addSubview:self.DescriptionLbl];
    [self addSubview:self.demoVersion];
    [self addSubview:self.buildDes];
    [self addSubview:self.peopleImg];
    [self addSubview:self.Url];
    [self addSubview:self.bottomImg];
    [self addSubview:self.centerBackView];
    
    [self.centerBackView addSubview:self.classRoomNameLbl];
    [self.centerBackView addSubview:self.classRoomNameField];
    [self.centerBackView addSubview:self.nickNameLbl];
    [self.centerBackView addSubview:self.nickNameField];
    [self.centerBackView addSubview:self.classRoomTypeLbl];
    [self.centerBackView addSubview:self.classRoomSwitchView];
    [self.centerBackView addSubview:self.roleTypeLbl];
    [self.centerBackView addSubview:self.roleSwitchView];
    [self.centerBackView addSubview:self.loginBtn];
    
    [self setupText];
    [self setupLayout];
}

- (void)setupLayout
{
    [self.backImg mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_offset(0.f);
    }];
    [self.LogoImg mas_makeConstraints:^(MASConstraintMaker *make) {
        if (@available(iOS 11.0, *)) {
            make.top.mas_equalTo(self.mas_safeAreaLayoutGuideTop).mas_offset(18.f);
        } else {
            make.top.mas_offset(38.f);
        }
        make.left.mas_offset(kLeftOrRightConstraints);
        make.width.mas_offset(132.f);
        make.height.mas_offset(24.f);
    }];
    [self.feedbackBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.mas_equalTo(self.languageSwitchBtn);
        make.right.mas_equalTo(self.languageSwitchBtn.mas_left).mas_offset(-kLeftOrRightConstraints);
        make.height.mas_offset(26.f);
    }];
    [self.languageSwitchBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.mas_equalTo(self.LogoImg);
        make.right.mas_offset(-kLeftOrRightConstraints);
        make.width.mas_offset(58.f);
        make.height.mas_offset(26.f);
    }];
    [self.DescriptionLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(self.LogoImg.mas_bottom).mas_offset(23.f);
        make.left.mas_offset(kLeftOrRightConstraints);
        make.height.mas_offset(28.f);
    }];
    [self.demoVersion mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.DescriptionLbl);
        make.top.mas_equalTo(self.DescriptionLbl.mas_bottom).mas_offset(2.f);
        // Beta 版临时放大到 height = 18，原 13
        make.height.mas_offset(18.f);
    }];
    [self.buildDes mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.demoVersion);
        make.top.mas_equalTo(self.demoVersion.mas_bottom).mas_offset(5.f);
        make.height.mas_offset(14.f);
    }];
    [self.peopleImg mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(self.languageSwitchBtn.mas_bottom).mas_offset(10.f);
        make.right.mas_offset(0.f);
        make.width.mas_offset(184.f);
        make.height.mas_offset(401.f);
    }];
    [self.centerBackView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(self.buildDes.mas_bottom).mas_offset(18.f);
        make.left.mas_offset(kLeftOrRightConstraints);
        make.right.mas_offset(-kLeftOrRightConstraints);
        make.bottom.mas_offset(-71.f);
    }];
    
    
    [self.classRoomNameLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_offset(23.f);
        make.top.mas_offset(20.f);
        make.height.mas_offset(16.f);
    }];
    [self.classRoomNameField mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.classRoomNameLbl);
        make.right.mas_offset(-22.f);
        make.top.mas_equalTo(self.classRoomNameLbl.mas_bottom).mas_offset(10.f);
        make.height.mas_offset(40.f);
    }];
    [self.nickNameLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.height.mas_equalTo(self.classRoomNameLbl);
        make.top.mas_equalTo(self.classRoomNameField.mas_bottom).mas_offset(15.f);
    }];
    [self.nickNameField mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.height.mas_equalTo(self.classRoomNameField);
        make.top.mas_equalTo(self.nickNameLbl.mas_bottom).mas_offset(10.f);
    }];
    [self.classRoomTypeLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.height.mas_equalTo(self.classRoomNameLbl);
        make.top.mas_equalTo(self.nickNameField.mas_bottom).mas_offset(15.f);
    }];
    [self.classRoomSwitchView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.height.mas_equalTo(self.classRoomNameField);
        make.top.mas_equalTo(self.classRoomTypeLbl.mas_bottom).mas_offset(10.f);
    }];
    [self.roleTypeLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.height.mas_equalTo(self.classRoomNameLbl);
        make.top.mas_equalTo(self.classRoomSwitchView.mas_bottom).mas_offset(15.f);
    }];
    [self.roleSwitchView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.height.mas_equalTo(self.classRoomNameField);
        make.top.mas_equalTo(self.roleTypeLbl.mas_bottom).mas_offset(10.f);
    }];
    [self.loginBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.height.mas_equalTo(self.classRoomNameField);
        make.top.mas_equalTo(self.roleSwitchView.mas_bottom).mas_offset(30.f);
    }];
    [self.Url mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.mas_offset(-51.f);
        make.centerX.mas_offset(0.f);
        make.height.mas_offset(17.f);
    }];
    [self.bottomImg mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.bottom.mas_offset(0.f);
        make.height.mas_offset(31.f);
    }];
}

- (void)setupText
{
    [self.feedbackBtn setTitle:[NSBundle yy_localizedStringWithKey:@"课堂评价"] forState:UIControlStateNormal];
    [self.languageSwitchBtn setTitle:[NSBundle yy_localizedStringWithKey:@"中英切换"] forState:UIControlStateNormal];
    self.DescriptionLbl.text = [NSBundle yy_localizedStringWithKey:@"云教育场景解决方案"];
    self.classRoomNameLbl.text = [NSBundle yy_localizedStringWithKey:@"课堂名称"];
    self.nickNameLbl.text = [NSBundle yy_localizedStringWithKey:@"昵称"];
    self.classRoomTypeLbl.text = [NSBundle yy_localizedStringWithKey:@"课堂类型"];
    self.roleTypeLbl.text = [NSBundle yy_localizedStringWithKey:@"角色"];
    self.classRoomNameField.placeholder = [NSBundle yy_localizedStringWithKey:@"请输入4-8位数字"];
    self.nickNameField.placeholder = [NSBundle yy_localizedStringWithKey:@"请输入4-8位数字"];
    self.classRoomSwitchView.typeName = [NSBundle yy_localizedStringWithKey:@"大班课"];
    self.roleSwitchView.typeName = [NSBundle yy_localizedStringWithKey:@"学生"];
    [self.loginBtn setTitle:[NSBundle yy_localizedStringWithKey:@"进入课堂"] forState:UIControlStateNormal];
    
}

#pragma mark - Event
- (void)feedbackBtnClicked:(UIButton *)sender
{
    if ([self.delegate respondsToSelector:@selector(clickFeedbackBtn)]) {
        [self.delegate clickFeedbackBtn];
    }
}

- (void)feedbackBtnAllEvents:(UIButton *)sender
{
    sender.highlighted = NO;
}

- (void)languageSwitchBtnClicked:(UIButton *)sender
{
    if ([sender.titleLabel.text isEqualToString:@"English"]) {
        [NSBundle yy_switchLanguageToEn];
    } else {
        [NSBundle yy_switchLanguageToHans];
    }
    
    [self setupText];
}

- (void)loginBtnClicked:(UIButton *)sender
{
    [self setNormalLoginBtnTheme:sender];
    if (self.classRoomNameField.text.length < 4) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"请输入课堂名称"]];
        return;
    }
    if (self.nickNameField.text.length < 4) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"请输入昵称"]];
        return;
    }
    AFNetworkReachabilityStatus netStatus = [AFNetworkReachabilityManager sharedManager].networkReachabilityStatus;
    if (AFNetworkReachabilityStatusUnknown == netStatus || AFNetworkReachabilityStatusNotReachable == netStatus) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"请连接网络"]];
        return;
    }
    if ([self.delegate respondsToSelector:@selector(loginBtnClicked:nickName:classType:roleType:)]) {
        [self.delegate loginBtnClicked:self.classRoomNameField.text nickName:self.nickNameField.text classType:@"1" roleType:@"1"];
    }
}

- (void)loginBtnTouchDown:(UIButton *)sender
{
    [self setTouchDownLoginBtnTheme:sender];
}

- (void)loginBtnTouchUpOutside:(UIButton *)sender
{
    [self setNormalLoginBtnTheme:sender];
}

- (void)setNormalLoginBtnTheme:(UIButton *)sender
{
    sender.backgroundColor = [UIColor colorWithRed:0/255.0 green:216/255.0 blue:175/255.0 alpha:1.0];
    sender.layer.shadowColor = [UIColor colorWithRed:129/255.0 green:225/255.0 blue:209/255.0 alpha:0.42].CGColor;
    sender.layer.shadowOffset = CGSizeMake(0,5);
    sender.layer.shadowOpacity = 1;
    sender.layer.shadowRadius = 13;
}

- (void)setTouchDownLoginBtnTheme:(UIButton *)sender
{
    sender.backgroundColor = [UIColor colorWithRed:58/255.0 green:200/255.0 blue:173/255.0 alpha:1.0];
    sender.layer.shadowColor = [UIColor colorWithRed:129/255.0 green:225/255.0 blue:209/255.0 alpha:0.42].CGColor;
    sender.layer.shadowOffset = CGSizeMake(0,5);
    sender.layer.shadowOpacity = 1;
    sender.layer.shadowRadius = 13;
}

#pragma mark - Getter & Setter
- (NSString *)getVersionString
{
    return [NSString stringWithFormat:@"V%@", [SYUtils appVersion]];
}

- (NSString *)getBuildDesString
{
    return [NSString stringWithFormat:@"build:%@，%@ %@", [SYUtils appBuildVersion], [self getCurrentTimeString], [SYBCEducationManager getSDKVersion]];
}

- (NSString *)getCurrentTimeString
{
    NSDate *date = [NSDate date];
    NSDateFormatter *formatter = [NSDateFormatter new];
    [formatter setDateFormat:@"MM/dd/YYYY"];
    return [formatter stringFromDate:date];
}

- (UIImageView *)backImg
{
    if (!_backImg) {
        UIImageView *img = [UIImageView new];
        img.contentMode = UIViewContentModeScaleAspectFill;
        img.image = [UIImage imageNamed:@"login_back"];
        _backImg = img;
    }
    return _backImg;
}

- (UIImageView *)LogoImg
{
    if (!_LogoImg) {
        UIImageView *img = [UIImageView new];
        img.contentMode = UIViewContentModeScaleAspectFit;
        img.image = [UIImage imageNamed:@"login_logo"];
        _LogoImg = img;
    }
    return _LogoImg;
}

- (UIButton *)feedbackBtn
{
    if (!_feedbackBtn) {
        UIButton *btn = [UIButton new];
        btn.titleLabel.font = [UIFont systemFontOfSize:12.f];
        [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        btn.backgroundColor = [UIColor colorWithRed:255/255.0 green:255/255.0 blue:255/255.0 alpha:0.17];
        btn.layer.cornerRadius = 4.f;
        [btn setImage:[UIImage imageNamed:@"login_feedback"] forState:UIControlStateNormal];
        [btn setImageEdgeInsets:(UIEdgeInsets){0.f, -2.f, 0.f, 2.f}];
        [btn setTitleEdgeInsets:(UIEdgeInsets){0.f, 2.f, 0.f, -2.f}];
        [btn setContentEdgeInsets:(UIEdgeInsets){0.f, 9.f, 0.f, 7.f}];
        [btn addTarget:self action:@selector(feedbackBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        [btn addTarget:self action:@selector(feedbackBtnAllEvents:) forControlEvents:UIControlEventAllEvents];
        _feedbackBtn = btn;
    }
    return _feedbackBtn;
}

- (UIButton *)languageSwitchBtn
{
    if (!_languageSwitchBtn) {
        UIButton *btn = [UIButton new];
        btn.titleLabel.font = [UIFont systemFontOfSize:12.f];
        [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        btn.backgroundColor = [UIColor colorWithRed:255/255.0 green:255/255.0 blue:255/255.0 alpha:0.17];
        btn.layer.cornerRadius = 4.f;
        [btn addTarget:self action:@selector(languageSwitchBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _languageSwitchBtn = btn;
    }
    return _languageSwitchBtn;
}

- (UILabel *)DescriptionLbl
{
    if (!_DescriptionLbl) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor whiteColor];
        label.font = [UIFont boldSystemFontOfSize:17.f];
        _DescriptionLbl = label;
    }
    return _DescriptionLbl;
}

- (UILabel *)demoVersion
{
    if (!_demoVersion) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor whiteColor];
        label.text = [self getVersionString];
        // Beta 版临时放大到 size = 17，原 11
        label.font = [UIFont fontWithName:@"DINCondensed-Bold" size:17.f];
        _demoVersion = label;
    }
    return _demoVersion;
}

- (UILabel *)buildDes
{
    if (!_buildDes) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor colorWithRed:1 green:1 blue:1 alpha:0.7];
        label.font = [UIFont fontWithName:@"DINCondensed-Bold" size:10.f];
        label.text = [self getBuildDesString];
        _buildDes = label;
    }
    return _buildDes;
}

- (UIImageView *)peopleImg
{
    if (!_peopleImg) {
        UIImageView *img = [UIImageView new];
        img.contentMode = UIViewContentModeScaleAspectFit;
        img.image = [UIImage imageNamed:@"login_people"];
        _peopleImg = img;
    }
    return _peopleImg;
}

- (UIView *)centerBackView
{
    if (!_centerBackView) {
        UIView *view = [UIView new];
        view.backgroundColor = [UIColor whiteColor];
        view.layer.cornerRadius = 12.f;
        _centerBackView = view;
    }
    return _centerBackView;
}

- (UILabel *)classRoomNameLbl
{
    if (!_classRoomNameLbl) {
        UILabel *label = [UILabel new];
        label.font = [UIFont boldSystemFontOfSize:14.f];
        label.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
        _classRoomNameLbl = label;
    }
    return _classRoomNameLbl;
}

- (SYLoginViewTextField *)classRoomNameField
{
    if (!_classRoomNameField) {
        SYLoginViewTextField *field = [SYLoginViewTextField new];
        field.yy_maxLength = 8;
        field.isAllowStartWithZero = NO;
        field.zeroToastString = @"课堂ID不要以0开头";
        field.keyboardType = UIKeyboardTypeNumberPad;
        _classRoomNameField = field;
    }
    return _classRoomNameField;
}

- (UILabel *)nickNameLbl
{
    if (!_nickNameLbl) {
        UILabel *label = [UILabel new];
        label.font = [UIFont boldSystemFontOfSize:14.f];
        label.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
        _nickNameLbl = label;
    }
    return _nickNameLbl;
}

- (SYLoginViewTextField *)nickNameField
{
    if (!_nickNameField) {
        SYLoginViewTextField *field = [SYLoginViewTextField new];
        field.yy_maxLength = 8;
        field.isAllowStartWithZero = NO;
        field.zeroToastString = @"昵称不要以0开头";
        field.keyboardType = UIKeyboardTypeNumberPad;
        _nickNameField = field;
    }
    return _nickNameField;
}

- (UILabel *)classRoomTypeLbl
{
    if (!_classRoomTypeLbl) {
        UILabel *label = [UILabel new];
        label.font = [UIFont boldSystemFontOfSize:14.f];
        label.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
        _classRoomTypeLbl = label;
    }
    return _classRoomTypeLbl;
}

- (SYLoginSwitchView *)classRoomSwitchView
{
    if (!_classRoomSwitchView) {
        SYLoginSwitchView *view = [SYLoginSwitchView new];
        _classRoomSwitchView = view;
    }
    return _classRoomSwitchView;
}

- (UILabel *)roleTypeLbl
{
    if (!_roleTypeLbl) {
        UILabel *label = [UILabel new];
        label.font = [UIFont boldSystemFontOfSize:14.f];
        label.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
        _roleTypeLbl = label;
    }
    return _roleTypeLbl;
}

- (SYLoginSwitchView *)roleSwitchView
{
    if (!_roleSwitchView) {
        SYLoginSwitchView *view = [SYLoginSwitchView new];
        _roleSwitchView = view;
    }
    return _roleSwitchView;
}

- (UIButton *)loginBtn
{
    if (!_loginBtn) {
        UIButton *btn = [UIButton new];
        [self setNormalLoginBtnTheme:btn];
        btn.layer.cornerRadius = 6.f;
        [btn addTarget:self action:@selector(loginBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        [btn addTarget:self action:@selector(loginBtnTouchDown:) forControlEvents:UIControlEventTouchDown];
        [btn addTarget:self action:@selector(loginBtnTouchUpOutside:) forControlEvents:UIControlEventTouchUpOutside];
        _loginBtn = btn;
    }
    return _loginBtn;
}

- (UILabel *)Url
{
    if (!_Url) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor colorWithRed:187/255.0 green:187/255.0 blue:187/255.0 alpha:1];
        label.font = [UIFont boldSystemFontOfSize:12.f];
        label.text = @"";
        _Url = label;
    }
    return _Url;
}

- (UIImageView *)bottomImg
{
    if (!_bottomImg) {
        UIImageView *img = [UIImageView new];
        img.contentMode = UIViewContentModeScaleAspectFill;
        img.image = [UIImage imageNamed:@"login_bottom"];
        _bottomImg = img;
    }
    return _bottomImg;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    UIView * view = [super hitTest:point withEvent:event];
    if (![view isEqual:self.loginBtn]) {
        CGPoint newPoint = [self.loginBtn convertPoint:point fromView:self];
        if (CGRectContainsPoint(self.loginBtn.bounds, newPoint)) {
            view = self.loginBtn;
        }
    }
    return view;
}

@end
