//
//  SYLoginViewTextField.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYLoginViewTextField.h"
#import "UITextField+SYAdditions.h"
#import "MBProgressHUD+SYHUD.h"
#import "NSBundle+SYLanguage.h"

@interface SYLoginViewTextField ()<UITextFieldDelegate>

@property (nonatomic, strong) UIView *leftNormalView;       // 左侧占位图
@property (nonatomic, strong) UIView *rightNormalView;      // 右侧占位图
@property (nonatomic, strong) UIButton *deleteAllBtn;       // 全删按钮

@end

@implementation SYLoginViewTextField

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
    self.isAllowStartWithZero = YES;
    self.delegate = self;
    self.backgroundColor = [UIColor whiteColor];
    self.layer.borderColor = [UIColor colorWithRed:230/255.0 green:230/255.0 blue:230/255.0 alpha:1.0].CGColor;
    self.layer.borderWidth = 0.5f;
    self.layer.cornerRadius = 4.f;
    self.font = [UIFont systemFontOfSize:15.f];
    self.textColor = [UIColor colorWithRed:102/255.0 green:102/255.0 blue:102/255.0 alpha:1.0];
    
    [self.rightNormalView addSubview:self.deleteAllBtn];
    self.leftView = self.leftNormalView;
    self.rightView = self.rightNormalView;
    self.leftViewMode = UITextFieldViewModeAlways;
    self.rightViewMode = UITextFieldViewModeAlways;
    
    [self addTarget:self action:@selector(filedChanged) forControlEvents:UIControlEventEditingChanged];
}

#pragma mark - Event
- (void)deleteAllBtnClicked:(UIButton *)sender
{
    self.text = @"";
    self.rightNormalView.hidden = YES;
}

- (void)filedChanged
{
    self.rightNormalView.hidden = !self.text.length;
}

#pragma mark - UITextFieldDelegate
- (BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string
{
    if (!self.isAllowStartWithZero && 0 == textField.text.length && string.length && 0 == string.integerValue) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:self.zeroToastString]];
        return NO;
    }
    return string.length ? [self yy_isInputNum:string] : YES;
}

#pragma mark - Getter & Setter
- (UIView *)leftNormalView
{
    if (!_leftNormalView) {
        UIView *view = [UIView new];
        view.frame = (CGRect){0,0,12,0};
        _leftNormalView = view;
    }
    return _leftNormalView;
}

- (UIView *)rightNormalView
{
    if (!_rightNormalView) {
        UIView *view = [UIView new];
        view.frame = (CGRect){0,0,36,36};
        view.hidden = YES;
        _rightNormalView = view;
    }
    return _rightNormalView;
}

- (UIButton *)deleteAllBtn
{
    if (!_deleteAllBtn) {
        UIButton *btn = [UIButton new];
        btn.frame = (CGRect){0,0,36,36};
        [btn setImage:[UIImage imageNamed:@"login_deleteAll"] forState:UIControlStateNormal];
        [btn addTarget:self action:@selector(deleteAllBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _deleteAllBtn = btn;
    }
    return _deleteAllBtn;
}

@end
