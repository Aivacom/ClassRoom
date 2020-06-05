//
//  SYCanvasView.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/5.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYCanvasView.h"

@interface SYCanvasView ()

@property (nonatomic, strong) UIView *canvasView;           // 画布承载视图
@property (nonatomic, strong) UIImageView *normalImg;       // 默认图 img
@property (nonatomic, strong) UILabel *nicknameLbl;         // 老师名称 lbl

@end

@implementation SYCanvasView

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
    UIView *view = [UIView new];
    view.backgroundColor = [UIColor blackColor];
    _canvasView = view;
    [self addSubview:self.canvasView];
    [self addSubview:self.normalImg];
    [self addSubview:self.nicknameLbl];

    [self setupLayout];
}

- (void)setupLayout
{
    _showNormalImage = YES;
    [self.canvasView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_offset(0.f);
    }];
    [self.nicknameLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.mas_offset(-6.f);
        make.left.mas_offset(6.f);
        make.right.mas_offset(-6.f);
        make.height.mas_offset(17.f);
    }];
    [self.normalImg mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_offset(0.f);
    }];
}

#pragma mark - Event
- (void)setNickname:(NSString *)nickname
{
    self.nicknameLbl.text = nickname;
}

- (void)showNormalImg
{
    _showNormalImage = YES;
    self.normalImg.hidden = NO;
}

- (void)hiddenNormalImg
{
    _showNormalImage = NO;
    self.normalImg.hidden = YES;
}

- (void)conciseModelView
{
    self.normalImg.hidden = YES;
}

- (void)removeSubviewOfCanvas
{
    for (UIView *subview in self.canvasView.subviews) {
        [subview removeFromSuperview];
    }
}

#pragma mark - Getter & Setter
- (UIImageView *)normalImg
{
    if (!_normalImg) {
        UIImageView *img = [UIImageView new];
        img.backgroundColor = [UIColor colorWithRed:66/255.0 green:66/255.0 blue:66/255.0 alpha:1.0];
        img.contentMode = UIViewContentModeCenter;
        img.image = [UIImage imageNamed:@"live_placeholder"];
        _normalImg = img;
    }
    return _normalImg;
}

- (UILabel *)nicknameLbl
{
    if (!_nicknameLbl) {
        UILabel *label = [UILabel new];
        label.textColor = [UIColor whiteColor];
        label.font = [UIFont systemFontOfSize:12.f];
        _nicknameLbl = label;
    }
    return _nicknameLbl;
}

@end
