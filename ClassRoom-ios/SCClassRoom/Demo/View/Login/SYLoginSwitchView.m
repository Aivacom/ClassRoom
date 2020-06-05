//
//  SYLoginSwitchView.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYLoginSwitchView.h"

@interface SYLoginSwitchView ()

@property (nonatomic, strong) UILabel *nameLbl;     // 类型名称
@property (nonatomic, strong) UIButton *underBtn;   // 下来按钮

@end

@implementation SYLoginSwitchView

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
    self.layer.cornerRadius = 4.f;
    self.backgroundColor = [UIColor colorWithRed:235/255.0 green:248/255.0 blue:246/255.0 alpha:1.0];
    
    
    [self addSubview:self.nameLbl];
    [self addSubview:self.underBtn];
    
    [self setupLayout];
}

- (void)setupLayout
{
    [self.nameLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.center.mas_offset(0.f);
        make.height.mas_offset(16.f);
    }];
    [self.underBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerY.right.mas_offset(0.f);
        make.size.mas_offset(35.f);
    }];
}

#pragma mark - Event
- (void)underBtnClicked:(UIButton *)sender
{
    
}

#pragma mark - Getter & Setter
- (void)setTypeName:(NSString *)typeName
{
    _typeName = typeName;
    self.nameLbl.text = typeName;
}

- (UILabel *)nameLbl
{
    if (!_nameLbl) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor colorWithRed:84/255.0 green:190/255.0 blue:170/255.0 alpha:1.0];
        label.font = [UIFont boldSystemFontOfSize:15.f];
        _nameLbl = label;
    }
    return _nameLbl;
}

- (UIButton *)underBtn
{
    if (!_underBtn) {
        UIButton *btn = [UIButton new];
        [btn setImage:[UIImage imageNamed:@"login_dropdown"] forState:UIControlStateNormal];
        [btn addTarget:self action:@selector(underBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _underBtn = btn;
    }
    return _underBtn;
}

@end
