//
//  SYBigStatusView.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYBigStatusView.h"
#import "NSBundle+SYLanguage.h"

@interface SYBigStatusView ()

@property (nonatomic, strong) CAGradientLayer *gradientLayer;   // 渐变色
@property (nonatomic, strong) UIButton *closeBtn;               // 退出 btn
@property (nonatomic, strong) UILabel *classRoomNameLbl;        // 课堂名称 lbl
@property (nonatomic, strong) UIView *lineView;                 // 分割线
@property (nonatomic, strong) UILabel *nickNameLbl;             // 昵称 lbl
@property (nonatomic, strong) UIButton *feedbackBtn;            // 课堂评价 btn
@property (nonatomic, strong) UIImageView *networkQualityImg;   // 网络质量

@end

@implementation SYBigStatusView

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setup];
    }
    return self;
}

- (void)setup
{
    [self.layer addSublayer:self.gradientLayer];
    [self addSubview:self.closeBtn];
    [self addSubview:self.classRoomNameLbl];
    [self addSubview:self.lineView];
    [self addSubview:self.nickNameLbl];
    [self addSubview:self.feedbackBtn];
    [self addSubview:self.networkQualityImg];
    
    [self setupLayout];
}

- (void)setupLayout
{
    [self.closeBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.mas_offset(0.f);
        make.size.mas_offset(44.f);
    }];
    [self.classRoomNameLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.closeBtn.mas_right);
        make.centerY.mas_equalTo(self.closeBtn);
    }];
    [self.lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.classRoomNameLbl.mas_right).mas_offset(6.f);
        make.centerY.mas_equalTo(self.classRoomNameLbl);
        make.width.mas_offset(0.5f);
        make.height.mas_offset(11.f);
    }];
    [self.nickNameLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.lineView.mas_right).mas_offset(5.f);
        make.centerY.mas_equalTo(self.closeBtn);
    }];
    [self.feedbackBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(self.networkQualityImg.mas_left).mas_offset(-10.f);
        make.centerY.mas_equalTo(self.closeBtn);
        make.height.mas_offset(26.f);
    }];
    [self.networkQualityImg mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_offset(-14.f);
        make.centerY.mas_equalTo(self.closeBtn);
        make.width.mas_offset(21.f);
        make.height.mas_offset(14.f);
    }];
    
    [self performSelector:@selector(hiddenStatusView) withObject:nil afterDelay:5.f];
}

- (void)layoutSubviews
{
    self.gradientLayer.frame = (CGRect){0, 0, self.frame.size.width, self.frame.size.height};
}

#pragma mark - Event
- (void)closeBtnClicked:(UIButton *)sender
{
    if ([self.delegate respondsToSelector:@selector(clickCloseBtn)]) {
        [self.delegate clickCloseBtn];
    }
}

- (void)feedbackBtnClicked:(UIButton *)sender
{
    if ([self.delegate respondsToSelector:@selector(clickFeedbackBtn)]) {
        [self.delegate clickFeedbackBtn];
    }
}

- (void)setClassRoomName:(NSString *)classRoomName nickname:(NSString *)nickname
{
    self.classRoomNameLbl.text = classRoomName;
    self.nickNameLbl.text = nickname;
}

- (void)showOrHiddenStatusView
{
    self.hidden ? [self showStatusView] : [self hiddenStatusView];
}

- (void)showStatusView
{
    self.hidden = NO;
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(hiddenStatusView) object:nil];
    [UIView animateWithDuration:0.25 animations:^{
        self.alpha = 1.f;
    }];
    [self performSelector:@selector(hiddenStatusView) withObject:nil afterDelay:5.f];
}

- (void)cancelHiddenStatusView
{
    self.hidden = NO;
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(hiddenStatusView) object:nil];
}

- (void)hiddenStatusView
{
    self.hidden = YES;
    self.alpha = 0.f;
}

- (void)setNetworkQuality:(SYNetworkQuality)quality
{
    switch (quality) {
        case SYNetworkQualityUnknown:
            self.networkQualityImg.image = [UIImage imageNamed:@"signal_quality_very_bad"];
            break;
        case SYNetworkQualityVeryBad:
            self.networkQualityImg.image = [UIImage imageNamed:@"signal_quality_ordinary"];
            break;
        case SYNetworkQualityGenral:
            self.networkQualityImg.image = [UIImage imageNamed:@"signal_quality_preferably"];
            break;
        case SYNetworkQualityGood:
            self.networkQualityImg.image = [UIImage imageNamed:@"signal_quality_better"];
            break;
    }
}

#pragma mark - Getter & Setter
- (CAGradientLayer *)gradientLayer
{
    if (!_gradientLayer) {
        CAGradientLayer *layer = [CAGradientLayer new];
        layer.colors = @[(__bridge id)[UIColor colorWithRed:32/255.0 green:42/255.0 blue:41/255.0 alpha:0.8].CGColor,
                         (__bridge id)[UIColor colorWithRed:68/255.0 green:84/255.0 blue:83/255.0 alpha:0].CGColor];
        layer.startPoint = (CGPoint){0,0};
        layer.endPoint = (CGPoint){0,1};
        layer.locations = @[@0, @1];
        _gradientLayer = layer;
    }
    return _gradientLayer;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        UIButton *btn = [UIButton new];
        [btn setImage:[UIImage imageNamed:@"live_back"] forState:UIControlStateNormal];
        [btn addTarget:self action:@selector(closeBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _closeBtn = btn;
    }
    return _closeBtn;
}

- (UILabel *)classRoomNameLbl
{
    if (!_classRoomNameLbl) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor whiteColor];
        label.alpha = 0.9f;
        label.font = [UIFont systemFontOfSize:15.f];
        _classRoomNameLbl = label;
    }
    return _classRoomNameLbl;
}

- (UIView *)lineView
{
    if (!_lineView) {
        UIView *view = [UIView new];
        view.backgroundColor = [UIColor whiteColor];
        view.alpha = 0.5;
        _lineView = view;
    }
    return _lineView;
}

- (UILabel *)nickNameLbl
{
    if (!_nickNameLbl) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor whiteColor];
        label.alpha = 0.5;
        label.font = [UIFont systemFontOfSize:12.f];
        _nickNameLbl = label;
    }
    return _nickNameLbl;
}

- (UIButton *)feedbackBtn
{
    if (!_feedbackBtn) {
        UIButton *btn = [UIButton new];
        [btn setTitle:[NSBundle yy_localizedStringWithKey:@"课堂评价"] forState:UIControlStateNormal];
        btn.titleLabel.font = [UIFont systemFontOfSize:12.f];
        [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        btn.backgroundColor = [UIColor colorWithRed:255/255.0 green:255/255.0 blue:255/255.0 alpha:0.17];
        btn.layer.cornerRadius = 4.f;
        [btn setImage:[UIImage imageNamed:@"login_feedback"] forState:UIControlStateNormal];
        [btn setImageEdgeInsets:(UIEdgeInsets){0.f, -2.f, 0.f, 2.f}];
        [btn setTitleEdgeInsets:(UIEdgeInsets){0.f, 2.f, 0.f, -2.f}];
        [btn setContentEdgeInsets:(UIEdgeInsets){0.f, 9.f, 0.f, 7.f}];
        [btn addTarget:self action:@selector(feedbackBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _feedbackBtn = btn;
    }
    return _feedbackBtn;
}

- (UIImageView *)networkQualityImg
{
    if (!_networkQualityImg) {
        UIImageView *img = [UIImageView new];
        img.contentMode = UIViewContentModeScaleAspectFit;
        img.image = [UIImage imageNamed:@"signal_quality_better"];
        _networkQualityImg = img;
    }
    return _networkQualityImg;
}

@end
