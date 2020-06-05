//
//  SYMessageCell.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYMessageCell.h"
#import "SYMessageTxtModel.h"
#import "NSBundle+SYLanguage.h"

@interface SYMessageCell ()

@property (nonatomic, strong) UILabel *nickNameLbl;     // 昵称
@property (nonatomic, strong) UILabel *timeLbl;         // 时间
@property (nonatomic, strong) UILabel *contentLbl;      // 内容
@property (nonatomic, strong) SYMessageTxtModel *txtModel;
@property (nonatomic, strong) NSDateFormatter *formatter;   // 时间转换

@end

@implementation SYMessageCell
- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        [self setup];
    }
    return self;
}

- (void)setup
{
    self.selectionStyle = UITableViewCellSelectionStyleNone;
    [self.contentView addSubview:self.nickNameLbl];
    [self.contentView addSubview:self.timeLbl];
    [self.contentView addSubview:self.contentLbl];
    
    [self setupLayout];
}

- (void)setupLayout
{
    [self.nickNameLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_offset(8.f);
        make.top.mas_offset(0.f);
        make.right.mas_equalTo(self.timeLbl.mas_left).mas_offset(-12.f);
        make.height.mas_offset(17.f);
    }];
    [self.timeLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_offset(-5.f);
        make.centerY.height.mas_equalTo(self.nickNameLbl);
    }];
    [self.contentLbl mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(self.nickNameLbl.mas_bottom).mas_offset(1.f);
        make.left.mas_equalTo(self.nickNameLbl);
        make.right.mas_equalTo(self.timeLbl);
        make.bottom.mas_offset(-5.f);
    }];
}

- (void)setDataWithUserId:(NSString *)userId teacherId:(NSString *)teacherId txtModel:(SYMessageTxtModel *)txtModel
{
    self.nickNameLbl.text = [NSString stringWithFormat:@"%@:", txtModel.nickname];
    self.contentLbl.text = txtModel.message;
    self.timeLbl.text = [self getCurrentTimeStringWithTimeIntervalStr:txtModel.sendTime];
    
    if ([userId isEqualToString:txtModel.sendUserId]) {// 自己发送
        self.contentLbl.textColor = [UIColor colorWithRed:0/255.0 green:146/255.0 blue:255/255.0 alpha:1.0];
        self.nickNameLbl.text = [NSBundle yy_localizedStringWithKey:@"我:"];
    } else if ([teacherId isEqualToString:txtModel.sendUserId]) {// 老师发送
        self.contentLbl.textColor = [UIColor colorWithRed:0/255.0 green:186/255.0 blue:158/255.0 alpha:1.0];
        self.nickNameLbl.text = [NSBundle yy_localizedStringWithKey:@"老师:"];
    } else {// 其他人发送
        self.contentLbl.textColor = [UIColor colorWithRed:102/255.0 green:102/255.0 blue:102/255.0 alpha:1.0];
    }
}

- (NSString *)getCurrentTimeStringWithTimeIntervalStr:(NSString *)timeIntervalStr
{
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:timeIntervalStr.doubleValue];
    NSString *str = [self.formatter stringFromDate:date];
    return str;
}

#pragma mark - Getter & Setter
- (UILabel *)nickNameLbl
{
    if (!_nickNameLbl) {
        UILabel *label = [UILabel new];
        label.font = [UIFont systemFontOfSize:12.f];
        label.textColor = [UIColor colorWithRed:153/255.0 green:153/255.0 blue:153/255.0 alpha:1.0];
        _nickNameLbl = label;
    }
    return _nickNameLbl;
}

- (UILabel *)timeLbl
{
    if (!_timeLbl) {
        UILabel *label = [UILabel new];
        label.font = [UIFont systemFontOfSize:12.f];
        label.textColor = [UIColor colorWithRed:187/255.0 green:187/255.0 blue:187/255.0 alpha:1.0];
        _timeLbl = label;
    }
    return _timeLbl;
}

- (UILabel *)contentLbl
{
    if (!_contentLbl) {
        UILabel *label = [UILabel new];
        label.font = [UIFont systemFontOfSize:12.f];
        label.numberOfLines = 0;
        _contentLbl = label;
    }
    return _contentLbl;
}

- (NSDateFormatter *)formatter
{
    if (!_formatter) {
        NSDateFormatter *formatter = [NSDateFormatter new];
        [formatter setDateFormat:@"HH:mm"];
        _formatter = formatter;
    }
    return _formatter;
}

@end
