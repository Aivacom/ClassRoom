//
//  SYBigToolView.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYBigToolView.h"
#import "SYConsoleManager.h"
#import "NSBundle+SYLanguage.h"

@interface SYBigToolView ()

@property (nonatomic, strong) UIStackView *stackView;       ///< 容器 view
@property (nonatomic, strong) UIButton *consoleBtn;         ///< 控制台 btn
@property (nonatomic, strong) UIButton *handleBtn;          ///< 举手

@end

@implementation SYBigToolView

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
    [self addSubview:self.stackView];
    [self.stackView addArrangedSubview:self.consoleBtn];
    [self.stackView addArrangedSubview:self.handleBtn];

    [self setupLayout];
    [self setHandleBtnStatus:SYHandleBtnStatusHidden];
}

- (void)setupLayout
{
    [self.stackView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_offset(0.f);
    }];
}

#pragma mark - Event
- (void)consoleBtnClicked:(UIButton *)sender
{
    sender.selected = !sender.isSelected;
    if ([self.delegate respondsToSelector:@selector(clickConsoleBtn)]) {
        [self.delegate clickConsoleBtn];
    }
}

- (void)handleBtnClicked:(UIButton *)sender
{
    if ([self.delegate respondsToSelector:@selector(clickHandleBtn:)]) {
        [self.delegate clickHandleBtn:!sender.selected];
    }
}

- (void)setHandleBtnStatus:(SYHandleBtnStatus)status
{
    self.handleBtn.enabled = YES;
    switch (status) {
        case SYHandleBtnStatusNormal:
            [self.handleBtn setImage:[UIImage imageNamed:@"live_handleNormal"] forState:UIControlStateNormal];
            self.handleBtn.selected = NO;
            break;
        case SYHandleBtnStatusHandleSuc:
            [self.handleBtn setImage:[UIImage imageNamed:@"live_handling"] forState:UIControlStateNormal];
            self.handleBtn.selected = YES;
            break;
        case SYHandleBtnStatusDisable:
            [self.handleBtn setImage:[UIImage imageNamed:@"live_audioing"] forState:UIControlStateNormal];
            self.handleBtn.enabled = NO;
            break;
        case SYHandleBtnStatusShow:
//            !self.handleBtn.hidden?:[self.stackView addArrangedSubview:self.handleBtn];
            self.handleBtn.alpha = 1.f;
            // 重置回初始状态
            [self.handleBtn setImage:[UIImage imageNamed:@"live_handleNormal"] forState:UIControlStateNormal];
            self.handleBtn.selected = NO;
            break;
        case SYHandleBtnStatusHidden:
//            self.handleBtn.hidden?:[self.stackView removeArrangedSubview:self.handleBtn];
            self.handleBtn.alpha = 0.f;
            break;
    }
}

#pragma mark - Getter & Setter
- (UIStackView *)stackView
{
    if (!_stackView) {
        UIStackView *view = [UIStackView new];
        view.backgroundColor = [UIColor greenColor];
        view.axis = UILayoutConstraintAxisHorizontal;
        view.distribution = UIStackViewDistributionEqualSpacing;
        view.alignment = UIStackViewAlignmentCenter;
        view.spacing = 15.f;
        _stackView = view;
    }
    return _stackView;
}

- (UIButton *)consoleBtn
{
    if (!_consoleBtn) {
        UIButton *btn = [UIButton new];
        [btn setImage:[UIImage imageNamed:@"live_console"] forState:UIControlStateNormal];
        [btn setImage:[UIImage imageNamed:@"live_console_disable"] forState:UIControlStateSelected];
        [btn addTarget:self action:@selector(consoleBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _consoleBtn = btn;
    }
    return _consoleBtn;
}

- (UIButton *)handleBtn
{
    if (!_handleBtn) {
        UIButton *btn = [UIButton new];
        [btn setImage:[UIImage imageNamed:@"live_handleNormal"] forState:UIControlStateNormal];
        [btn addTarget:self action:@selector(handleBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _handleBtn = btn;
    }
    return _handleBtn;
}

@end
